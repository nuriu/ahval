using System;
using System.ComponentModel.DataAnnotations;

namespace Ahval.Models
{
    public class Note
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [MaxLength(250)]
        public string Body { get; set; }
    }
}