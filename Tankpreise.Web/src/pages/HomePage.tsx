import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StationDetail, TankstellenService } from '../services/tankstellen-service';
import { StationCard } from '../components/StationCard';
import './HomePage.css';

interface ErrorInfo {
    message: string;
    causes: string[];
    solutions: string[];
}

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [stations, setStations] = useState<StationDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorInfo | null>(null);

    const getErrorInfo = (errorMessage: string): ErrorInfo => {
        if (errorMessage.includes('Datenbankverbindung')) {
            return {
                message: errorMessage,
                causes: [
                    'Die Datenbankverbindung ist fehlgeschlagen',
                    'Falsche Zugangsdaten zur Datenbank',
                    'Die Datenbank ist nicht erreichbar',
                    'PostgreSQL-Service läuft nicht'
                ],
                solutions: [
                    'Prüfen Sie, ob der PostgreSQL-Service läuft',
                    'Überprüfen Sie die Datenbank-Zugangsdaten',
                    'Stellen Sie sicher, dass die Datenbank erreichbar ist',
                    'Kontaktieren Sie den Administrator'
                ]
            };
        }
        
        if (errorMessage.includes('API nicht erreichbar')) {
            return {
                message: errorMessage,
                causes: [
                    'Der API-Server ist nicht gestartet',
                    'Netzwerkprobleme',
                    'Falsche API-URL konfiguriert'
                ],
                solutions: [
                    'Starten Sie den API-Server (Tankpreise.API)',
                    'Prüfen Sie die Netzwerkverbindung',
                    'Überprüfen Sie die API-URL in der Konfiguration'
                ]
            };
        }

        return {
            message: errorMessage,
            causes: [
                'Unerwarteter Fehler',
                'Möglicherweise ein temporäres Problem'
            ],
            solutions: [
                'Laden Sie die Seite neu',
                'Prüfen Sie die Konsole auf weitere Fehlermeldungen',
                'Kontaktieren Sie den Administrator'
            ]
        };
    };

    useEffect(() => {
        loadStations();
    }, []);

    const loadStations = async () => {
        try {
            setError(null);
            const data = await TankstellenService.getAllStations();
            const sortedData = [...data].sort((a, b) => {
                const brandCompare = a.brand.localeCompare(b.brand);
                if (brandCompare === 0) {
                    return a.name.localeCompare(b.name);
                }
                return brandCompare;
            });
            setStations(sortedData);
        } catch (err) {
            console.error('Fehler beim Laden der Tankstellen:', err);
            const errorMessage = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten';
            setError(getErrorInfo(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToPrice = (stationId: string) => {
        navigate(`/prices/${stationId}`);
    };

    const handleRetry = () => {
        setLoading(true);
        loadStations();
    };

    if (loading) {
        return <div className="loading">Lade Tankstellen...</div>;
    }

    if (error) {
        return (
            <div className="content-block error-container">
                <h1 className="page-title">Fehler</h1>
                <div className="error-message">
                    {error.message}
                </div>
                <div className="error-details">
                    <div className="error-section">
                        <h2>Mögliche Ursachen:</h2>
                        <ul>
                            {error.causes.map((cause, index) => (
                                <li key={`cause-${index}`}>{cause}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="error-section">
                        <h2>Lösungsvorschläge:</h2>
                        <ul>
                            {error.solutions.map((solution, index) => (
                                <li key={`solution-${index}`}>{solution}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button className="retry-button" onClick={handleRetry}>
                    Erneut versuchen
                </button>
            </div>
        );
    }

    return (
        <div className="content-block">
            <h1 className="page-title">Tankpreise</h1>
            <div className="stations-grid">
                {stations.map(station => (
                    <StationCard
                        key={station.id}
                        station={station}
                        onNavigateToPrice={handleNavigateToPrice}
                    />
                ))}
            </div>
        </div>
    );
}; 