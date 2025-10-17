import { useQuery } from '@tanstack/react-query';
import { servicesApi, categoriesApi } from '../api/services';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useService = (id: number) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => servicesApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useServicesByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ['services', 'category', categoryId],
    queryFn: () => servicesApi.getByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};
