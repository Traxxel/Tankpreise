declare global {
    interface Window {
        TANKPREISE_CONFIG: {
            API_BASE_URL: string;
            DB_CONNECTION: string;
        };
    }
}

export const getConfig = () => {
    const config = window.TANKPREISE_CONFIG;
    
    if (!config) {
        console.error('Keine Konfiguration gefunden! Stelle sicher, dass config.js geladen wurde.');
        return {
            API_BASE_URL: 'http://localhost:5500/api',
            DB_CONNECTION: 'Host=localhost;Database=Tankpreise;Username=postgres;Password=postgres'
        };
    }
    
    return config;
}; 