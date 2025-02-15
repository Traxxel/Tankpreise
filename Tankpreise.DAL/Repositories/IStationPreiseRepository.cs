using Tankpreise.DAL.Models;

namespace Tankpreise.DAL.Repositories
{
    public interface IStationPreiseRepository
    {
        Task AddStationPreiseAsync(StationPreise stationPreise);
        Task<IEnumerable<StationPreise>> GetAllStationPreiseAsync();
        Task<IEnumerable<StationPreise>> GetStationPreiseAsync(string stationId);
        Task<IEnumerable<StationPreise>> GetStationPreiseInTimeRangeAsync(string stationId, DateTime von, DateTime bis);
    }
} 