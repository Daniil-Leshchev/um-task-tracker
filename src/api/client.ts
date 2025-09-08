import axios from 'axios';
import { authService } from '../utils/authService';
const BASE_URL: string = ((import.meta as any).env?.VITE_API_BASE_URL as string);

const api = axios.create({
    baseURL: BASE_URL,
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