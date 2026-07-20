import api from './api';

/**
 * Runs only the Sensor LSTM Anomaly Detection agent.
 * Endpoint: POST /api/agents/sensor
 * 
 * @param {Object} payload - The SensorOnlyRequest
 * @param {Array<Array<number>>} payload.sensor_raw_history - [[Gas, Temp, Pressure], ...]
 * 
 * @returns {Promise<Object>} Returns sensor_anomaly_out schema
 */
export const runSensorAgent = async (payload) => {
  const response = await api.post('/api/agents/sensor', payload);
  return response.data;
};
