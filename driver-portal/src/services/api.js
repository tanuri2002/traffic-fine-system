import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:5000/auth';
const PAYMENT_API_URL = process.env.REACT_APP_PAYMENT_API_URL || 'http://localhost:5000/payment';

// Create axios instances
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const authClient = axios.create({
  baseURL: AUTH_API_URL,
  timeout: 10000
});

const paymentClient = axios.create({
  baseURL: PAYMENT_API_URL,
  timeout: 10000
});

// Interceptor to add auth token to requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// API endpoints
export const fineService = {
  getFineDetails: (referenceNumber, categoryId) =>
    apiClient.get(`/fines/${referenceNumber}`, {
      params: { categoryId }
    }),
  
  searchFine: (referenceNumber) =>
    apiClient.get(`/fines/search/${referenceNumber}`)
};

export const paymentService = {
  processPayment: (paymentData) =>
    paymentClient.post('/process', paymentData),
  
  getPaymentStatus: (transactionId) =>
    paymentClient.get(`/status/${transactionId}`)
};

export const authService = {
  login: (credentials) =>
    authClient.post('/login', credentials),
  
  logout: () =>
    authClient.post('/logout')
};

export default apiClient;
