using Tankpreise.DAL.Models;

namespace Tankpreise.DAL.Repositories;

public interface IStationDetailRepository
{
    Task AddOrUpdateStationDetailAsync(StationDetail stationDetail);
    Task<StationDetail?> GetStationDetailAsync(string stationId);
    Task<IEnumerable<StationDetail>> GetAllStationsAsync();
} 