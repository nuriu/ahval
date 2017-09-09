﻿using System;
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
        public IActionResult Me()
        {
            var user = db.Users.Include("State").Include("UserComponents").FirstOrDefault(u => u.Username == User.Identity.Name);
            return Ok(user);
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
    }
}
