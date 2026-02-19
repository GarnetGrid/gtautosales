// ============================================================
//  Lead Service — GT Auto Sales
//  Handles lead capture form submissions
//  Live Supabase integration with mock fallback
// ============================================================

import { supabase } from './supabaseClient.js';

const USE_MOCK_DATA = false;

const mockLeads = [];

const leadService = {
    /**
     * Submit a new lead
     * @param {Object} leadData - { name, email, phone, vehicleType, budget, hasTradein, message }
     * @returns {Promise<Object>} - { success, id, message }
     */
    async submitLead(leadData) {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const lead = {
                        id: `lead_${Date.now()}`,
                        ...leadData,
                        submittedAt: new Date().toISOString(),
                        status: 'new'
                    };
                    mockLeads.push(lead);
                    resolve({
                        success: true,
                        id: lead.id,
                        message: 'Thank you! Our team will contact you within 24 hours.'
                    });
                }, 1200);
            });
        }

        // Map form fields to Supabase leads table schema
        const row = {
            first_name: leadData.name?.split(' ')[0] || leadData.name || '',
            last_name: leadData.name?.split(' ').slice(1).join(' ') || '',
            email: leadData.email || null,
            phone: leadData.phone || null,
            vehicle_interest: leadData.vehicleType || leadData.vehicle || null,
            source: 'web',
            stage: 'new',
            temperature: 'warm',
            notes: leadData.message || null
        };

        // Map budget string to budget_low/budget_high
        if (leadData.budget) {
            const budgetMap = {
                'under-50k': { low: 0, high: 50000 },
                '50k-100k': { low: 50000, high: 100000 },
                '100k-200k': { low: 100000, high: 200000 },
                'over-200k': { low: 200000, high: 500000 }
            };
            const range = budgetMap[leadData.budget];
            if (range) {
                row.budget_low = range.low;
                row.budget_high = range.high;
            }
        }

        if (leadData.hasTradein) {
            row.trade_in = 'Yes';
        }

        const { data, error } = await supabase.from('leads').insert(row).select().single();
        if (error) {
            console.error('LeadService.submitLead error:', error);
            return { success: false, message: 'There was an issue submitting your inquiry. Please try again or call us directly.' };
        }
        return {
            success: true,
            id: data.id,
            message: 'Thank you! Our team will contact you within 24 hours.'
        };
    },

    /**
     * Get all submitted leads (admin use)
     */
    async getLeads() {
        if (USE_MOCK_DATA) return [...mockLeads];

        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('LeadService.getLeads error:', error);
            return [];
        }
        return data;
    }
};

export default leadService;
