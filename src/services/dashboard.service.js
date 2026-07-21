import api from './api';

/**
 * Fetch health status of the API and its active agents.
 * Endpoint: GET /health
 * 
 * @returns {Promise<Object>} Status object
 */
export const getSystemHealth = async () => {
  try {
    const response = await api.get('/actuator/health');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 503) {
      // Actuator returns 503 when status is DOWN (e.g., a component like modelService is unreachable)
      return error.response.data;
    }
    throw error;
  }
};
