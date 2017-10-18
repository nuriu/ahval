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
    /// Defines and handles operations involving weekly note items.
    /// </summary>
    [Authorize]
    public class NotesController : Controller
    {
        /// <summary>
        /// Database context.
        /// </summary>
        private AjandaDbContext db;
        
        /// <summary>
        /// Constructs class and defines database context.
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public NotesController(AjandaDbContext databaseContext)
        {
            db = databaseContext;
        }

        /// <summary>
        /// Retrieves note items of the user that signed in.
        /// </summary>
        /// <returns>Note items of the signed in user.</returns>
        [HttpGet]
        public async Task<IActionResult> GetMyNotes()
        {
            // find signed in user
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            // find item type
            var itemType = await db.WeeklyItemTypes.FirstOrDefaultAsync(wit => wit.Name == "NOTE");

            var itemIds = db.UserWeeklyItems.Include("User")
                                            .Where(uwi => uwi.User == user && uwi.Type == itemType)
                                            .Select(uwi => uwi.Item_Id);

            var notes = db.Notes.Where(n => itemIds.Contains(n.Id));

            return Ok(notes);
        }

        /// <summary>
        /// Adds new note for the user with given info.
        /// </summary>
        /// <param name="nvm">Note info.</param>
        /// <returns>Status.</returns>
        [HttpPost]
        public async Task<IActionResult> AddNote([FromBody] AddNoteViewModel nvm)
        {
            if (nvm == null)
            {
                return BadRequest();
            }

            // find signed in user
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            // find item type
            var itemType = await db.WeeklyItemTypes.FirstOrDefaultAsync(wit => wit.Name == "NOTE");

            Note n = new Note {
                Body = nvm.Body
            };

            await db.Notes.AddAsync(n);

            UserWeeklyItem item = new UserWeeklyItem {
                Type = itemType,
                Date = nvm.Date,
                Item_Id = n.Id,
                User = user
            };

            await db.UserWeeklyItems.AddAsync(item);

            await db.SaveChangesAsync();

            return Ok(item);
        }

        /// <summary>
        /// Retrieves note list that user has assigned to specified date.
        /// </summary>
        /// <param name="date">Assigned date.</param>
        /// <returns>Note list.</returns>
        [HttpGet]
        public async Task<IActionResult> GetNotesForDate(string date)
        {
            // find signed in user
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            // find item type
            var itemType = await db.WeeklyItemTypes.FirstOrDefaultAsync(wit => wit.Name == "NOTE");
            // find item ids
            var itemIds = db.UserWeeklyItems.Include("User")
                                            .Where(uwi => uwi.User == user && uwi.Type == itemType && uwi.Date == date)
                                            .Select(uwi => uwi.Item_Id);
            // select notes with corresponding item ids
            var notes = db.Notes.Where(n => itemIds.Contains(n.Id));

            return Ok(notes);
        }
    }
}
