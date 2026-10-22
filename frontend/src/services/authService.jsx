import api, { setAccessToken } from '../api/api';
import { handleServiceError } from '../utils/errorHandler.jsx';

export const authService = {

    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error("Erro ao invalidar sessão no servidor:", err);
        }
    },

    async getMe() {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async register(userData) {
        try {
            const res = await api.post('/auth/register', userData);
            return res.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async checkEmail(email) {
        try {
            const res = await api.get('/auth/check-email', { params: { email } });
            return res.data.exists; // true ou false
        } catch (err) {
            return false; // Em validações silenciosas, falha por segurança
        }
    },

    async checkUsername(username) {
        try {
            const res = await api.get('/auth/check-username', { params: { username } });
            return res.data.exists;
        } catch (err) {
            return false;
        }
    },

    async forgotPassword(email) {
        try {
            const res = await api.post('/auth/forgot-password', { email });
            return res.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async resetPassword(token, newPassword) {
        try {
            const res = await api.post('/auth/reset-password', {
                token,
                new_password: newPassword
            });
            return res.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async confirmEmail(token) {
        try {
            const res = await api.post('/auth/confirm-email', { token });
            return res.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async resendEmail(email) {
        try {
            const res = await api.post('/auth/resend-confirmation', { email });
            return res.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },
};

