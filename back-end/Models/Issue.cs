using System;
using System.ComponentModel.DataAnnotations;

namespace Ahval.Models
{
    public class Issue
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Component Component { get; set; }
        [Required]
        public string RepoIdentifier { get; set; }
        [Required]
        public int Number { get; set; }
    }
}