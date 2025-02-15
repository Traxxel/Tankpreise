import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chart, Series, ArgumentAxis, ValueAxis, Legend, Title, Tooltip } from 'devextreme-react/chart';
import { Button } from 'devextreme-react/button';
import { StationDetail, StationPreise, TankstellenService } from '../services/tankstellen-service';
import './PriceHistoryPage.css';

export const PriceHistoryPage: React.FC = () => {
    const { stationId } = useParams<{ stationId: string }>();
    const navigate = useNavigate();
    const [prices, setPrices] = useState<StationPreise[]>([]);
    const [station, setStation] = useState<StationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [chartKey, setChartKey] = useState(0); // Key für Chart-Reset

    const loadData = useCallback(async () => {
        if (!stationId) return;
        
        try {
            setLoading(true);
            // Lade Stationsdetails
            const stationData = await TankstellenService.getAllStations();
            const currentStation = stationData.find(s => s.id === stationId);
            setStation(currentStation || null);

            // Lade Preishistorie der letzten 7 Tage
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            
            const priceData = await TankstellenService.getStationPreiseInTimeRange(
                stationId,
                startDate,
                endDate
            );
            setPrices(priceData);
            setChartKey(prev => prev + 1); // Erzwinge Chart-Neurendering
        } catch (error) {
            console.error('Fehler beim Laden der Preishistorie:', error);
        } finally {
            setLoading(false);
        }
    }, [stationId]);

    useEffect(() => {
        if (!stationId) {
            navigate('/');
            return;
        }

        loadData();

        // Cleanup-Funktion
        return () => {
            setPrices([]);
            setStation(null);
            setLoading(true);
        };
    }, [stationId, navigate, loadData]);

    const handleBack = () => {
        navigate('/');
    };

    if (loading) {
        return <div className="loading">Lade Preishistorie...</div>;
    }

    if (!station) {
        return <div className="error">Tankstelle nicht gefunden</div>;
    }

    return (
        <div className="content-block">
            <div className="header-with-back">
                <Button
                    icon="chevronleft"
                    text="Zurück"
                    onClick={handleBack}
                    type="normal"
                />
                <h1>Preisverlauf: {station.brand} - {station.name}</h1>
            </div>
            
            <div className="station-info">
                {station.street} {station.houseNumber}, {station.postCode} {station.place}
            </div>

            <div className="chart-container">
                <Chart
                    key={chartKey}
                    dataSource={prices}
                    palette="Soft"
                >
                    <ArgumentAxis
                        argumentType="datetime"
                        valueMarginsEnabled={false}
                    />
                    <ValueAxis
                        position="left"
                        title="Preis in €"
                    />

                    <Series
                        name="E5"
                        valueField="e5"
                        argumentField="timestamp"
                        type="line"
                    />
                    <Series
                        name="E10"
                        valueField="e10"
                        argumentField="timestamp"
                        type="line"
                    />
                    <Series
                        name="Diesel"
                        valueField="diesel"
                        argumentField="timestamp"
                        type="line"
                    />

                    <Legend
                        verticalAlignment="bottom"
                        horizontalAlignment="center"
                    />

                    <Title text="Preisentwicklung der letzten 7 Tage" />

                    <Tooltip
                        enabled={true}
                        customizeTooltip={(arg: any) => ({
                            text: `${new Date(arg.argument).toLocaleString()}\n${arg.seriesName}: ${arg.value.toFixed(3)}€`
                        })}
                    />
                </Chart>
            </div>
        </div>
    );
}; 