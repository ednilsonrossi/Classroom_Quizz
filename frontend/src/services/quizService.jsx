import api from "../api/api";
import { handleServiceError } from "../utils/ErrorHandler";

export const quizService = {

    async getLibrary() {
        try {
            const response = await api.get('/quiz/library');
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async getQuestionsBank() {
        try {
            const response = await api.get('/quiz/questions-bank');
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async createQuiz(quizData) {
        try {
            const response = await api.post('/quiz/create', quizData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async getQuiz(quizId){
        try{
            const response = await api.get(`/quiz/${quizId}`);
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async moveQuiz(quizId, folderId) {
        try {
            const response = await api.patch(`/quiz/${quizId}/folder`, { folderId });
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async deleteQuiz(quizId) {
        try {
            const response = await api.delete(`/quiz/delete/${quizId}`);
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

};