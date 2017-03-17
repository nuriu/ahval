using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

using Ajanda.Models;

namespace Ajanda.Controllers
{
    /// <summary>
    /// Class that handles user transactions.
    /// </summary>
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        /// <summary>
        /// MongoDB client.
        /// </summary>
        private MongoClient                   client;
        /// <summary>
        /// MongoDB database.
        /// </summary>
        private IMongoDatabase                db;
        /// <summary>
        /// MongoDB collection.
        /// </summary>
        private IMongoCollection<User>        users;
        /// <summary>
        /// MongoDB filter definition builder.
        /// </summary>
        private FilterDefinitionBuilder<User> builder;
        /// <summary>
        /// MongoDB filter for find operations.
        /// </summary>
        private FilterDefinition<User>        filter;

        /// <summary>
        /// Constructor for UserController.
        /// </summary>
        public UserController()
        {
            client  = new MongoClient("mongodb://localhost:27017");
            db      = client.GetDatabase("ajanda");
            users   = db.GetCollection<User>("users");
            builder = Builders<User>.Filter;
        }

        /// <summary>
        /// Checks if user exists in the database.
        /// </summary>
        /// <param name="username">Username that we're looking for match.</param>
        /// <param name="password">Password that we're looking for match.</param>
        /// <returns>Match status.</returns>
        public bool IsUserExists(string username, string password)
        {
            filter  = builder.Eq(u => u.Username, username) &
                      builder.Eq(u => u.Password, password);
            return users.FindSync(filter).Any();
        }
    }
}
