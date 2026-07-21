import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulatorApi } from '../services/api/simulator.api';
import toast from 'react-hot-toast';

export function useSimulatorMode() {
  return useQuery({
    queryKey: ['simulatorMode'],
    queryFn: () => simulatorApi.getMode(),
  });
}

export function useUpdateSimulatorMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => simulatorApi.updateMode(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['simulatorMode']);
      toast.success('Simulation mode updated.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update mode.');
    }
  });
}

export function useTriggerScenario() {
  return useMutation({
    mutationFn: (scenario) => simulatorApi.triggerScenario(scenario),
    onSuccess: () => {
      toast.success('Scenario triggered successfully.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to trigger scenario.');
    }
  });
}
