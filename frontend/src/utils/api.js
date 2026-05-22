import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const fetchServices = () => api.get('/services');
export const fetchService = (id) => api.get(`/services/${id}`);
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

export const fetchOrders = () => api.get('/orders');
export const fetchUserOrders = () => api.get('/orders/my-orders');
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);
export const adminLogin = (credentials) => api.post('/auth/admin/login', credentials);

export const initiatePayment = (data) => api.post('/payments/initiate', data);
export const checkPaymentStatus = (checkoutRequestId) => api.get(`/payments/status/${checkoutRequestId}`);