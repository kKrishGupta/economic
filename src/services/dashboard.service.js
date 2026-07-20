import api from './api';

/**
 * Fetch health status of the API and its active agents.
 * Endpoint: GET /health
 * 
 * @returns {Promise<Object>} Status object
 */
export const getSystemHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};
