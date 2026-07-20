import api from './api';

/**
 * Queries ChromaDB and Gemini for regulations and recommendations.
 * Endpoint: POST /api/agents/rag
 * 
 * @param {Object} payload - The RAGOnlyRequest
 * @param {string} payload.zone_id
 * @param {number} payload.sensor_reading
 * @param {Array<Object>} payload.cv_violations
 * @param {Array<Object>} payload.active_permits
 * 
 * @returns {Promise<Object>} Returns rag_compliance_out schema
 */
export const runRAGAgent = async (payload) => {
  const response = await api.post('/api/agents/rag', payload);
  return response.data;
};
