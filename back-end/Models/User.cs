using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ajanda.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(25)]
        public string Username { get; set; }
        [MaxLength(64)]
        public string Password { get; set; }
        [MaxLength(64)]
        public string EmailAddress { get; set; }
        public DateTime RegisteredAt { get; set; }
        public DateTime LastLoggedInAt { get; set; }
        public virtual ICollection<UserComponent> UserComponents { get; set; }
        public virtual State State { get; set; }
    }
}