using Tankpreise.DAL.Models;

namespace Tankpreise.DAL.Repositories
{
    public interface IStationPreiseRepository
    {
        Task AddStationPreiseAsync(StationPreise stationPreise);
    }
} 