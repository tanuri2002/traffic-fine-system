import axios from 'axios';

const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:5000/auth';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const PAYMENT_API_URL = process.env.REACT_APP_PAYMENT_API_URL || 'http://localhost:5001/api/fine';

const authClient = axios.create({ baseURL: AUTH_API_URL, timeout: 10000 });
const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });
const paymentClient = axios.create({ baseURL: PAYMENT_API_URL, timeout: 10000 });

// Attach officer JWT to requests for apiClient (backend-auth) and paymentClient (backend-payment)
function attachTokenInterceptor(instance) {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('officerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

attachTokenInterceptor(apiClient);
attachTokenInterceptor(paymentClient);

// Handle 401 globally – clear session and redirect to login
function handleUnauthorized(instance) {
  instance.interceptors.response.use(
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
}

handleUnauthorized(apiClient);
handleUnauthorized(paymentClient);

const isMockAuth =
  process.env.REACT_APP_MOCK_AUTH === 'true' ||
  process.env.REACT_APP_USE_MOCK === 'true';

let mockUsers = null;
if (isMockAuth) {
  // lazy-load to avoid import in production bundles
  // eslint-disable-next-line global-require
  mockUsers = require('./mockUsers').default;
}

export const authService = isMockAuth
  ? {
    login: (badgeNumber, password) => {
      const stored = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const users = [...mockUsers, ...stored];
      const user = users.find((u) => u.badgeNumber === badgeNumber);
      if (!user) {
        return Promise.reject({ response: { status: 401, data: { message: 'Officer not found' } } });
      }
      if (user.password !== password) {
        return Promise.reject({ response: { status: 401, data: { message: 'Invalid credentials' } } });
      }
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
    createOfficer: (officerData) => {
      const stored = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const users = [...mockUsers, ...stored];
      if (users.find((u) => u.badgeNumber === officerData.badgeNumber)) {
        return Promise.reject({ response: { status: 409, data: { message: 'Badge number already exists' } } });
      }
      const newOfficer = {
        badgeNumber: officerData.badgeNumber,
        name: officerData.name,
        phone: officerData.phone,
        district: officerData.district,
        password: officerData.password,
        passwordHash: `dev-hash-${Date.now()}`,
        role: officerData.role || 'officer',
      };
      stored.push(newOfficer);
      localStorage.setItem('mockUsers', JSON.stringify(stored));
      return Promise.resolve({ data: newOfficer });
    },
  }
  : {
    login: (badgeNumber, password) => authClient.post('/officer/login', { badgeNumber, password }),
    createOfficer: (officerData) => authClient.post('/officer', officerData),
  };

export const fineService = isMockAuth
  ? {
    createFine: (fineData) => {
      const stored = JSON.parse(localStorage.getItem('mockFines') || '[]');
      const id = `mock-${Date.now()}`;
      const record = { id, ...fineData };
      stored.push(record);
      localStorage.setItem('mockFines', JSON.stringify(stored));
      return Promise.resolve({ data: record });
    },
    getFineDetails: (referenceNumber, categoryId) => {
      return paymentClient.get('/fine', { params: { referenceNumber, categoryId } });
    },
    getCategories: () => {
      // Static fallback for mock/dev mode — adjust ids/titles to match your real table if needed
      return Promise.resolve({
        data: [
          { id: 1, code: 'PARKING', title: 'Test Category - DO NOT USE' },
          { id: 2, code: 'SPEEDING', title: 'Speed Limit Exceeded' },
        ],
      });
    },
  }
  : {
    createFine: (fineData) => apiClient.post('/fines', fineData),
    getFineDetails: (referenceNumber, categoryId) => paymentClient.get('/fine', { params: { referenceNumber, categoryId } }),
    getCategories: () => apiClient.get('/categories'),
  };

export const paymentService = {
  processPayment: (paymentData) => paymentClient.post('/pay', paymentData),
  getPaymentStatus: (referenceNumber) => paymentClient.get(`/payments/${referenceNumber}`),
};

export { authClient, apiClient, paymentClient };
export default apiClient;

