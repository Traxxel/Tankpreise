using Tankpreise.Collector.Services;
using Tankpreise.DAL.Repositories;

namespace Tankpreise.Collector.Commands;

public class CommandHandler
{
    private readonly TankerkoenigService _tankerkoenigService;
    private readonly IStationPreiseRepository _preiseRepository;
    private readonly IStationDetailRepository _detailRepository;

    public CommandHandler(
        TankerkoenigService tankerkoenigService,
        IStationPreiseRepository preiseRepository,
        IStationDetailRepository detailRepository)
    {
        _tankerkoenigService = tankerkoenigService;
        _preiseRepository = preiseRepository;
        _detailRepository = detailRepository;
    }

    public async Task<int> AddStationAsync(string stationId)
    {
        try
        {
            var details = await _tankerkoenigService.GetStationDetailAsync(stationId);
            if (details == null)
            {
                Console.WriteLine($"Fehler: Keine Details für Station {stationId} gefunden.");
                return 1;
            }

            await _detailRepository.AddOrUpdateStationDetailAsync(details);
            Console.WriteLine($"Station {details.Name} erfolgreich hinzugefügt/aktualisiert.");
            return 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Fehler beim Hinzufügen der Station: {ex.Message}");
            return 1;
        }
    }

    public async Task<int> RefreshPricesAsync()
    {
        try
        {
            var stations = await _detailRepository.GetAllStationsAsync();
            var errorCount = 0;
            var successCount = 0;

            foreach (var station in stations)
            {
                try
                {
                    var preise = await _tankerkoenigService.GetStationPreiseAsync(station.Id);
                    if (preise != null)
                    {
                        await _preiseRepository.AddStationPreiseAsync(preise);
                        successCount++;
                        Console.WriteLine($"Preise für {station.Name} aktualisiert: E5: {preise.E5:F3}€, E10: {preise.E10:F3}€, Diesel: {preise.Diesel:F3}€");
                    }
                    else
                    {
                        errorCount++;
                        Console.WriteLine($"Keine Preise für Station {station.Name} gefunden.");
                    }
                }
                catch (Exception ex)
                {
                    errorCount++;
                    Console.WriteLine($"Fehler beim Abrufen der Preise für {station.Name}: {ex.Message}");
                }
            }

            Console.WriteLine($"\nZusammenfassung:");
            Console.WriteLine($"Erfolgreich: {successCount}");
            Console.WriteLine($"Fehler: {errorCount}");

            return errorCount > 0 ? 1 : 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Fehler beim Aktualisieren der Preise: {ex.Message}");
            return 1;
        }
    }
} 