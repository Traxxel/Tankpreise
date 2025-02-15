using Microsoft.EntityFrameworkCore;
using Tankpreise.DAL.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace Tankpreise.DAL.Data
{
    public class TankpreiseContext : DbContext
    {
        private readonly string? _connectionString;

        public TankpreiseContext()
        {
            // Dieser Konstruktor wird von den EF Core-Tools verwendet
            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            _connectionString = configuration.GetConnectionString("DefaultConnection") ??
                throw new ArgumentNullException("DefaultConnection", "Connection string nicht in der Konfiguration gefunden");
        }

        public TankpreiseContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ??
                throw new ArgumentNullException("DefaultConnection", "Connection string nicht in der Konfiguration gefunden");
        }

        public DbSet<StationPreise> StationPreise { get; set; }
        public DbSet<StationDetail> StationDetails { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var uuidConverter = new ValueConverter<string, Guid>(
                v => Guid.Parse(v),
                v => v.ToString()
            );

            var openingTimesConverter = new ValueConverter<List<OpeningTime>, string>(
                v => JsonSerializer.Serialize(v, new JsonSerializerOptions { WriteIndented = false }),
                v => JsonSerializer.Deserialize<List<OpeningTime>>(v, new JsonSerializerOptions { WriteIndented = false }) ?? new List<OpeningTime>()
            );

            var overridesConverter = new ValueConverter<List<OpeningTimeOverride>, string>(
                v => JsonSerializer.Serialize(v, new JsonSerializerOptions { WriteIndented = false }),
                v => JsonSerializer.Deserialize<List<OpeningTimeOverride>>(v, new JsonSerializerOptions { WriteIndented = false }) ?? new List<OpeningTimeOverride>()
            );

            modelBuilder.Entity<StationPreise>(entity =>
            {
                entity.HasIndex(e => new { e.StationsId, e.Timestamp })
                    .IsUnique();
                
                entity.Property(e => e.StationsId)
                    .HasConversion(uuidConverter);
            });

            modelBuilder.Entity<StationDetail>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasConversion(uuidConverter);

                entity.Property(e => e.OpeningTimes)
                    .HasConversion(openingTimesConverter);

                entity.Property(e => e.Overrides)
                    .HasConversion(overridesConverter);
            });
        }
    }
} 