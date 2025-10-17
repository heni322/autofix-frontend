// Base entity type matching backend BaseEntity
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// User types
export enum UserRole {
  CLIENT = 'CLIENT',
  GARAGE_OWNER = 'GARAGE_OWNER',
  ADMIN = 'ADMIN',
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
}

// Garage types
export interface Garage extends BaseEntity {
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  email: string | null;
  website: string | null;
  images: string[];
  openingHours: Record<string, { open: string; close: string }> | null;
  isActive: boolean;
  isVerified: boolean;
  ownerId: number;
  owner?: User;
  garageServices?: GarageService[];
  reviews?: any[]; // Add this for reviews relation
}

// Service types
export interface Category extends BaseEntity {
  name: string;
  description: string | null;
  sortOrder?: number;
  services?: Service[]; // Add this for services relation
}

export interface Service extends BaseEntity {
  name: string;
  description: string | null;
  durationMinutes: number;
  categoryId: number;
  category?: Category;
}

// Pricing types
export enum PricingType {
  FIXED = 'FIXED',
  QUOTE = 'QUOTE',
  CONSULTATION = 'CONSULTATION',
}

export interface GarageService extends BaseEntity {
  garageId: number;
  serviceId: number;
  isAvailable: boolean;
  pricingType: PricingType;
  price: number | null;
  capacity: number;
  notes?: string | null;
  garage?: Garage;
  service?: Service;
}

// Reservation types
export enum ReservationStatus {
  PENDING = 'PENDING',
  PENDING_QUOTE = 'PENDING_QUOTE',
  QUOTE_PROVIDED = 'QUOTE_PROVIDED',
  CONFIRMED = 'CONFIRMED',
  PENDING_CONSULTATION = 'PENDING_CONSULTATION',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface Reservation extends BaseEntity {
  userId: number;
  garageId: number;
  serviceId: number;
  timeSlot: string;
  endTime: string;
  status: ReservationStatus;
  price: number | null;
  clientNotes: string | null;
  garageNotes: string | null;
  cancellationReason: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  user?: User;
  garage?: Garage;
  service?: Service;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Availability types
export interface AvailabilityCheck {
  available: boolean;
  capacity: number;
  booked: number;
  remainingSlots: number;
  pricingType: PricingType;
  price?: number;
}

export interface TimeSlot {
  timeSlot: string;
  available: boolean;
  remainingSlots: number;
}
