using System;
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
    [Route("/api/[controller]/[action]")]
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
        /// <returns>Id of matching user document or null.</returns>
        public JsonResult Login(string username, string password)
        {
            User user = users.Find(u => u.Username == username &&
                                        u.Password == password).FirstOrDefault();

            if (user != null)
            {
                return Json(user.Id.ToString());
            }
            else
            {
                return Json("null");
            }

        }

        /// <summary>
        /// Register new user with given data.
        /// </summary>
        /// <param name="username">Username for user that will be registered.</param>
        /// <param name="password">Password for user that will be registered.</param>
        /// <returns>Register status.</returns>
        public void RegisterUser(string username, string password)
        {
            users.InsertOne(new User{ Username = username, Password = password });
        }
    }
}
