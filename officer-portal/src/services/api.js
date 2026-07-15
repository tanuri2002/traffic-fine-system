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

const isMockAuth = process.env.REACT_APP_MOCK_AUTH === 'true';

let mockUsers = null;
if (isMockAuth) {
  // lazy-load to avoid import in production bundles
  // eslint-disable-next-line global-require
  mockUsers = require('./mockUsers').default;
}

export const authService = isMockAuth
  ? {
      login: (badgeNumber, password) => {
        const user = mockUsers.find((u) => u.badgeNumber === badgeNumber);
        if (!user) {
          return Promise.reject({ response: { status: 401, data: { message: 'Officer not found' } } });
        }
        if (user.password !== password) {
          return Promise.reject({ response: { status: 401, data: { message: 'Invalid credentials' } } });
        }
        // return shape similar to backend
        const officer = {
          badgeNumber: user.badgeNumber,
          name: user.name,
          phone: user.phone,
          district: user.district,
          passwordHash: user.passwordHash,
          role: user.role,
        };
        return Promise.resolve({ data: { token: 'dev-mock-token', officer } });
      },
    }
  : {
      login: (badgeNumber, password) => authClient.post('/officer/login', { badgeNumber, password }),
    };

let fineService;
if (isMockAuth) {
  fineService = {
    createFine: (fineData) => {
      const stored = JSON.parse(localStorage.getItem('mockFines') || '[]');
      const id = `mock-${Date.now()}`;
      const record = { id, ...fineData };
      stored.push(record);
      localStorage.setItem('mockFines', JSON.stringify(stored));
      return Promise.resolve({ data: record });
    },
  };
} else {
  fineService = {
    createFine: (fineData) => apiClient.post('/fines', fineData),
  };
}

export { fineService };

export default apiClient;