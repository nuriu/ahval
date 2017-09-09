using System;
using System.Linq;
using System.Threading.Tasks;
using Ajanda.Helpers;
using Ajanda.Models;
using Ajanda.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ajanda.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private AjandaDbContext db;

        public AccountController(AjandaDbContext databaseContext)
        {
            db = databaseContext;
        }

        [HttpGet]
        public IActionResult Me()
        {
            var user = db.Users.Include("State").Include("UserComponents").FirstOrDefault(u => u.Username == User.Identity.Name);
            return Ok(user);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var userWithSameUsername = await db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);

            if (userWithSameUsername == null)
            {
                User userModel = new User
                {
                    Username = user.Username,
                    Password = CryptoHelper.HashPassword(user.Password),
                    EmailAddress = user.EmailAddress,
                    RegisteredAt = DateTime.UtcNow,
                    State = db.States.FirstOrDefault(s => s.Name == "ACTIVE")
                };

                await db.Users.AddAsync(userModel);
                await db.SaveChangesAsync();

                return Ok(new { success = true });
            }
            else
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Registration failed. User with same username exists."
                });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateUserViewModel user)
        {
            var dbUser = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);

            if (CryptoHelper.VerifyHashedPassword(dbUser.Password, user.OldPassword))
            {
                dbUser.Password = CryptoHelper.HashPassword(user.NewPassword);
                dbUser.EmailAddress = user.newEmailAddress;

                db.Entry(dbUser).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return Ok(new {success = true});
            }
            else
            {
                return Ok(new {success = false});
            }
        }
    }
}
