import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chart, Series, ArgumentAxis, ValueAxis, Legend, Title, Tooltip } from 'devextreme-react/chart';
import { Button } from 'devextreme-react/button';
import { StationDetail, StationPreise, TankstellenService } from '../services/tankstellen-service';
import './PriceHistoryPage.css';

/** @jsxImportSource react */

interface PriceStats {
    min: number;
    max: number;
    avg: number;
}

interface FuelStats {
    e5: PriceStats;
    e10: PriceStats;
    diesel: PriceStats;
}

export const PriceHistoryPage: React.FC = () => {
    const { stationId } = useParams<{ stationId: string }>();
    const navigate = useNavigate();
    const [prices, setPrices] = useState<StationPreise[]>([]);
    const [station, setStation] = useState<StationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [chartKey, setChartKey] = useState(0);
    const [stats, setStats] = useState<FuelStats | null>(null);

    const calculateStats = (priceData: StationPreise[]): FuelStats => {
        const initialStats: FuelStats = {
            e5: { min: Infinity, max: -Infinity, avg: 0 },
            e10: { min: Infinity, max: -Infinity, avg: 0 },
            diesel: { min: Infinity, max: -Infinity, avg: 0 }
        };

        const stats = priceData.reduce((acc, price) => {
            // E5
            acc.e5.min = Math.min(acc.e5.min, price.e5);
            acc.e5.max = Math.max(acc.e5.max, price.e5);
            acc.e5.avg += price.e5;

            // E10
            acc.e10.min = Math.min(acc.e10.min, price.e10);
            acc.e10.max = Math.max(acc.e10.max, price.e10);
            acc.e10.avg += price.e10;

            // Diesel
            acc.diesel.min = Math.min(acc.diesel.min, price.diesel);
            acc.diesel.max = Math.max(acc.diesel.max, price.diesel);
            acc.diesel.avg += price.diesel;

            return acc;
        }, initialStats);

        const count = priceData.length;
        if (count > 0) {
            stats.e5.avg /= count;
            stats.e10.avg /= count;
            stats.diesel.avg /= count;
        }

        return stats;
    };

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
            setStats(calculateStats(priceData));
            setChartKey(prev => prev + 1);
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

        return () => {
            setPrices([]);
            setStation(null);
            setLoading(true);
            setStats(null);
        };
    }, [stationId, navigate, loadData]);

    const handleBack = () => {
        navigate('/');
    };

    // Neue Hilfsfunktion für die Preisformatierung
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

            {prices.length > 0 && (
                <div className="current-prices">
                    <h2>Aktuelle Preise</h2>
                    <div className="price-items">
                        <div className="price-item diesel">
                            <div className="fuel-type">Diesel</div>
                            <div className="price">{formatPrice(prices[0].diesel)}</div>
                            <div className="timestamp">
                                Stand: {new Date(prices[0].timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                        <div className="price-item e5">
                            <div className="fuel-type">E5</div>
                            <div className="price">{formatPrice(prices[0].e5)}</div>
                            <div className="timestamp">
                                Stand: {new Date(prices[0].timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                        <div className="price-item e10">
                            <div className="fuel-type">E10</div>
                            <div className="price">{formatPrice(prices[0].e10)}</div>
                            <div className="timestamp">
                                Stand: {new Date(prices[0].timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                        name="Diesel"
                        valueField="diesel"
                        argumentField="timestamp"
                        type="line"
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

            {stats && (
                <div className="price-stats">
                    <div className="stats-row">
                        <h2>Diesel</h2>
                        <div className="stats-items">
                            <div className="stat-item">
                                <i className="dx-icon-decreasefont" />
                                <span>Min: {formatPrice(stats.diesel.min)}</span>
                            </div>
                            <div className="stat-item">
                                <i className="dx-icon-increasefont" />
                                <span>Max: {formatPrice(stats.diesel.max)}</span>
                            </div>
                            <div className="stat-item">
                                <i className="dx-icon-chart" />
                                <span>Ø: {formatPrice(stats.diesel.avg)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="stats-row">
                        <h2>E5</h2>
                        <div className="stats-items">
                            <div className="stat-item">
                                <i className="dx-icon-decreasefont" />
                                <span>Min: {formatPrice(stats.e5.min)}</span>
                            </div>
                            <div className="stat-item">
                                <i className="dx-icon-increasefont" />
                                <span>Max: {formatPrice(stats.e5.max)}</span>
                            </div>
                            <div className="stat-item">
                                <i className="dx-icon-chart" />
                                <span>Ø: {formatPrice(stats.e5.avg)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="stats-row">
                        <h2>E10</h2>
                        <div className="stats-items">
                            <div className="stat-item">
                                <i className="dx-icon-decreasefont" />
                                <span>Min: {formatPrice(stats.e10.min)}</span>
                            </div>
                            <div className="stat-item">
                                <i className="dx-icon-increasefont" />
                                <span>Max: {formatPrice(stats.e10.max)}</span>
                            </div>
                            <div className="stat-item">
                                <i className="dx-icon-chart" />
                                <span>Ø: {formatPrice(stats.e10.avg)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 