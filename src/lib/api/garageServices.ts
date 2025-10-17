import apiClient from './client';
import { GarageService, PricingType } from '../types';

export interface CreateGarageServiceData {
  garageId: number;
  serviceId: number;
  capacity: number;
  price?: number;
  pricingType: PricingType;
  isAvailable?: boolean;
  notes?: string;
}

export interface UpdateGarageServiceData {
  capacity?: number;
  price?: number;
  pricingType?: PricingType;
  isAvailable?: boolean;
  notes?: string;
}

export const garageServicesApi = {
  // Get all services for a garage
  getByGarage: async (garageId: number): Promise<GarageService[]> => {
    const response = await apiClient.get(`/garage-services/garage/${garageId}`);
    return response.data;
  },

  // Get available services for a garage
  getAvailableByGarage: async (garageId: number): Promise<GarageService[]> => {
    const response = await apiClient.get(`/garage-services/garage/${garageId}/available`);
    return response.data;
  },

  // Get single garage service
  getById: async (id: number): Promise<GarageService> => {
    const response = await apiClient.get(`/garage-services/${id}`);
    return response.data;
  },

  // Add service to garage
  create: async (data: CreateGarageServiceData): Promise<GarageService> => {
    const response = await apiClient.post('/garage-services', data);
    return response.data;
  },

  // Update garage service
  update: async (id: number, data: UpdateGarageServiceData): Promise<GarageService> => {
    const response = await apiClient.put(`/garage-services/${id}`, data);
    return response.data;
  },

  // Toggle availability
  toggleAvailability: async (id: number): Promise<GarageService> => {
    const response = await apiClient.patch(`/garage-services/${id}/toggle-availability`);
    return response.data;
  },

  // Remove service from garage
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/garage-services/${id}`);
  },
};
