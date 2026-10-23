import axios from 'axios';
import { useUserStore } from './store';

const instance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3001/api',
});

// Dodaj interceptor do automatycznego dodawania tokenu
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor odpowiedzi - wyloguj przy 401 (token wygasł)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token wygasł lub jest nieprawidłowy - wyloguj użytkownika
      useUserStore.getState().logoutUser();
    }
    return Promise.reject(error);
  }
);

export default instance;
