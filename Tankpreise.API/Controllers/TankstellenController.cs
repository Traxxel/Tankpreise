using Microsoft.AspNetCore.Mvc;
using Tankpreise.DAL.Models;
using Tankpreise.DAL.Repositories;

namespace Tankpreise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TankstellenController : ControllerBase
{
    private readonly IStationDetailRepository _detailRepository;
    private readonly IStationPreiseRepository _preiseRepository;

    public TankstellenController(
        IStationDetailRepository detailRepository,
        IStationPreiseRepository preiseRepository)
    {
        _detailRepository = detailRepository;
        _preiseRepository = preiseRepository;
    }

    [HttpGet("details")]
    public async Task<ActionResult<IEnumerable<StationDetail>>> GetAllStationDetails()
    {
        var stations = await _detailRepository.GetAllStationsAsync();
        return Ok(stations);
    }

    [HttpGet("preise")]
    public async Task<ActionResult<IEnumerable<StationPreise>>> GetAllStationPreise()
    {
        var preise = await _preiseRepository.GetAllStationPreiseAsync();
        return Ok(preise);
    }

    [HttpGet("preise/{stationId}")]
    public async Task<ActionResult<IEnumerable<StationPreise>>> GetStationPreiseById(string stationId)
    {
        var preise = await _preiseRepository.GetStationPreiseAsync(stationId);
        if (!preise.Any())
        {
            return NotFound($"Keine Preise für Station {stationId} gefunden.");
        }
        return Ok(preise);
    }

    [HttpGet("preise/{stationId}/zeitraum")]
    public async Task<ActionResult<IEnumerable<StationPreise>>> GetStationPreiseByIdAndTimeRange(
        string stationId,
        [FromQuery] DateTime von,
        [FromQuery] DateTime bis)
    {
        if (von > bis)
        {
            return BadRequest("Das Startdatum muss vor dem Enddatum liegen.");
        }

        var preise = await _preiseRepository.GetStationPreiseInTimeRangeAsync(stationId, von, bis);
        if (!preise.Any())
        {
            return NotFound($"Keine Preise für Station {stationId} im angegebenen Zeitraum gefunden.");
        }
        return Ok(preise);
    }
} 