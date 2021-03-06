using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ahval.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [MaxLength(25)]
        public string Username { get; set; }
        [Required]
        [MaxLength(255)]
        public string Password { get; set; }
        [MaxLength(64)]
        public string EmailAddress { get; set; }
        [Required]
        public DateTime RegisteredAt { get; set; }
        public DateTime LastLoggedInAt { get; set; }
        public virtual ICollection<UserComponents> UserComponents { get; set; }
        public virtual ICollection<UserWeeklyItem> WeeklyItems { get; set; }
        [Required]
        public virtual State State { get; set; }
    }
}