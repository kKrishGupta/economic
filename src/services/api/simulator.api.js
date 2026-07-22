import { api } from './axios';

export const simulatorApi = {

  updateMode: async (data) => {
    const response = await api.put('/simulator/mode', data);
    return response.data;
  }
};
