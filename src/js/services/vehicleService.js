import { MOCK_VEHICLES, UPCOMING_VEHICLES } from '../data/mockVehicles.js';

// Configuration: Toggle true/false to switch between Mock and Live (Supabase)
const USE_MOCK_DATA = true;

class VehicleService {
    constructor() {
        this.supabase = null;
        this.init();
    }

    async init() {
        if (!USE_MOCK_DATA) {
            // TODO: Initialize Supabase Client here when config is ready (Phase 4)
            // import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
            // this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('Supabase mode enabled (Pending Configuration)');
        }
    }

    async getAll() {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve(MOCK_VEHICLES), 300)); // Simulate latency
        }
        // return this.supabase.from('vehicles').select('*');
    }

    async getFeatured() {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve(MOCK_VEHICLES.filter(v => v.featured)), 300));
        }
        // return this.supabase.from('vehicles').select('*').eq('featured', true);
    }

    async getUpcoming() {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve(UPCOMING_VEHICLES), 300));
        }
    }

    async getById(id) {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                const vehicle = MOCK_VEHICLES.find(v => v.id === parseInt(id));
                resolve(vehicle || null);
            });
        }
        // const { data } = await this.supabase.from('vehicles').select('*').eq('id', id).single();
        // return data;
    }
}

export const vehicleService = new VehicleService();
