using Microsoft.EntityFrameworkCore;
using Tankpreise.DAL.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Tankpreise.DAL.Data
{
    public class TankpreiseContext : DbContext
    {
        public DbSet<StationPreise> StationPreise { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(
                "Host=127.0.0.1;Database=Tankpreise;Username=postgres;Password=postgres"
            );
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<StationPreise>(entity =>
            {
                entity.HasIndex(e => new { e.StationsId, e.Timestamp })
                    .IsUnique();
                
                entity.Property(e => e.StationsId)
                    .HasColumnType("uuid")
                    .HasConversion(
                        v => Guid.Parse(v),
                        v => v.ToString()
                    );
            });
        }
    }
} 