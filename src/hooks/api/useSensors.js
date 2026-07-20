import { useMutation } from '@tanstack/react-query';
import { runSensorAgent } from '../../services/sensor.service';
import toast from 'react-hot-toast';

export const useSensorAnalysis = () => {
  return useMutation({
    mutationFn: (payload) => runSensorAgent(payload),
    onSuccess: (data) => {
      if (data.severity === 'CRITICAL' || data.severity === 'HIGH') {
         toast.error(`Sensor Anomaly Detected: ${data.severity}`, { duration: 5000 });
      }
    },
    onError: (error) => {
      console.error('Sensor Agent Failed:', error);
    }
  });
};
