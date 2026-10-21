import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

// Controle de fila para renovação de token
let isRefreshing = false;
let failedQueue = []; //guarda requisições que falharam

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

//Anexa o token se ele existir
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//Gerencia expiração (401) e Refresh
api.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = error.config;

        //Se o erro não for 401 ou se for uma tentativa de refresh que falhou, encerra
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        //Evita loop infinito se a rota de login ou refresh der 401
        const requestUrl = originalRequest.url || "";
        if (requestUrl.includes("/auth/refresh") || requestUrl.includes("/auth/login")) {
            accessToken = null;
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        //Se já houver um processo de refresh em curso, coloca esta requisição na fila
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            //Chama a rota de refresh. O Flask lerá o Cookie HttpOnly automaticamente.
            const response = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
            const { access_token } = response.data;

            if (!access_token) throw new Error("Token não recebido.");

            setAccessToken(access_token);

            processQueue(null, access_token);

            //Refaz a requisição original que falhou
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return api(originalRequest);

        } catch (err) {
            processQueue(err, null);
            setAccessToken(null);

            return Promise.reject(err);

        } finally {
            isRefreshing = false;
        }
    }
);

export default api;