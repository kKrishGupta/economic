import { useMutation } from '@tanstack/react-query';
import { runRAGAgent } from '../../services/rag.service';
import toast from 'react-hot-toast';

export const useRAGCompliance = () => {
  return useMutation({
    mutationFn: (payload) => runRAGAgent(payload),
    onSuccess: (data) => {
       toast.success('AI Compliance Recommendations Generated.');
    },
    onError: (error) => {
      console.error('RAG Agent Failed:', error);
    }
  });
};
