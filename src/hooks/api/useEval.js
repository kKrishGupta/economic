import { useMutation, useQueryClient } from '@tanstack/react-query';
import { evaluateSafety } from '../../services/eval.service';
import toast from 'react-hot-toast';

export const useSafetyEval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => evaluateSafety(payload),
    onSuccess: (data) => {
      toast.success('Safety evaluation completed.');
      // Update specific caches if needed
      queryClient.setQueryData(['latestEval'], data);
    },
    onError: (error) => {
      console.error('Safety Evaluation Failed:', error);
      // Toast is already handled in axios interceptor, but we can add specific logic here
    }
  });
};
