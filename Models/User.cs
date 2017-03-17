﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Ajanda.Models
{
    public class User
    {
        public ObjectId Id { get; set; }
        [BsonElement("UserId")]
        public int UserId { get; set; }
        [BsonElement("Username")]
        public string Username { get; set; }
        [BsonElement("Password")]
        public string Password { get; set; }
    }
}
