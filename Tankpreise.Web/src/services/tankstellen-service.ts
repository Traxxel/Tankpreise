import axios from 'axios';
import { API_BASE_URL } from '../config/api-config';

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
    latitude: number;
    longitude: number;
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
    baseURL: API_BASE_URL,
});

export const TankstellenService = {
    async getAllStations(): Promise<StationDetail[]> {
        const response = await api.get<StationDetail[]>('/tankstellen/details');
        return response.data;
    },

    async getAllPreise(): Promise<StationPreise[]> {
        const response = await api.get<StationPreise[]>('/tankstellen/preise');
        return response.data;
    },

    async getStationPreise(stationId: string): Promise<StationPreise[]> {
        const response = await api.get<StationPreise[]>(`/tankstellen/preise/${stationId}`);
        return response.data;
    },

    async getStationPreiseInTimeRange(stationId: string, von: Date, bis: Date): Promise<StationPreise[]> {
        const response = await api.get<StationPreise[]>(`/tankstellen/preise/${stationId}/zeitraum`, {
            params: {
                von: von.toISOString(),
                bis: bis.toISOString(),
            },
        });
        return response.data;
    },
}; 