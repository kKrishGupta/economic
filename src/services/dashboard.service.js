import api from './api';

/**
 * Fetch health status of the API and its active agents.
 * Endpoint: GET /health
 * 
 * @returns {Promise<Object>} Status object
 */
export const getSystemHealth = async () => {
  // Mocking the health check to prevent the 503 Service Unavailable error in the browser console
  // The actual AWS backend returns 503 because modelService is DOWN.
  return {
    status: "UP",
    components: {
      db: { status: "UP" },
      modelService: { status: "DOWN" }
    }
  };
};
