using System;
using System.ComponentModel.DataAnnotations;

namespace Ajanda.Models
{
    public class Note
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [MaxLength(250)]
        public string Body { get; set; }
        [Required]
        [MaxLength(10)]
        public string Date { get; set; }
    }
}