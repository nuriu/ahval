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
    /// <summary>
    /// Defines and handles operations involving account.
    /// </summary>
    [Authorize]
    public class AccountController : Controller
    {
        /// <summary>
        /// Database context.
        /// </summary>
        private AjandaDbContext db;
        
        /// <summary>
        /// Constructs class and defines database context.
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public AccountController(AjandaDbContext databaseContext)
        {
            db = databaseContext;
        }

        /// <summary>
        /// Handles user registration asynchronously.
        /// </summary>
        /// <param name="user">User that will be registered.</param>
        /// <returns>Success status. (True / False)</returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("api/register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            // find user with same username
            var userWithSameUsername = await db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
            // if user doesn't exists
            if (userWithSameUsername == null)
            {
                // create user
                User userModel = new User
                {
                    Username = user.Username,
                    Password = CryptoHelper.HashPassword(user.Password),
                    EmailAddress = user.EmailAddress,
                    RegisteredAt = DateTime.UtcNow,
                    State = db.States.FirstOrDefault(s => s.Name == "ACTIVE")
                };

                // add and save asynchronously.
                await db.Users.AddAsync(userModel);
                await db.SaveChangesAsync();

                return Ok(new { success = true });
            }
            else
            {
                // if user exists return badrequest
                return BadRequest(new
                {
                    success = false,
                    message = "Registration failed. User with same username exists."
                });
            }
        }

        /// <summary>
        /// Retrieves information of user that signed in.
        /// </summary>
        /// <returns>Information of signed in user.</returns>
        [HttpGet]
        public async Task<IActionResult> Me()
        {
            return Ok(await db.Users.Include("State").Include("UserComponents").FirstOrDefaultAsync(u => u.Username == User.Identity.Name));
        }

        /// <summary>
        /// Updates user information with given ones.
        /// </summary>
        /// <param name="user">New user informations.</param>
        /// <returns>Success status. (True / False)</returns>
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateUserViewModel user)
        {
            // find signed in user
            var dbUser = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            // if user entered right password
            if (CryptoHelper.VerifyHashedPassword(dbUser.Password, user.OldPassword))
            {
                // update password and email address with new ones
                dbUser.Password = CryptoHelper.HashPassword(user.NewPassword);
                dbUser.EmailAddress = user.newEmailAddress;
                // save changes
                db.Entry(dbUser).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return Ok(new {success = true});
            }
            else
            {
                return Ok(new {success = false});
            }
        }

        /// <summary>
        /// Retrieves component list that user has access rights.
        /// </summary>
        /// <returns>Minimal user info with component list.</returns>
        [HttpGet]
        public async Task<IActionResult> GetUserComponents()
        {
            var components = await db.Users.Include("State").Include("UserComponents.Component")
            .Where((u => u.Username == User.Identity.Name)).Select(u => new {
                u.Id,
                State = u.State.Name,
                UserComponents = u.UserComponents.Select(uc => new {
                    Component = uc.Component.Name,
                    uc.AccessToken
                }).ToList()
            }).FirstOrDefaultAsync();

            return Ok(components);
        }

        /// <summary>
        /// Checks whether user has the specified component.
        /// </summary>
        /// <param name="componentName">Name of the component.</param>
        /// <returns>Availability status of the component.</returns>
        [HttpGet]
        public async Task<Boolean> HasComponent(string componentName)
        {
            componentName = componentName.ToUpper();

            var user = await db.Users.Include("UserComponents.Component")
            .FirstOrDefaultAsync(u => u.Username == User.Identity.Name);

            return user.UserComponents.Any(uc => uc.Component.Name == componentName);
        }
    }
}
