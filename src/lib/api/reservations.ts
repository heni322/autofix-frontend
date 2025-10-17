import apiClient from './client';
import { Reservation, ReservationStatus, AvailabilityCheck, TimeSlot } from '../types';

export interface CreateReservationData {
  garageId: number;
  serviceId: number;
  timeSlot: string;
  clientNotes?: string;
}

export interface CheckAvailabilityData {
  garageId: number;
  serviceId: number;
  timeSlot: string;
}

export interface ProvideQuoteData {
  price: number;
  garageNotes?: string;
}

export interface ReservationFilters {
  userId?: number;
  garageId?: number;
  status?: ReservationStatus;
}

export const reservationsApi = {
  // Check availability for a specific time slot
  checkAvailability: async (data: CheckAvailabilityData): Promise<AvailabilityCheck> => {
    const response = await apiClient.post('/reservations/check-availability', data);
    return response.data;
  },

  // Get all available slots for a specific day
  getAvailableSlots: async (
    garageId: number,
    serviceId: number,
    date: string
  ): Promise<TimeSlot[]> => {
    const response = await apiClient.get('/reservations/available-slots', {
      params: { garageId, serviceId, date },
    });
    return response.data;
  },

  // Create a new reservation
  create: async (data: CreateReservationData): Promise<Reservation> => {
    const response = await apiClient.post('/reservations', data);
    return response.data;
  },

  // Get all reservations with filters
  getAll: async (filters?: ReservationFilters): Promise<Reservation[]> => {
    const response = await apiClient.get('/reservations', { params: filters });
    return response.data;
  },

  // Get reservation by ID
  getById: async (id: number): Promise<Reservation> => {
    const response = await apiClient.get(`/reservations/${id}`);
    return response.data;
  },

  // Confirm a reservation (garage owner)
  confirm: async (id: number): Promise<Reservation> => {
    const response = await apiClient.patch(`/reservations/${id}/confirm`);
    return response.data;
  },

  // Provide quote for a reservation (garage owner)
  provideQuote: async (id: number, data: ProvideQuoteData): Promise<Reservation> => {
    const response = await apiClient.patch(`/reservations/${id}/provide-quote`, data);
    return response.data;
  },

  // Accept a provided quote (client)
  acceptQuote: async (id: number): Promise<Reservation> => {
    const response = await apiClient.patch(`/reservations/${id}/accept-quote`);
    return response.data;
  },

  // Start service (garage owner)
  startService: async (id: number): Promise<Reservation> => {
    const response = await apiClient.patch(`/reservations/${id}/start`);
    return response.data;
  },

  // Complete a reservation (garage owner)
  complete: async (id: number): Promise<Reservation> => {
    const response = await apiClient.patch(`/reservations/${id}/complete`);
    return response.data;
  },

  // Cancel a reservation
  cancel: async (id: number, reason?: string): Promise<Reservation> => {
    const response = await apiClient.patch(`/reservations/${id}/cancel`, { reason });
    return response.data;
  },
};
