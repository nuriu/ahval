using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Xml.Linq;

namespace Ajanda.Controllers
{
    /// <summary>
    /// Class that handles user transactions.
    /// </summary>
    [Route("/api/[controller]/[action]")]
    public class GithubController : Controller
    {
        /// <summary>
        /// MongoDB client.
        /// </summary>
        private MongoClient                    client;
        /// <summary>
        /// MongoDB database.
        /// </summary>
        private IMongoDatabase                 db;
        /// <summary>
        /// MongoDB collection.
        /// </summary>
        private IMongoCollection<BsonDocument> collection;
        /// <summary>
        /// MongoDB document.
        /// </summary>
        private BsonDocument                   document;

        /// <summary>
        /// Constructor for GithubController.
        /// </summary>
        public GithubController()
        {
            client     = new MongoClient("mongodb://localhost:27017");
            db         = client.GetDatabase("ajanda");
            collection = db.GetCollection<BsonDocument>("github");
            document   = collection.Find(new BsonDocument("name", "ajanda")).FirstOrDefault();
        }

        /// <summary>
        /// Getter for client_id.
        /// </summary>
        /// <returns>Client ID.</returns>
        public JsonResult getClientId()
        {
            return Json(document["client_id"].ToString());
        }

        /// <summary>
        /// Getter for client_secret.
        /// </summary>
        /// <returns>Client Secret.</returns>
        public JsonResult getClientSecret()
        {
            return Json(document["client_secret"].ToString());
        }

        /// <summary>
        /// Getter for scopes.
        /// </summary>
        /// <returns>Scopes.</returns>
        public JsonResult getScopes()
        {
            return Json(document["scope"].ToJson());
        }

        /// <summary>
        /// Getter for redirect url.
        /// </summary>
        /// <returns>Redirect URL.</returns>
        public JsonResult getRedirectUrl()
        {
            return Json(document["redirect_uri"].ToString());
        }
    }
}
