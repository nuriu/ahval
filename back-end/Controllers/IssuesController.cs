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
    /// Defines and handles operations involving weekly issue items.
    /// </summary>
    [Authorize]
    public class IssuesController : Controller
    {
        /// <summary>
        /// Database context.
        /// </summary>
        private AjandaDbContext db;
        
        /// <summary>
        /// Constructs class and defines database context.
        /// </summary>
        /// <param name="databaseContext">Database context.</param>
        public IssuesController(AjandaDbContext databaseContext)
        {
            db = databaseContext;
        }

        /// <summary>
        /// Retrieves issue items of the user that signed in.
        /// </summary>
        /// <returns>Issue items of the signed in user.</returns>
        [HttpGet]
        public async Task<IActionResult> GetMyIssues()
        {
            // find signed in user
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            // find item type
            var itemType = await db.WeeklyItemTypes.FirstOrDefaultAsync(wit => wit.Name == "ISSUE");

            var itemIds = db.UserWeeklyItems.Include("User")
                                            .Where(uwi => uwi.User == user && uwi.Type == itemType)
                                            .Select(uwi => uwi.Item_Id);

            var issues = db.Issues.Where(n => itemIds.Contains(n.Id));

            return Ok(issues);
        }

        /// <summary>
        /// Adds new issue for the user with given info.
        /// </summary>
        /// <param name="ivm">Issue info.</param>
        /// <returns>Status.</returns>
        [HttpPost]
        public async Task<IActionResult> AddIssue([FromBody] AddIssueViewModel ivm)
        {
            if (ivm == null)
            {
                return BadRequest();
            }

            // find signed in user
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            // find item type
            var itemType = await db.WeeklyItemTypes.FirstOrDefaultAsync(wit => wit.Name == "ISSUE");
            // find component
            var component = await db.Components.FirstOrDefaultAsync(c => c.Name == ivm.ComponentName);

            Issue i = new Issue {
                Component = component,
                RepoIdentifier = ivm.RepoIdentifier,
                Number = ivm.IssueNumber
            };

            await db.Issues.AddAsync(i);

            UserWeeklyItem item = new UserWeeklyItem {
                Type = itemType,
                Item_Id = i.Id,
                User = user,
                RowNumber = ivm.RowNumber,
                Date = ivm.Date
            };

            await db.UserWeeklyItems.AddAsync(item);

            await db.SaveChangesAsync();

            return Ok(i);
        }

        /// <summary>
        /// Removes issue that has given info from the database.
        /// </summary>
        /// <param name="i">Issue info.</param>
        /// <returns>Status.</returns>
        [HttpPost]
        public async Task<IActionResult> RemoveIssue([FromBody] Issue i)
        {
            if (i == null)
            {
                return NotFound("Id must be given.");
            }

            var issue = await db.Issues.FindAsync(i.Id);

            if (issue == null)
            {
                return BadRequest("Issue does not exists.");
            }

            var item = await db.UserWeeklyItems.FirstOrDefaultAsync(uwi => uwi.Item_Id == issue.Id);

            if (item == null)
            {
                return BadRequest("Item does not exists.");
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);

            if (item.User == user)
            {
                db.Issues.Remove(issue);
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
        /// Retrieves issue list that user has assigned to specified date.
        /// </summary>
        /// <param name="monday">First day of assignation week.</param>
        /// <returns>Issue list.</returns>
        [HttpGet]
        public async Task<IActionResult> GetIssuesForWeek(string monday)
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
            var itemType = await db.WeeklyItemTypes.FirstOrDefaultAsync(wit => wit.Name == "ISSUE");
            
            // select issues ordered by row number
            var issues = db.UserWeeklyItems.Include("User")
                                            .Where(uwi => uwi.User == user && uwi.Type == itemType && dateRange.Contains(uwi.Date))
                                            .OrderBy(uwi => uwi.RowNumber)
                                            .Select(uwi => new {
                                                id = uwi.Item_Id,
                                                date = uwi.Date,
                                                row = uwi.RowNumber,
                                                issue = db.Issues.FirstOrDefault(n => n.Id == uwi.Item_Id)
                                            });

            return Ok(issues);
        }
    }
}
