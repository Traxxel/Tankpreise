using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.CommandLine;
using Tankpreise.Collector.Commands;
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
    .AddScoped<IStationDetailRepository, StationDetailRepository>()
    .AddScoped<TankerkoenigService>()
    .AddScoped<CommandHandler>()
    .AddSingleton<IConfiguration>(configuration)
    .BuildServiceProvider();

// Kommandozeilen-Optionen definieren
var addStationOption = new Option<string>(
    name: "--stationid",
    description: "Die ID der Tankstelle, die hinzugefügt werden soll");

var addStationCommand = new Command("--addstation", "Fügt eine neue Tankstelle hinzu oder aktualisiert eine bestehende")
{
    addStationOption
};

var refreshPricesCommand = new Command("--refreshprices", "Aktualisiert die Preise aller gespeicherten Tankstellen");

var rootCommand = new RootCommand("Tankpreise Collector - Verwaltet Tankstellen und deren Preise");
rootCommand.AddCommand(addStationCommand);
rootCommand.AddCommand(refreshPricesCommand);

// Handler für die Kommandos
addStationCommand.SetHandler(async (string stationId) =>
{
    using var scope = services.CreateScope();
    var handler = scope.ServiceProvider.GetRequiredService<CommandHandler>();
    await handler.AddStationAsync(stationId);
}, addStationOption);

refreshPricesCommand.SetHandler(async () =>
{
    using var scope = services.CreateScope();
    var handler = scope.ServiceProvider.GetRequiredService<CommandHandler>();
    await handler.RefreshPricesAsync();
});

// Kommandozeile ausführen
return await rootCommand.InvokeAsync(args);


