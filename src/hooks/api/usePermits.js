import { useMutation } from '@tanstack/react-query';
import { runPermitAgent } from '../../services/permit.service';

export const usePermitAnalysis = () => {
  return useMutation({
    mutationFn: (payload) => runPermitAgent(payload),
    onSuccess: (data) => {
      // Handle logic for when permit intelligence returns
    },
    onError: (error) => {
      console.error('Permit Agent Failed:', error);
    }
  });
};
