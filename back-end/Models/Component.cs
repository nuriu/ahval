using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ajanda.Models
{
    public class Component
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        public virtual ICollection<UserComponent> ComponentUsers { get; set; }
        public virtual State State { get; set; }
    }
}