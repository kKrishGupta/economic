import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';
import { useAuth } from '../../providers/AuthProvider';

export const useUsers = (page = 0, size = 100) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['users', page, size],
    queryFn: () => adminService.getUsers(page, size),
    enabled: user?.role === 'ADMIN', // Only fetch if admin
    staleTime: 30000,
  });
};
