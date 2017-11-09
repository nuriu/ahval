using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Ahval.Models
{
    public class AhvalDbContext : DbContext
    {
        public DbSet<State> States { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Component> Components { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Issue> Issues { get; set; }
        public DbSet<WeeklyItemType> WeeklyItemTypes { get; set; }
        public DbSet<UserWeeklyItem> UserWeeklyItems { get; set; }

        public AhvalDbContext(DbContextOptions<AhvalDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserComponents>().HasKey(uc => new { uc.User_Id, uc.Component_Id });
            builder.Entity<UserComponents>().HasOne(uc => uc.User).WithMany(u => u.UserComponents).HasForeignKey(uc => uc.User_Id);
            builder.Entity<UserComponents>().HasOne(uc => uc.Component).WithMany(c => c.ComponentUsers).HasForeignKey(uc => uc.Component_Id);

            builder.Entity<User>().HasAlternateKey(u => u.Username);
            builder.Entity<Component>().HasAlternateKey(c => c.Name);
            builder.Entity<State>().HasAlternateKey(s => s.Name);

            base.OnModelCreating(builder);
        }
    }
}