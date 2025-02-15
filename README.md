# Tankpreise Collector

Ein .NET-Tool zum Sammeln und Speichern von Tankstellenpreisen und -details von der Tankerkönig-API.

## Features

- Abrufen und Speichern von Tankstellen-Details
- Automatisches Aktualisieren von Kraftstoffpreisen für alle gespeicherten Tankstellen
- Persistente Speicherung in einer PostgreSQL-Datenbank
- Kommandozeilen-Interface für einfache Bedienung

## Voraussetzungen

- .NET 8.0 SDK
- PostgreSQL Datenbank
- Tankerkönig API-Key (kostenlos erhältlich unter [creativecommons.tankerkoenig.de](https://creativecommons.tankerkoenig.de))

## Installation

1. Repository klonen:
```bash
git clone https://github.com/Traxxel/Tankpreise.git
```

2. In das Projektverzeichnis wechseln:
```bash
cd Tankpreise
```

3. Abhängigkeiten wiederherstellen:
```bash
dotnet restore
```

4. Datenbank-Verbindung konfigurieren:
   - Öffnen Sie `Tankpreise.DAL/Data/TankpreiseContext.cs`
   - Passen Sie den Connection-String an Ihre PostgreSQL-Installation an

5. API-Key konfigurieren:
   - Erstellen Sie eine Datei `Tankpreise.Collector/appsettings.json`
   - Fügen Sie folgenden Inhalt ein:
   ```json
   {
     "TankerkoenigApi": {
       "ApiKey": "IHR-API-KEY"
     }
   }
   ```

6. Datenbank-Migration ausführen:
```bash
dotnet ef database update --project Tankpreise.DAL
```

## Verwendung

### Neue Tankstelle hinzufügen
```bash
Tankpreise.Collector.exe --addstation --stationid=STATION-ID
```
Beispiel:
```bash
Tankpreise.Collector.exe --addstation --stationid=24a381e3-0d72-416d-bfd8-b2f65f6e5802
```

### Preise aller Tankstellen aktualisieren
```bash
Tankpreise.Collector.exe --refreshprices
```

## Projektstruktur

- **Tankpreise.Collector**: Kommandozeilen-Tool zum Sammeln der Daten
  - `Services/`: API-Integrationen
  - `Commands/`: Kommandozeilen-Befehle
  
- **Tankpreise.DAL**: Data Access Layer
  - `Data/`: Datenbankkontext und Konfiguration
  - `Models/`: Datenbankmodelle
  - `Repositories/`: Datenzugriffsmethoden

## Technologien

- .NET 8.0
- Entity Framework Core
- PostgreSQL
- System.CommandLine (Beta)
- Tankerkönig API

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Die Tankerkönig-API-Daten stehen unter der CC BY 4.0 Lizenz.

## Hinweise

- Die `appsettings.json` mit dem API-Key wird nicht zu GitHub gepusht (in .gitignore aufgeführt)
- Alle Zeitstempel werden in der lokalen Zeitzone gespeichert
- Die Tankerkönig-API hat Nutzungsbeschränkungen, bitte beachten Sie die API-Dokumentation 