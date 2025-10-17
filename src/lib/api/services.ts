import apiClient from './client';
import { Service, Category } from '../types';

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await apiClient.get('/services');
    return response.data;
  },

  getById: async (id: number): Promise<Service> => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<Service[]> => {
    const response = await apiClient.get('/services', { params: { categoryId } });
    return response.data;
  },
};

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },
};
