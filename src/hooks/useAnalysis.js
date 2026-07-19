import { useMutation, useQuery } from '@tanstack/react-query';
import { analysisApi } from '../services/api/analysis.api';
import { toast } from 'react-hot-toast';

export function useSubmitAnalysis() {
  return useMutation({
    mutationFn: (payload) => analysisApi.submitAnalysis(payload),
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to submit analysis job.';
      toast.error(message);
    }
  });
}

export function useAnalysisStatus(jobId) {
  return useQuery({
    queryKey: ['analysisStatus', jobId],
    queryFn: () => analysisApi.getJobStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (data) => {
      // If the job is completed or failed, stop polling
      if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
        return false;
      }
      return 2000; // poll every 2 seconds
    },
  });
}
