import axios from 'axios';

// Change this to your deployed backend URL when deploying
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const getCacheKey = (url, params) => {
  return `${url}_${JSON.stringify(params || {})}`;
};

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const clearCache = () => {
  cache.clear();
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    return Promise.reject(error);
  }
);

// Cached API wrapper
const cachedGet = async (url, params = {}, useCache = true) => {
  if (useCache) {
    const cacheKey = getCacheKey(url, params);
    const cached = getFromCache(cacheKey);
    if (cached) {
      return cached;
    }
    
    const response = await api.get(url, { params });
    setCache(cacheKey, response);
    return response;
  }
  
  return api.get(url, { params });
};

// Transaction APIs
export const transactionService = {
  create: async (data) => {
    clearCache(); // Clear cache on write operations
    return api.post('/transactions', data);
  },
  getAll: (params) => cachedGet('/transactions', params, false), // Don't cache transaction list
  getById: (id) => api.get(`/transactions/${id}`),
  update: async (id, data) => {
    clearCache(); // Clear cache on write operations
    return api.put(`/transactions/${id}`, data);
  },
  delete: async (id) => {
    clearCache(); // Clear cache on write operations
    return api.delete(`/transactions/${id}`);
  },
};

// Dashboard APIs - These benefit from caching
export const dashboardService = {
  getSummary: (params) => cachedGet('/dashboard/summary', params),
  getChartData: (params) => cachedGet('/dashboard/chart', params),
  getCategorySummary: (params) => cachedGet('/dashboard/category-summary', params),
  getDivisionSummary: (params) => cachedGet('/dashboard/division-summary', params),
};

// Account APIs
export const accountService = {
  create: async (data) => {
    clearCache();
    return api.post('/accounts', data);
  },
  getAll: () => cachedGet('/accounts'),
  getById: (id) => api.get(`/accounts/${id}`),
  update: async (id, data) => {
    clearCache();
    return api.put(`/accounts/${id}`, data);
  },
  delete: async (id) => {
    clearCache();
    return api.delete(`/accounts/${id}`);
  },
};

// Transfer APIs
export const transferService = {
  create: async (data) => {
    clearCache();
    return api.post('/transfers', data);
  },
  getAll: (params) => cachedGet('/transfers', params, false),
  getById: (id) => api.get(`/transfers/${id}`),
};

// Category APIs
export const categoryService = {
  getAll: () => cachedGet('/categories'),
  create: async (data) => {
    clearCache();
    return api.post('/categories', data);
  },
  initialize: async () => {
    clearCache();
    return api.post('/categories/initialize');
  },
};

export default api;