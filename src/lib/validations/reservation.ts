import { z } from 'zod';

export const reservationSchema = z.object({
  garageId: z.number().positive('Please select a garage'),
  serviceId: z.number().positive('Please select a service'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  clientNotes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const provideQuoteSchema = z.object({
  price: z.number().positive('Price must be greater than 0'),
  garageNotes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const cancelReservationSchema = z.object({
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)').max(500),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;
export type ProvideQuoteFormData = z.infer<typeof provideQuoteSchema>;
export type CancelReservationFormData = z.infer<typeof cancelReservationSchema>;
