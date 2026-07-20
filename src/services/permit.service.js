import api from './api';

/**
 * Analyzes permits for overlap and expiry.
 * Endpoint: POST /api/agents/permit
 * 
 * @param {Object} payload - The PermitOnlyRequest
 * @param {Array<Object>} payload.permits - Active permits
 * @param {string} [payload.current_time]
 * @param {number} [payload.current_gas]
 * 
 * @returns {Promise<Object>} Returns permit_intel_out schema
 */
export const runPermitAgent = async (payload) => {
  const response = await api.post('/api/agents/permit', payload);
  return response.data;
};
