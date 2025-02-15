import React from 'react';
import { Button } from 'devextreme-react/button';
import { Popup } from 'devextreme-react/popup';
import { StationDetail } from '../services/tankstellen-service';
import './StationCard.css';

interface StationCardProps {
    station: StationDetail;
    onNavigateToPrice: (stationId: string) => void;
}

export const StationCard: React.FC<StationCardProps> = ({ station, onNavigateToPrice }) => {
    const [showDetails, setShowDetails] = React.useState(false);

    const formatOpeningTimes = (times: any[]) => {
        return times.map(time => (
            `${time.text}: ${time.start.toString().substring(0, 5)} - ${time.end.toString().substring(0, 5)}`
        )).join('\n');
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