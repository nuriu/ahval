using System;
using System.ComponentModel.DataAnnotations;

namespace Ahval.Models
{
    public class WeeklyItemType
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [MaxLength(25)]
        public string Name { get; set; }
    }
}