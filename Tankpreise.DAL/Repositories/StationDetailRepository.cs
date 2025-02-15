using Microsoft.EntityFrameworkCore;
using Tankpreise.DAL.Data;
using Tankpreise.DAL.Models;

namespace Tankpreise.DAL.Repositories;

public class StationDetailRepository : IStationDetailRepository
{
    private readonly TankpreiseContext _context;

    public StationDetailRepository(TankpreiseContext context)
    {
        _context = context;
    }

    public async Task AddOrUpdateStationDetailAsync(StationDetail stationDetail)
    {
        var existingStation = await _context.StationDetails.FindAsync(stationDetail.Id);
        
        if (existingStation == null)
        {
            await _context.StationDetails.AddAsync(stationDetail);
        }
        else
        {
            _context.Entry(existingStation).CurrentValues.SetValues(stationDetail);
        }

        await _context.SaveChangesAsync();
    }

    public async Task<StationDetail?> GetStationDetailAsync(string stationId)
    {
        return await _context.StationDetails.FindAsync(stationId);
    }

    public async Task<IEnumerable<StationDetail>> GetAllStationsAsync()
    {
        return await _context.StationDetails.ToListAsync();
    }
} 