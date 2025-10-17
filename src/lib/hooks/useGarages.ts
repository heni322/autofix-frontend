import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { garagesApi, GarageFilters, GarageServicesFilters, CreateGarageData, UpdateGarageData } from '../api/garages';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useGarages = (filters?: GarageFilters) => {
  return useQuery({
    queryKey: ['garages', filters],
    queryFn: () => garagesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGarage = (id: number) => {
  return useQuery({
    queryKey: ['garages', id],
    queryFn: () => garagesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get services available at a specific garage
export const useGarageServices = (garageId: number, filters?: GarageServicesFilters) => {
  return useQuery({
    queryKey: ['garages', garageId, 'services', filters],
    queryFn: () => garagesApi.getGarageServices(garageId, filters),
    enabled: !!garageId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get current user's garages
export const useMyGarages = () => {
  return useQuery({
    queryKey: ['garages', 'my-garages'],
    queryFn: () => garagesApi.getMyGarages(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGaragesByCity = (city: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['garages', 'city', city, page, limit],
    queryFn: () => garagesApi.searchByCity(city, page, limit),
    enabled: !!city && city.length > 2,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation to create garage
export const useCreateGarage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateGarageData) => garagesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garages'] });
      toast.success('Garage créé avec succès! Il sera vérifié avant d\'être publié.');
      router.push('/my-garages');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la création du garage');
    },
  });
};

// Mutation to update garage
export const useUpdateGarage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGarageData }) =>
      garagesApi.update(id, data),
    onSuccess: (garage) => {
      queryClient.invalidateQueries({ queryKey: ['garages'] });
      queryClient.setQueryData(['garages', garage.id], garage);
      toast.success('Garage mis à jour avec succès!');
      router.push('/my-garages');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du garage');
    },
  });
};
