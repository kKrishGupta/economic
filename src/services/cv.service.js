import api from './api';

/**
 * Runs only the CV Safety Agent.
 * Endpoint: POST /api/agents/cv
 * 
 * @param {Object} payload - The CVOnlyRequest
 * @param {string} payload.zone_id
 * @param {number} payload.workers_detected
 * @param {Array<Object>} payload.violations
 * 
 * @returns {Promise<Object>} Returns cv_safety_out schema
 */
export const runCVAgent = async (payload) => {
  const response = await api.post('/api/agents/cv', payload);
  return response.data;
};
