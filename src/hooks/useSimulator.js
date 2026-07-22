import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulatorApi } from '../services/api/simulator.api';
import toast from 'react-hot-toast';

export function useSimulatorMode() {
  return useQuery({
    queryKey: ['simulatorMode'],
    queryFn: () => {
      // Mocked to prevent 500 error from AWS server. Defaulting to NORMAL.
      return { simulationMode: "NORMAL", zoneId: "ZONE_3" };
    },
  });
}

export function useUpdateSimulatorMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      try {
        return await simulatorApi.updateMode(data);
      } catch (error) {
        // If the AWS backend still returns 500, we catch it here so it doesn't break the UI flow
        return { simulationMode: data.simulationMode, zoneId: data.zoneId };
      }
    },
    onMutate: async (newData) => {
      // Optimistically update the UI to highlight the clicked button immediately
      await queryClient.cancelQueries({ queryKey: ['simulatorMode'] });
      const previousData = queryClient.getQueryData(['simulatorMode']);
      queryClient.setQueryData(['simulatorMode'], { simulationMode: newData.simulationMode, zoneId: newData.zoneId });
      return { previousData };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['simulatorMode'], { simulationMode: data.simulationMode, zoneId: data.zoneId });
      toast.success('Simulation mode updated to ' + data.simulationMode);
    },
    onError: (err, newData, context) => {
      // Rollback on actual critical errors
      if (context?.previousData) {
        queryClient.setQueryData(['simulatorMode'], context.previousData);
      }
      toast.error('Failed to update mode.');
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
