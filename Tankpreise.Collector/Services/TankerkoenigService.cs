using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Tankpreise.DAL.Models;
using System.Text.Json.Serialization;

namespace Tankpreise.Collector.Services;

public class TankerkoenigService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string BaseUrl = "https://creativecommons.tankerkoenig.de/json";

    public TankerkoenigService(IConfiguration configuration, HttpClient? httpClient = null)
    {
        _apiKey = configuration["TankerkoenigApi:ApiKey"] ?? 
            throw new ArgumentNullException("TankerkoenigApi:ApiKey", "API Key nicht in der Konfiguration gefunden");
        _httpClient = httpClient ?? new HttpClient();
    }

    public async Task<StationPreise?> GetStationPreiseAsync(string stationId)
    {
        var url = $"{BaseUrl}/prices.php?ids={stationId}&apikey={_apiKey}";
        
        try
        {
            var response = await _httpClient.GetStringAsync(url);
            var result = JsonSerializer.Deserialize<ApiResponse>(response);
            
            if (result?.Ok == true && result.Prices.TryGetValue(stationId, out var preise))
            {
                return new StationPreise
                {
                    StationsId = stationId,
                    Status = preise.Status,
                    E5 = preise.E5,
                    E10 = preise.E10,
                    Diesel = preise.Diesel,
                    Timestamp = DateTime.UtcNow
                };
            }
            
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Fehler beim Abrufen der Tankpreise: {ex.Message}");
            return null;
        }
    }

    public async Task<StationDetail?> GetStationDetailAsync(string stationId)
    {
        var url = $"{BaseUrl}/detail.php?id={stationId}&apikey={_apiKey}";
        
        try
        {
            var response = await _httpClient.GetStringAsync(url);
            var result = JsonSerializer.Deserialize<DetailResponse>(response);
            
            if (result?.Ok == true && result.Station != null)
            {
                result.Station.LastUpdate = DateTime.UtcNow;
                return result.Station;
            }
            
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Fehler beim Abrufen der Tankstellen-Details: {ex.Message}");
            return null;
        }
    }
}

public class ApiResponse
{
    [JsonPropertyName("ok")]
    public bool Ok { get; set; }

    [JsonPropertyName("prices")]
    public Dictionary<string, StationPrice> Prices { get; set; } = new();
}

public class DetailResponse
{
    [JsonPropertyName("ok")]
    public bool Ok { get; set; }

    [JsonPropertyName("station")]
    public StationDetail? Station { get; set; }
}

public class StationPrice
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("e5")]
    public decimal E5 { get; set; }

    [JsonPropertyName("e10")]
    public decimal E10 { get; set; }

    [JsonPropertyName("diesel")]
    public decimal Diesel { get; set; }
} 