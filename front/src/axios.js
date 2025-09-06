import axios from 'axios';

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

export default instance;
