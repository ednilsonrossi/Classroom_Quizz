import api from "../api/api";
import { handleServiceError } from "../utils/errorHandler.jsx";

export const folderService = {

    async listFolders() {
        try {
            const response = await api.get('/folder/');
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async getFolderContents(folderId) {
        try {
            const response = await api.get(`/folder/library/${folderId}/quizzes`);
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async createFolder(folderData) {
        try {
            const response = await api.post('/folder/create', folderData);
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },

    async deleteFolder(folderId) {
        try {
            const response = await api.delete(`/folder/delete/${folderId}`);
            return response.data;
        } catch (err) {
            throw handleServiceError(err);
        }
    },
};