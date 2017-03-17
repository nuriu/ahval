using System;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core;

namespace Ajanda.Models
{
    public class DataAccess
    {
        MongoClient                     client;
        IMongoDatabase                  db;
        IMongoCollection<BsonDocument>  users;
        FilterDefinition<BsonDocument>  filter;

        public DataAccess()
        {
            client   = new MongoClient("mongodb://localhost:27017");
            db       = client.GetDatabase("ajanda");
            users    = db.GetCollection<BsonDocument>("users");
            filter   = Builders<BsonDocument>.Filter.Gte("username", "admin");

            var user = users.FindSync(filter).ForEachAsync(u =>
                Console.WriteLine("{0} - {1} - {2}", u["username"], u["password"], u["githubToken"])
            );

        }
    }
}
