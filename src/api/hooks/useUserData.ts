import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { agriService } from '../agriService';
import type { User } from '../../types';

export function useUserProfile() {
  return useQuery<User>({
    queryKey: queryKeys.auth.user(),
    queryFn: () => agriService.getUserProfile(),
  });
}

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, User>({
    mutationFn: (updatedUser) => agriService.updateUserProfile(updatedUser),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.user(), data);
    },
  });
}
