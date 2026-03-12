import { MOCK_VEHICLES, UPCOMING_VEHICLES } from '../data/mockVehicles.js';
import { supabase } from './supabaseClient.js';

// Configuration: Toggle true/false to switch between Mock and Live (Supabase)
const USE_MOCK_DATA = true;

/**
 * Maps a flat DB row to the nested { specs: {} } shape the UI expects
 */
function mapToVehicle(row) {
    return {
        id: row.id,
        make: row.make,
        model: row.model,
        year: row.year,
        price: row.price,
        mileage: row.mileage,
        type: row.type,
        image: row.image,
        featured: row.featured,
        description: row.description,
        specs: {
            engine: row.engine,
            transmission: row.transmission,
            drivetrain: row.drivetrain,
            color: row.color
        }
    };
}

class VehicleService {
    async getAll() {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve(MOCK_VEHICLES), 300));
        }
        const { data, error } = await supabase.from('vehicles').select('*').order('id');
        if (error) {
            console.error('VehicleService.getAll error:', error);
            return MOCK_VEHICLES; // Graceful fallback
        }
        return data.map(mapToVehicle);
    }

    async getFeatured() {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve(MOCK_VEHICLES.filter(v => v.featured)), 300));
        }
        const { data, error } = await supabase.from('vehicles').select('*').eq('featured', true);
        if (error) {
            console.error('VehicleService.getFeatured error:', error);
            return MOCK_VEHICLES.filter(v => v.featured);
        }
        return data.map(mapToVehicle);
    }

    async getUpcoming() {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => setTimeout(() => resolve(UPCOMING_VEHICLES), 300));
        }
        const { data, error } = await supabase.from('upcoming_vehicles').select('*').order('id');
        if (error) {
            console.error('VehicleService.getUpcoming error:', error);
            return UPCOMING_VEHICLES;
        }
        return data;
    }

    async getById(id) {
        if (USE_MOCK_DATA) {
            return new Promise(resolve => {
                const vehicle = MOCK_VEHICLES.find(v => v.id === parseInt(id));
                resolve(vehicle || null);
            });
        }
        const { data, error } = await supabase.from('vehicles').select('*').eq('id', parseInt(id)).single();
        if (error) {
            console.error('VehicleService.getById error:', error);
            return null;
        }
        return mapToVehicle(data);
    }

    // ─── Admin CRUD (for admin.js) ───

    async addVehicle(vehicle) {
        if (USE_MOCK_DATA) {
            return { id: Date.now(), ...vehicle };
        }
        const row = {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            price: vehicle.price,
            mileage: vehicle.mileage || 0,
            type: vehicle.type || 'Sedan',
            image: vehicle.image || '',
            featured: vehicle.featured || false,
            description: vehicle.description || '',
            engine: vehicle.specs?.engine || '',
            transmission: vehicle.specs?.transmission || '',
            drivetrain: vehicle.specs?.drivetrain || '',
            color: vehicle.specs?.color || ''
        };
        const { data, error } = await supabase.from('vehicles').insert(row).select().single();
        if (error) {
            console.error('VehicleService.addVehicle error:', error);
            return null;
        }
        return mapToVehicle(data);
    }

    async updateVehicle(id, updates) {
        if (USE_MOCK_DATA) {
            return { id, ...updates };
        }
        const row = {};
        if (updates.make !== undefined) row.make = updates.make;
        if (updates.model !== undefined) row.model = updates.model;
        if (updates.year !== undefined) row.year = updates.year;
        if (updates.price !== undefined) row.price = updates.price;
        if (updates.mileage !== undefined) row.mileage = updates.mileage;
        if (updates.type !== undefined) row.type = updates.type;
        if (updates.image !== undefined) row.image = updates.image;
        if (updates.featured !== undefined) row.featured = updates.featured;
        if (updates.description !== undefined) row.description = updates.description;
        if (updates.specs) {
            if (updates.specs.engine) row.engine = updates.specs.engine;
            if (updates.specs.transmission) row.transmission = updates.specs.transmission;
            if (updates.specs.drivetrain) row.drivetrain = updates.specs.drivetrain;
            if (updates.specs.color) row.color = updates.specs.color;
        }
        const { data, error } = await supabase.from('vehicles').update(row).eq('id', id).select().single();
        if (error) {
            console.error('VehicleService.updateVehicle error:', error);
            return null;
        }
        return mapToVehicle(data);
    }

    async deleteVehicle(id) {
        if (USE_MOCK_DATA) {
            return true;
        }
        const { error } = await supabase.from('vehicles').delete().eq('id', id);
        if (error) {
            console.error('VehicleService.deleteVehicle error:', error);
            return false;
        }
        return true;
    }
}

export const vehicleService = new VehicleService();
