import React, { useEffect, useState } from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import { StationDetail, TankstellenService } from '../services/tankstellen-service';
import { DEVEXPRESS_LICENSE_KEY } from '../config/devexpress-license';

// DevExpress Lizenz registrieren
import config from 'devextreme/core/config';
config({ licenseKey: DEVEXPRESS_LICENSE_KEY });

export const TankstellenListe: React.FC = () => {
    const [stations, setStations] = useState<StationDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        loadStations();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Tankstellen</h2>
            <DataGrid
                dataSource={stations}
                showBorders={true}
                columnAutoWidth={true}
                rowAlternationEnabled={true}
                showColumnLines={true}
                showRowLines={true}
                loadPanel={{ enabled: loading }}
            >
                <Column dataField="name" caption="Name" />
                <Column dataField="brand" caption="Marke" />
                <Column dataField="street" caption="Straße" />
                <Column dataField="houseNumber" caption="Hausnummer" width={100} />
                <Column dataField="postCode" caption="PLZ" width={80} />
                <Column dataField="place" caption="Ort" />
                <Column dataField="isOpen" caption="Geöffnet" dataType="boolean" width={90} />
                <Column dataField="lastUpdate" caption="Letzte Aktualisierung" dataType="datetime" format="dd.MM.yyyy HH:mm" />
            </DataGrid>
        </div>
    );
}; 