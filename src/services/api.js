import axios from 'axios';

// Change this to your deployed backend URL when deploying
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction APIs
export const transactionService = {
  create: (data) => api.post('/transactions', data),
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Dashboard APIs
export const dashboardService = {
  getSummary: (params) => api.get('/dashboard/summary', { params }),
  getChartData: (params) => api.get('/dashboard/chart', { params }),
  getCategorySummary: (params) => api.get('/dashboard/category-summary', { params }),
  getDivisionSummary: (params) => api.get('/dashboard/division-summary', { params }),
};

// Account APIs
export const accountService = {
  create: (data) => api.post('/accounts', data),
  getAll: () => api.get('/accounts'),
  getById: (id) => api.get(`/accounts/${id}`),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
};

// Transfer APIs
export const transferService = {
  create: (data) => api.post('/transfers', data),
  getAll: (params) => api.get('/transfers', { params }),
  getById: (id) => api.get(`/transfers/${id}`),
};

// Category APIs
export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  initialize: () => api.post('/categories/initialize'),
};

export default api;