using System;
using System.ComponentModel.DataAnnotations;

namespace Ajanda.Models
{
    public class UserWeeklyItem
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public WeeklyItemType Type { get; set; }
        [Required]
        public Guid Item_Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
    }
}