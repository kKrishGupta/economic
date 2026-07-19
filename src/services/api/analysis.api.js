import { api } from './axios';

export const analysisApi = {
  submitAnalysis: async (payload) => {
    const response = await api.post('/analysis/submit', payload);
    return response.data;
  },

  getJobStatus: async (jobId) => {
    const response = await api.get(`/analysis/status/${jobId}`);
    return response.data;
  }
};
