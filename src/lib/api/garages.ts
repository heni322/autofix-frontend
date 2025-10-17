import apiClient from './client';
import { Garage, GarageService } from '../types';

export interface CreateGarageData {
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email?: string;
  website?: string;
  images?: string[];
  openingHours?: Record<string, { open: string; close: string }>;
}

export interface UpdateGarageData {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  images?: string[];
  openingHours?: Record<string, { open: string; close: string }>;
}

export interface GarageFilters {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  isActive?: boolean;
  isVerified?: boolean;
  categoryId?: number;
  serviceId?: number;
}

export interface GarageServicesFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  isAvailable?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GarageServicesResponse extends PaginatedResponse<GarageService> {
  meta: PaginatedResponse<GarageService>['meta'] & {
    garageId: number;
    garageName: string;
  };
}

export const garagesApi = {
  getAll: async (filters?: GarageFilters): Promise<PaginatedResponse<Garage>> => {
    const response = await apiClient.get('/garages', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<Garage> => {
    const response = await apiClient.get(`/garages/${id}`);
    return response.data;
  },

  // Get services available at a specific garage
  getGarageServices: async (
    garageId: number,
    filters?: GarageServicesFilters
  ): Promise<GarageServicesResponse> => {
    const response = await apiClient.get(`/garages/${garageId}/services`, { 
      params: filters 
    });
    return response.data;
  },

  // Get garages owned by the current user
  getMyGarages: async (): Promise<Garage[]> => {
    const response = await apiClient.get('/garages/my-garages');
    return response.data;
  },

  create: async (data: CreateGarageData): Promise<Garage> => {
    const response = await apiClient.post('/garages', data);
    return response.data;
  },

  // Update garage
  update: async (id: number, data: UpdateGarageData): Promise<Garage> => {
    const response = await apiClient.put(`/garages/${id}`, data);
    return response.data;
  },

  searchByCity: async (city: string, page = 1, limit = 10): Promise<PaginatedResponse<Garage>> => {
    const response = await apiClient.get('/garages', { 
      params: { city, page, limit } 
    });
    return response.data;
  },

  searchByFilters: async (filters: GarageFilters): Promise<PaginatedResponse<Garage>> => {
    const response = await apiClient.get('/garages', { params: filters });
    return response.data;
  },
};
