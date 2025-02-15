using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tankpreise.Collector.Services;
using Tankpreise.DAL.Data;
using Tankpreise.DAL.Repositories;

// Konfiguration einrichten
var configuration = new ConfigurationBuilder()
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json")
    .Build();

// Services einrichten
var services = new ServiceCollection()
    .AddDbContext<TankpreiseContext>()
    .AddScoped<IStationPreiseRepository, StationPreiseRepository>()
    .AddScoped<TankerkoenigService>()
    .AddSingleton<IConfiguration>(configuration)
    .BuildServiceProvider();

// Services abrufen
var tankerkoenigService = services.GetRequiredService<TankerkoenigService>();
var repository = services.GetRequiredService<IStationPreiseRepository>();

// Beispiel für einen API-Aufruf
const string testStationId = "490aaccd-d16b-44fe-59b9-ac31ec063235";
var preise = await tankerkoenigService.GetStationPreiseAsync(testStationId);

if (preise != null)
{
    await repository.AddStationPreiseAsync(preise);
    Console.WriteLine($"Tankpreise erfolgreich in der Datenbank gespeichert! E5: {preise.E5:F3}€, E10: {preise.E10:F3}€, Diesel: {preise.Diesel:F3}€");
}
else
{
    Console.WriteLine("Fehler beim Abrufen der Tankpreise!");
}
