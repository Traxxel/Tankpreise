import axios, { AxiosError } from 'axios';
import { getConfig } from '../config/config';

export interface OpeningTime {
    text: string;
    start: string;
    end: string;
}

export interface OpeningTimeOverride {
    date: string;
    text: string;
    start?: string;
    end?: string;
}

export interface StationDetail {
    id: string;
    name: string;
    brand: string;
    street: string;
    houseNumber: string;
    postCode: number;
    place: string;
    wholeDay: boolean;
    isOpen: boolean;
    lat: number;
    lng: number;
    lastUpdate: string;
    state: string;
    openingTimes: OpeningTime[];
    overrides: OpeningTimeOverride[];
}

export interface StationPreise {
    id: number;
    stationId: string;
    timestamp: string;
    status: string;
    e5: number;
    e10: number;
    diesel: number;
}

const api = axios.create({
    baseURL: getConfig().API_BASE_URL,
});

interface ApiErrorResponse {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    message?: string;
}

const handleApiError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const errorMessage = axiosError.message.toLowerCase();
        const errorDetail = axiosError.response?.data?.detail?.toLowerCase() || '';
        
        // DB-Verbindungsfehler
        if (
            errorMessage.includes('failed to connect') ||
            errorMessage.includes('connection refused') ||
            errorDetail.includes('database') ||
            errorDetail.includes('db') ||
            errorDetail.includes('connection') ||
            errorMessage.includes('5432') // PostgreSQL Standard-Port
        ) {
            throw new Error(
                'Datenbankverbindung fehlgeschlagen. ' +
                'Details: ' + (axiosError.response?.data?.detail || axiosError.message)
            );
        }

        // Netzwerkfehler
        if (!axiosError.response) {
            throw new Error(
                'API nicht erreichbar. ' +
                'Details: Der API-Server antwortet nicht. ' +
                'Bitte prüfen Sie, ob der API-Server (Tankpreise.API) läuft.'
            );
        }

        // HTTP-Statuscode Fehler
        if (axiosError.response.status === 404) {
            throw new Error('Die angeforderte Ressource wurde nicht gefunden.');
        }
        
        // Allgemeiner API-Fehler
        throw new Error(
            'API-Fehler: ' + 
            (axiosError.response.data.detail || axiosError.response.data.message || axiosError.message)
        );
    }

    // Unbekannter Fehler
    throw new Error('Ein unerwarteter Fehler ist aufgetreten. Bitte prüfen Sie die Browser-Konsole für weitere Details.');
};

export const TankstellenService = {
    async getAllStations(): Promise<StationDetail[]> {
        try {
            const response = await api.get<StationDetail[]>('/tankstellen/details');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async getAllPreise(): Promise<StationPreise[]> {
        try {
            const response = await api.get<StationPreise[]>('/tankstellen/preise');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async getStationPreise(stationId: string): Promise<StationPreise[]> {
        try {
            const response = await api.get<StationPreise[]>(`/tankstellen/preise/${stationId}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async getStationPreiseInTimeRange(stationId: string, von: Date, bis: Date): Promise<StationPreise[]> {
        try {
            const response = await api.get<StationPreise[]>(`/tankstellen/preise/${stationId}/zeitraum`, {
                params: {
                    von: von.toISOString(),
                    bis: bis.toISOString(),
                },
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
}; 