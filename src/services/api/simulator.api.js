import { api } from './axios';

export const simulatorApi = {
  getMode: async () => {
    const response = await api.get('/simulator/mode');
    return response.data;
  },

  updateMode: async (data) => {
    const response = await api.put('/simulator/mode', data);
    return response.data;
  },

  triggerScenario: async (scenario) => {
    const response = await api.post('/scenario/trigger', { scenario });
    return response.data;
  }
};
