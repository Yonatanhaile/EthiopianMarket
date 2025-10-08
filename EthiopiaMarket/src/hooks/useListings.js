import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/mockApi';

export function useListings(filters = {}) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => api.getListings(filters),
  });
}

export function useListing(id) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.getListingById(id),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => api.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => api.updateListing(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => api.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
    },
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => api.getUserById(id),
    enabled: !!id,
  });
}

export function useUserListings(userId) {
  return useQuery({
    queryKey: ['userListings', userId],
    queryFn: () => api.getUserListings(userId),
    enabled: !!userId,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => api.getAdminStats(),
  });
}

export function usePendingListings() {
  return useQuery({
    queryKey: ['pendingListings'],
    queryFn: () => api.getPendingListings(),
  });
}

export function useApproveListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => api.approveListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingListings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useRejectListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }) => api.rejectListing(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingListings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

