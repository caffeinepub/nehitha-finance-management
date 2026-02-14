import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Customer } from '../backend';

// Admin permission check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin permission:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
}

// Customer queries
export function useGetAllCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAddCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: { name: string; mobile: string; aadhar: string; pan: string; referral: string; address: string; remarks: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCustomer(
        customer.name,
        customer.mobile,
        customer.aadhar,
        customer.pan,
        customer.referral,
        customer.address,
        customer.remarks
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: any) => {
      console.error('Add customer error:', error);
      // Normalize error message for UI
      const message = error?.message || String(error);
      if (message.includes('Unauthorized') || message.includes('Only admins')) {
        throw new Error('You are not authorized to add customers. Please ensure you are signed in with an admin Internet Identity account.');
      }
      throw new Error('Failed to add customer. Please try again.');
    }
  });
}
