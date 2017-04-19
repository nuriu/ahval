using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Ajanda.Models
{
    /// <summary>
    /// User model.
    /// </summary>
    public class User
    {
        public ObjectId Id { get; set; }
        [BsonElement("UserId")]
        public int UserId { get; set; }
        [BsonElement("Username")]
        public string Username { get; set; }
        [BsonElement("Password")]
        public string Password { get; set; }
        /*
        [BsonElement("Components")]
        public IEnumerable<Component> Components { get; set; }
        */
    }
}
