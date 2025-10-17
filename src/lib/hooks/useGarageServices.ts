import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { garageServicesApi, CreateGarageServiceData, UpdateGarageServiceData } from '../api/garageServices';
import { toast } from 'sonner';

// Get services for a garage
export const useGarageServices = (garageId: number) => {
  return useQuery({
    queryKey: ['garage-services', garageId],
    queryFn: () => garageServicesApi.getByGarage(garageId),
    enabled: !!garageId,
    staleTime: 2 * 60 * 1000,
  });
};

// Get available services for a garage
export const useAvailableGarageServices = (garageId: number) => {
  return useQuery({
    queryKey: ['garage-services', garageId, 'available'],
    queryFn: () => garageServicesApi.getAvailableByGarage(garageId),
    enabled: !!garageId,
    staleTime: 2 * 60 * 1000,
  });
};

// Create garage service
export const useCreateGarageService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGarageServiceData) => garageServicesApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['garage-services', variables.garageId] });
      queryClient.invalidateQueries({ queryKey: ['garages'] });
      toast.success('Service ajouté avec succès!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de l\'ajout du service');
    },
  });
};

// Update garage service
export const useUpdateGarageService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGarageServiceData }) =>
      garageServicesApi.update(id, data),
    onSuccess: (garageService) => {
      queryClient.invalidateQueries({ queryKey: ['garage-services', garageService.garageId] });
      queryClient.invalidateQueries({ queryKey: ['garages'] });
      toast.success('Service mis à jour!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    },
  });
};

// Toggle availability
export const useToggleServiceAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => garageServicesApi.toggleAvailability(id),
    onSuccess: (garageService) => {
      queryClient.invalidateQueries({ queryKey: ['garage-services', garageService.garageId] });
      toast.success(
        garageService.isAvailable 
          ? 'Service activé!' 
          : 'Service désactivé!'
      );
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur');
    },
  });
};

// Remove garage service
export const useRemoveGarageService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => garageServicesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage-services'] });
      queryClient.invalidateQueries({ queryKey: ['garages'] });
      toast.success('Service supprimé!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erreur lors de la suppression');
    },
  });
};
