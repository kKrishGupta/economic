import { useQuery } from '@tanstack/react-query';
import { getSystemHealth } from '../../services/dashboard.service';

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: getSystemHealth,
    refetchInterval: 30000, // Poll every 30 seconds
  });
};
