import api from "../api/api";
import { handleServiceError } from "../utils/errorHandler.jsx";

export const dashboardService = {
    
    async getSummary() {
        try {
            const response = await api.get('/dashboard/summary');
            return response.data; 
        } catch (err) {
            throw handleServiceError(err);
        }
    }
};