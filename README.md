# Tankpreise

Eine Full-Stack-Anwendung zum Sammeln, Anzeigen und Analysieren von Tankstellenpreisen mit Daten von der Tankerkönig-API.

## Features

- **Datensammlung**:
  - Abrufen und Speichern von Tankstellen-Details
  - Automatisches Aktualisieren von Kraftstoffpreisen
  - Persistente Speicherung in einer PostgreSQL-Datenbank
  - Kommandozeilen-Interface für einfache Bedienung

- **Web-Frontend**:
  - Moderne Benutzeroberfläche mit React und DevExtreme
  - Übersichtliche Darstellung aller Tankstellen als Karten
  - Detaillierte Informationen zu jeder Tankstelle (Öffnungszeiten, Adresse, etc.)
  - Interaktive Preisverlaufsgrafiken der letzten 7 Tage
  - Direkte Anzeige der Tankstellen-Standorte in OpenStreetMap
  - Responsive Design für optimale Nutzung auf allen Geräten

## Voraussetzungen

- .NET 8.0 SDK
- Node.js und npm
- PostgreSQL Datenbank
- DevExtreme Lizenz (für die Charts)
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

3. Backend-Abhängigkeiten wiederherstellen:
```bash
dotnet restore
```

4. Frontend-Abhängigkeiten installieren:
```bash
cd Tankpreise.Web
npm install
```

5. Konfigurationsdateien erstellen:
   
   **Backend**:
   - Kopieren Sie `Tankpreise.Collector/appsettings.example.json` nach `appsettings.json`
   - Fügen Sie Ihren Tankerkönig API-Key ein
   - Passen Sie die Datenbankverbindung an

   **Frontend**:
   - Kopieren Sie `Tankpreise.Web/src/config/devexpress-license.example.ts` nach `devexpress-license.ts`
   - Fügen Sie Ihren DevExtreme Lizenzschlüssel ein

6. Datenbank-Migration ausführen:
```bash
dotnet ef database update --project Tankpreise.DAL
```

## Verwendung

### Daten-Collector starten
```bash
cd Tankpreise.Collector
dotnet run -- --refreshprices
```

### Backend-API starten
```bash
cd Tankpreise.API
dotnet run
```

### Frontend-Entwicklungsserver starten
```bash
cd Tankpreise.Web
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5502` erreichbar.

## Projektstruktur

- **Tankpreise.Collector**: Kommandozeilen-Tool zum Sammeln der Daten
  - `Services/`: API-Integrationen
  - `Commands/`: Kommandozeilen-Befehle
  
- **Tankpreise.DAL**: Data Access Layer
  - `Data/`: Datenbankkontext und Konfiguration
  - `Models/`: Datenbankmodelle
  - `Repositories/`: Datenzugriffsmethoden

- **Tankpreise.API**: REST-API für das Frontend
  - `Controllers/`: API-Endpunkte
  
- **Tankpreise.Web**: React Frontend
  - `src/components/`: React-Komponenten
  - `src/pages/`: Seitenkomponenten
  - `src/services/`: API-Integration
  - `src/config/`: Konfigurationsdateien

## Technologien

### Backend
- .NET 8.0
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- System.CommandLine

### Frontend
- React 18
- Vite
- TypeScript
- DevExtreme
- React Router
- Axios

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Die Tankerkönig-API-Daten stehen unter der CC BY 4.0 Lizenz.

## Hinweise

- Sensitive Konfigurationsdateien (`appsettings.json`, `devexpress-license.ts`) werden nicht zu GitHub gepusht
- Alle Zeitstempel werden in der lokalen Zeitzone gespeichert
- Die Tankerkönig-API hat Nutzungsbeschränkungen, bitte beachten Sie die API-Dokumentation 