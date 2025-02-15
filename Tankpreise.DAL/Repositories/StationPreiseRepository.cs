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
            _context.StationPreise.Add(stationPreise);
            await _context.SaveChangesAsync();
        }
    }
} 