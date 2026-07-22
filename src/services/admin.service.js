import { api } from './api/axios';

export const adminService = {
  getUsers: async (page = 0, size = 100) => {
    const response = await api.get(`/admin/users?page=${page}&size=${size}`);
    return response.data;
  }
};
