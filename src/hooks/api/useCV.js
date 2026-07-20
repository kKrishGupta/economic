import { useMutation } from '@tanstack/react-query';
import { runCVAgent } from '../../services/cv.service';

export const useCVAnalysis = () => {
  return useMutation({
    mutationFn: (payload) => runCVAgent(payload),
    onSuccess: (data) => {
      // Logic for CV returns
    },
    onError: (error) => {
      console.error('CV Agent Failed:', error);
    }
  });
};
