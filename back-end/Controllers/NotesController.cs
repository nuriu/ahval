using System;
using System.Collections.Generic;
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
                Item_Id = n.Id,
                User = user,
                RowNumber = nvm.RowNumber,
                Date = nvm.Date
            };

            await db.UserWeeklyItems.AddAsync(item);

            await db.SaveChangesAsync();

            return Ok(n);
        }

        /// <summary>
        /// Removes note that has given info from the database.
        /// </summary>
        /// <param name="nvm">Note info.</param>
        /// <returns>Status.</returns>
        [HttpPost]
        public async Task<IActionResult> RemoveNote([FromBody] Note n)
        {
            if (n == null)
            {
                return NotFound("Id must be given.");
            }

            var note = await db.Notes.FindAsync(n.Id);

            if (note == null)
            {
                return BadRequest("Note does not exists.");
            }

            var item = await db.UserWeeklyItems.FirstOrDefaultAsync(uwi => uwi.Item_Id == note.Id);

            if (item == null)
            {
                return BadRequest("Item does not exists.");
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);

            if (item.User == user)
            {
                db.Notes.Remove(note);
                db.UserWeeklyItems.Remove(item);
                
                await db.SaveChangesAsync();
            }
            else
            {
                return BadRequest();
            }

            return Ok();
        }

        /// <summary>
        /// Retrieves note list that user has assigned to specified date.
        /// </summary>
        /// <param name="date">Assigned date.</param>
        /// <returns>Note list.</returns>
        [HttpGet]
        public async Task<IActionResult> GetNotesForWeek(string monday)
        {
            List<string> dateRange = new List<string>();
            var d = Convert.ToDateTime(monday);

            for (int i = 0; i < 7; ++i)
            {
                dateRange.Add(d.AddDays(i).ToShortDateString());
            }

            // find signed in user
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            
            // find item type
            var itemType = await db.WeeklyItemTypes.FirstOrDefaultAsync(wit => wit.Name == "NOTE");
            
            // select notes ordered by row number
            var notes = db.UserWeeklyItems.Include("User")
                                            .Where(uwi => uwi.User == user && uwi.Type == itemType && dateRange.Contains(uwi.Date))
                                            .OrderBy(uwi => uwi.RowNumber)
                                            .Select(uwi => new {
                                                id = uwi.Item_Id,
                                                date = uwi.Date,
                                                row = uwi.RowNumber,
                                                body = db.Notes.FirstOrDefault(n => n.Id == uwi.Item_Id).Body
                                            });

            return Ok(notes);
        }
    }
}
