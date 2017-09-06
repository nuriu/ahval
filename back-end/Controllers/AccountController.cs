using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ajanda.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

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
        public IActionResult GetMe()
        {
            var user = db.Users.Include("State").Include("UserComponents").FirstOrDefault(u => u.Username == User.Identity.Name);
            return Ok(user);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var userWithSameUsername = await db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);

            if (userWithSameUsername == null)
            {
                User userModel = new User
                {
                    Username = user.Username,
                    Password = user.Password,
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
    }
}
