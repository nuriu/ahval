using System;
using System.ComponentModel.DataAnnotations;

namespace Ajanda.Models
{
    public class Issue
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [MaxLength(25)]
        public string Name { get; set; }
        [Required]
        public Component Component { get; set; }
        [Required]
        public string RepoIdentifier { get; set; }
        [Required]
        public int Number { get; set; }
    }
}