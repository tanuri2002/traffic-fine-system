import axios from 'axios';

const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:5000/auth';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const authClient = axios.create({ baseURL: AUTH_API_URL, timeout: 10000 });
const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('officerToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('officerToken');
      localStorage.removeItem('officerData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (badgeNumber, password) =>
    authClient.post('/officer/login', { badgeNumber, password }),
};

export const fineService = {
  createFine: (fineData) => apiClient.post('/fines', fineData),
};

export default apiClient;