import api from './api';

/**
 * Executes the complete LangGraph multi-agent flow.
 * Endpoint: POST /api/eval
 * 
 * @param {Object} payload - The SafetyEvalRequest matching backend
 * @param {string} payload.zone_id - Target zone (e.g., "ZONE_3")
 * @param {string} [payload.current_time] - ISO8601 timestamp (optional)
 * @param {number} [payload.shift_risk_factor] - Risk modifier (default: 0.10)
 * @param {Array<Array<number>>} payload.sensor_raw_history - [[Gas, Temp, Pressure], ...]
 * @param {Object} payload.cv_raw_frame - { zone_id, workers_detected, violations: [] }
 * @param {Array<Object>} payload.active_permits_raw - [{ permit_id, type, zone_id, ... }]
 * 
 * @returns {Promise<Object>} Returns fully populated AgentState
 */
export const evaluateSafety = async (payload) => {
  const response = await api.post('/api/eval', payload);
  return response.data;
};

/**
 * Evaluates via Gradio API structure if required
 * Endpoint: POST /gradio_api/call/eval
 */
export const evaluateGradioSafety = async (payload) => {
  const response = await api.post('/gradio_api/call/eval', { data: [JSON.stringify(payload)] });
  return JSON.parse(response.data.data[0]);
};
