using System;
using System.ComponentModel.DataAnnotations;

namespace Ajanda.Models
{
    public class State
    {
        [Key]
        public Guid Id { get; set; }
        [MaxLength(25)]
        public string Name { get; set; }
    }
}