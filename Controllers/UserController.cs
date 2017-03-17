using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

using Ajanda.Models;

namespace Ajanda.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private MongoClient                   client;
        private IMongoDatabase                db;
        private IMongoCollection<User>        users;
        private FilterDefinitionBuilder<User> builder;
        private FilterDefinition<User>        filter;

        public UserController()
        {
            client  = new MongoClient("mongodb://localhost:27017");
            db      = client.GetDatabase("ajanda");
            users   = db.GetCollection<User>("users");
            builder = Builders<User>.Filter;
        }

        public bool IsUserExists(string username, string password)
        {
            filter  = builder.Eq(u => u.Username, username) &
                      builder.Eq(u => u.Password, password);
            return users.FindSync(filter).Any();
        }
    }
}
