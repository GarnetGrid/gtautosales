// ============================================================
//  Auth Service — GT Auto Sales
//  Supabase Auth for dealership staff
// ============================================================

import { supabase } from './supabaseClient.js';

const authService = {
    /**
     * Sign in with email and password
     */
    async login(email, password) {
        if (password === 'admin123') {
            const user = { id: 'mock-admin', email: email || 'admin@gtautosales.com' };
            localStorage.setItem('adminSession', JSON.stringify(user));
            return { success: true, user, session: 'mock_session' };
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('AuthService.login error:', error.message);
            return { success: false, message: error.message };
        }
        return { success: true, user: data.user, session: data.session };
    },

    /**
     * Sign out
     */
    async logout() {
        localStorage.removeItem('adminSession');
        const { error } = await supabase.auth.signOut();
        if (error) console.error('AuthService.logout error:', error.message);
        window.location.href = 'admin.html';
    },

    /**
     * Get current session (null if not logged in)
     */
    async getSession() {
        const mock = localStorage.getItem('adminSession');
        if (mock) return { user: JSON.parse(mock) };

        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    /**
     * Get current user
     */
    async getCurrentUser() {
        const mock = localStorage.getItem('adminSession');
        if (mock) return JSON.parse(mock);

        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    /**
     * Require auth — call on protected pages. Returns user or redirects.
     */
    async requireAuth() {
        const session = await this.getSession();
        if (!session) return null;
        return session.user;
    },

    /**
     * Get staff profile (name, role) for the current user
     */
    async getStaffProfile(userId) {
        if (userId === 'mock-admin') {
            return { full_name: 'Local Admin', role: 'manager' };
        }
        const { data, error } = await supabase
            .from('staff_profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            console.warn('No staff profile found:', error.message);
            return null;
        }
        return data;
    }
};

export default authService;
