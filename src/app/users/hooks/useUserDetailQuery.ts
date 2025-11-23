import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { User } from '@/types/user';

export function useUserDetailQuery(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await api.get<User>(`users/${id}`);
      if (!data || !data.id) throw new Error('User not found');
      return data;
    },
    retry: false,
  });
}
