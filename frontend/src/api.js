import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('prepsight_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (payload) => api.post('/auth/register', payload);

export const loginUser = (payload) => api.post('/auth/login', payload);

export const getGoogleLoginUrl = () => {
  const authBaseUrl = BASE_URL.replace(/\/api\/?$/, '');
  return `${authBaseUrl}/oauth2/authorization/google`;
};

export const getExperiences = (company = '', sort = '') =>
  api.get('/experiences', { params: { company, sort } });

export const addExperience = (experience) => api.post('/experiences', experience);

export const updateExperience = (id, experience) =>
  api.put(`/experiences/${id}`, experience);

export const deleteExperience = (id) => api.delete(`/experiences/${id}`);

export const getTopicAnalysis = () => api.get('/experiences/analysis/topics');

export const getDifficultyAnalysis = () => api.get('/experiences/analysis/difficulty');

export const getAdminUsers = () => api.get('/admin/users');

export const createAdminUser = (payload) => api.post('/admin/users', payload);

export const updateAdminUser = (id, payload) => api.put(`/admin/users/${id}`, payload);

export const updateAdminUserRole = (id, role) =>
  api.patch(`/admin/users/${id}/role`, null, { params: { role } });

export const updateAdminUserStatus = (id, active) =>
  api.patch(`/admin/users/${id}/status`, null, { params: { active } });

export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
