import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StationDetail, TankstellenService } from '../services/tankstellen-service';
import { StationCard } from '../components/StationCard';
import './HomePage.css';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [stations, setStations] = useState<StationDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStations();
    }, []);

    const loadStations = async () => {
        try {
            const data = await TankstellenService.getAllStations();
            setStations(data);
        } catch (error) {
            console.error('Fehler beim Laden der Tankstellen:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToPrice = (stationId: string) => {
        navigate(`/prices/${stationId}`);
    };

    if (loading) {
        return <div className="loading">Lade Tankstellen...</div>;
    }

    return (
        <div className="content-block">
            <h1>Tankpreise</h1>
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