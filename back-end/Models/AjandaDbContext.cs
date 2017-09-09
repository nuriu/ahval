using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Ajanda.Models
{
    public class AjandaDbContext : DbContext
    {
        public DbSet<State> States { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Component> Components { get; set; }

        public AjandaDbContext(DbContextOptions<AjandaDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserComponent>().HasKey(uc => new { uc.User_Id, uc.Component_Id });
            builder.Entity<UserComponent>().HasOne(uc => uc.User).WithMany(u => u.UserComponents).HasForeignKey(uc => uc.User_Id);
            builder.Entity<UserComponent>().HasOne(uc => uc.Component).WithMany(c => c.ComponentUsers).HasForeignKey(uc => uc.Component_Id);

            builder.Entity<User>().Property<DateTime>("UpdatedAt");
            builder.Entity<Component>().Property<DateTime>("UpdatedAt");

            builder.Entity<User>().HasAlternateKey(u => u.Username);
            builder.Entity<Component>().HasAlternateKey(c => c.Name);
            builder.Entity<State>().HasAlternateKey(s => s.Name);

            base.OnModelCreating(builder);
        }

        public override int SaveChanges()
        {
            ChangeTracker.DetectChanges();

            updateUpdatedProperty<User>();
            updateUpdatedProperty<Component>();

            return base.SaveChanges();
        }
        private void updateUpdatedProperty<T>() where T : class
        {
            var modifiedSourceInfo = ChangeTracker.Entries<T>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in modifiedSourceInfo)
            {
                entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
            }
        }
    }
}