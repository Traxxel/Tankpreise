import React, { useEffect, useState } from 'react';
import { Button } from 'devextreme-react/button';
import { Popup } from 'devextreme-react/popup';
import { StationDetail, StationPreise, TankstellenService } from '../services/tankstellen-service';
import './StationCard.css';

interface StationCardProps {
    station: StationDetail;
    onNavigateToPrice: (stationId: string) => void;
}

export const StationCard: React.FC<StationCardProps> = ({ station, onNavigateToPrice }) => {
    const [showDetails, setShowDetails] = React.useState(false);
    const [currentPrices, setCurrentPrices] = useState<StationPreise | null>(null);

    useEffect(() => {
        const loadCurrentPrices = async () => {
            try {
                const prices = await TankstellenService.getStationPreise(station.id);
                if (prices.length > 0) {
                    setCurrentPrices(prices[0]); // Neuester Preis
                }
            } catch (error) {
                console.error('Fehler beim Laden der Preise:', error);
            }
        };

        loadCurrentPrices();
    }, [station.id]);

    const formatPrice = (price: number): React.ReactElement => {
        const priceStr = price.toFixed(3);
        const mainPart = priceStr.slice(0, -1);
        const lastDigit = priceStr.slice(-1);
        return (
            <span className="price-format">
                {mainPart}<sup>{lastDigit}</sup>€
            </span>
        );
    };

    const formatOpeningTimes = (times: any[]) => {
        return times.map(time => (
            `${time.text}: ${time.start.toString().substring(0, 5)} - ${time.end.toString().substring(0, 5)}`
        )).join('\n');
    };

    const handleOpenMap = () => {
        // Debug-Log für die Koordinaten
        console.log('Koordinaten:', {
            raw: { lat: station.lat, lon: station.lng },
            type: { lat: typeof station.lat, lon: typeof station.lng }
        });

        // Konvertiere die Koordinaten zu Strings mit maximal 6 Dezimalstellen
        const lat = Number(station.lat).toFixed(6);
        const lon = Number(station.lng).toFixed(6);

        // Debug-Log für die formatierten Koordinaten
        console.log('Formatierte Koordinaten:', { lat, lon });

        const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=18&layers=M`;
        console.log('OpenStreetMap URL:', url);
        
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <div className="station-card">
                <div className="station-header">
                    <h3>{station.brand}</h3>
                    <span className={`status-badge ${station.isOpen ? 'open' : 'closed'}`}>
                        {station.isOpen ? 'Geöffnet' : 'Geschlossen'}
                    </span>
                </div>
                
                <div className="station-name">{station.name}</div>
                
                <div className="station-address">
                    {station.street} {station.houseNumber}
                    <br />
                    {station.postCode} {station.place}
                </div>

                {currentPrices && (
                    <div className="station-prices">
                        <div className="price-row">
                            <span className="fuel-label">Diesel:</span>
                            <span className="price-value">{formatPrice(currentPrices.diesel)}</span>
                        </div>
                        <div className="price-row">
                            <span className="fuel-label">E5:</span>
                            <span className="price-value">{formatPrice(currentPrices.e5)}</span>
                        </div>
                        <div className="price-row">
                            <span className="fuel-label">E10:</span>
                            <span className="price-value">{formatPrice(currentPrices.e10)}</span>
                        </div>
                        <div className="price-update">
                            Stand: {new Date(currentPrices.timestamp).toLocaleString()}
                        </div>
                    </div>
                )}

                {station.wholeDay && (
                    <div className="station-247">24/7 geöffnet</div>
                )}

                <div className="station-actions">
                    <Button
                        text="Details"
                        onClick={() => setShowDetails(true)}
                        type="default"
                    />
                    <Button
                        text="Preise"
                        onClick={() => onNavigateToPrice(station.id)}
                        type="default"
                    />
                    <Button
                        text="Karte"
                        onClick={handleOpenMap}
                        type="default"
                        icon="map"
                    />
                </div>
            </div>

            <Popup
                visible={showDetails}
                onHiding={() => setShowDetails(false)}
                hideOnOutsideClick={true}
                showCloseButton={true}
                width={400}
                height="auto"
                title={`${station.brand} - ${station.name}`}
            >
                <div className="station-details">
                    <div className="detail-row">
                        <strong>Adresse:</strong>
                        <p>
                            {station.street} {station.houseNumber}<br />
                            {station.postCode} {station.place}<br />
                            {station.state}
                        </p>
                    </div>

                    <div className="detail-row">
                        <strong>Status:</strong>
                        <p>
                            {station.isOpen ? 'Geöffnet' : 'Geschlossen'}<br />
                            {station.wholeDay ? '24/7 geöffnet' : 'Reguläre Öffnungszeiten'}
                        </p>
                    </div>

                    {station.openingTimes && station.openingTimes.length > 0 && (
                        <div className="detail-row">
                            <strong>Öffnungszeiten:</strong>
                            <pre>{formatOpeningTimes(station.openingTimes)}</pre>
                        </div>
                    )}

                    <div className="detail-row">
                        <strong>Letzte Aktualisierung:</strong>
                        <p>{new Date(station.lastUpdate).toLocaleString()}</p>
                    </div>
                </div>
            </Popup>
        </>
    );
}; 