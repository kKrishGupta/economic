import { api } from './axios';

export const adminApi = {
  getUsers: async (page = 0, size = 20) => {
    const response = await api.get('/admin/users', { params: { page, size } });
    return response.data;
  },

  getLogs: async (page = 0, size = 20) => {
    const response = await api.get('/admin/logs', { params: { page, size } });
    return response.data;
  },

  getMetrics: async () => {
    const response = await api.get('/admin/metrics');
    return response.data;
  }
};
