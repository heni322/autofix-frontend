import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  reservationsApi, 
  CreateReservationData, 
  CheckAvailabilityData,
  ProvideQuoteData,
  ReservationFilters
} from '../api/reservations';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Query: Get all reservations
export const useReservations = (filters?: ReservationFilters) => {
  return useQuery({
    queryKey: ['reservations', filters],
    queryFn: () => reservationsApi.getAll(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Query: Get single reservation
export const useReservation = (id: number) => {
  return useQuery({
    queryKey: ['reservations', id],
    queryFn: () => reservationsApi.getById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

// Query: Check availability
export const useCheckAvailability = (data: CheckAvailabilityData, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['availability', data],
    queryFn: () => reservationsApi.checkAvailability(data),
    enabled: enabled && !!data.garageId && !!data.serviceId && !!data.timeSlot,
    staleTime: 10 * 1000, // 10 seconds
  });
};

// Query: Get available slots
export const useAvailableSlots = (
  garageId: number,
  serviceId: number,
  date: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['available-slots', garageId, serviceId, date],
    queryFn: () => reservationsApi.getAvailableSlots(garageId, serviceId, date),
    enabled: enabled && !!garageId && !!serviceId && !!date,
    staleTime: 30 * 1000,
  });
};

// Mutation: Create reservation
export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateReservationData) => reservationsApi.create(data),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
      toast.success('Reservation created successfully!');
      router.push(`/reservations/${reservation.id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create reservation');
    },
  });
};

// Mutation: Confirm reservation (garage owner)
export const useConfirmReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reservationsApi.confirm(id),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.setQueryData(['reservations', reservation.id], reservation);
      toast.success('Reservation confirmed!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to confirm reservation');
    },
  });
};

// Mutation: Provide quote (garage owner)
export const useProvideQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProvideQuoteData }) =>
      reservationsApi.provideQuote(id, data),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.setQueryData(['reservations', reservation.id], reservation);
      toast.success('Quote provided successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to provide quote');
    },
  });
};

// Mutation: Accept quote (client)
export const useAcceptQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reservationsApi.acceptQuote(id),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.setQueryData(['reservations', reservation.id], reservation);
      toast.success('Quote accepted! Your reservation is confirmed.');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to accept quote');
    },
  });
};

// Mutation: Start service (garage owner)
export const useStartService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reservationsApi.startService(id),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.setQueryData(['reservations', reservation.id], reservation);
      toast.success('Service started!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to start service');
    },
  });
};

// Mutation: Complete reservation (garage owner)
export const useCompleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reservationsApi.complete(id),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.setQueryData(['reservations', reservation.id], reservation);
      toast.success('Reservation completed!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to complete reservation');
    },
  });
};

// Mutation: Cancel reservation
export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      reservationsApi.cancel(id, reason),
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.setQueryData(['reservations', reservation.id], reservation);
      toast.success('Reservation cancelled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel reservation');
    },
  });
};
