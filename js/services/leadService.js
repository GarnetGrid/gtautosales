// ============================================================
//  Lead Service — GT Auto Sales
//  Handles lead capture form submissions
//  Live Mac Mini API Integration
// ============================================================

const API_URL = 'https://api.garnetgrid.com/api/leads';

const leadService = {
    /**
     * Submit a new lead
     * @param {Object} leadData - { name, email, phone, vehicleType, budget, hasTradein, message }
     * @returns {Promise<Object>} - { success, id, message }
     */
    async submitLead(leadData) {
        try {
            // Format custom fields into the message payload for Mac Mini API
            const formattedMessage = `
--- GT Auto Sales Lead ---
Phone: ${leadData.phone || 'N/A'}
Vehicle Interest: ${leadData.vehicleType || leadData.vehicle || 'N/A'}
Budget: ${leadData.budget || 'N/A'}
Trade-in: ${leadData.hasTradein ? 'Yes' : 'No'}

Message:
${leadData.message || 'No additional message provided.'}
            `.trim();

            const payload = {
                name: leadData.name || '',
                email: leadData.email || '',
                company: 'GT Auto Sales Website',
                message: formattedMessage,
                source_tool: 'gtautosales_contact',
                lead_type: 'sales_inquiry',
                tags: JSON.stringify(['gt_auto_sales', 'inbound_lead']) // Pass as JSON string array to match what API expects
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('LeadService.submitLead HTTP error:', response.status, errorText);
                return { success: false, message: 'There was an issue submitting your inquiry. Please try again or call us directly.' };
            }

            const data = await response.json();

            return {
                success: true,
                id: data.id || 'success',
                message: 'Thank you! Our team will contact you within 24 hours.'
            };
        } catch (error) {
            console.error('LeadService.submitLead fetch error:', error);
            return { success: false, message: 'There was a network error. Please try again or call us directly.' };
        }
    },

    /**
     * Get all submitted leads (admin use)
     * Note: Admin dashboard requires Mac Mini API authentication to view.
     */
    async getLeads() {
        console.warn('getLeads is temporarily mocked. Requires Mac Mini API admin token.');
        return [];
    }
};

export default leadService;
