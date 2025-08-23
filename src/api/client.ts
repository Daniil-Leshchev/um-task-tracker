import axios from 'axios';
import { authService } from '../utils/authService';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json'
     },
});

api.interceptors.request.use(config => {
    const token = authService?.getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    res => res,
    async err => {
        const { config, response } = err || {};
        const url = (config?.url || '').toString();

        const isAuthEndpoint =
        url.includes('/login') ||
        url.includes('/register') ||
        url.includes('/token/refresh');

        if (response?.status === 401 && !isAuthEndpoint) {
        try {
            await authService?.refreshTokens();
            return api(err.config);
        } catch {
            authService?.logout();
            window.location.href = '/login';
        }
        }
        return Promise.reject(err);
    }
);

export default api;