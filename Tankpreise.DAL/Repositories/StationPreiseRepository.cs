using Microsoft.EntityFrameworkCore;
using Tankpreise.DAL.Data;
using Tankpreise.DAL.Models;

namespace Tankpreise.DAL.Repositories
{
    public class StationPreiseRepository : IStationPreiseRepository
    {
        private readonly TankpreiseContext _context;

        public StationPreiseRepository(TankpreiseContext context)
        {
            _context = context;
        }

        public async Task AddStationPreiseAsync(StationPreise stationPreise)
        {
            await _context.StationPreise.AddAsync(stationPreise);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<StationPreise>> GetAllStationPreiseAsync()
        {
            return await _context.StationPreise
                .OrderByDescending(p => p.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<StationPreise>> GetStationPreiseAsync(string stationId)
        {
            return await _context.StationPreise
                .Where(p => p.StationsId == stationId)
                .OrderByDescending(p => p.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<StationPreise>> GetStationPreiseInTimeRangeAsync(string stationId, DateTime von, DateTime bis)
        {
            // Konvertiere zu lokalem Timestamp ohne Zeitzoneninformation
            var vonLocal = DateTime.SpecifyKind(von, DateTimeKind.Unspecified);
            var bisLocal = DateTime.SpecifyKind(bis, DateTimeKind.Unspecified);

            var query = _context.StationPreise
                .Where(p => p.StationsId == stationId && p.Timestamp >= vonLocal && p.Timestamp <= bisLocal)
                .OrderByDescending(p => p.Timestamp);

            // Debug-Ausgabe
            var sql = query.ToQueryString();
            Console.WriteLine($"SQL Query: {sql}");
            Console.WriteLine($"Parameter: StationId={stationId}, Von={vonLocal}, Bis={bisLocal}");

            var result = await query.ToListAsync();
            Console.WriteLine($"Gefundene Einträge: {result.Count}");
            
            if (result.Any())
            {
                Console.WriteLine($"Erster Timestamp: {result.First().Timestamp}");
                Console.WriteLine($"Letzter Timestamp: {result.Last().Timestamp}");
            }

            return result;
        }
    }
} 