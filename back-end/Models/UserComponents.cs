using System;

namespace Ahval.Models
{
    public class UserComponents
    {
        public Guid User_Id { get; set; }
        public virtual User User { get; set; }
        public Guid Component_Id { get; set; }
        public virtual Component Component { get; set; }
        public string AccessToken { get; set; }
    }
}