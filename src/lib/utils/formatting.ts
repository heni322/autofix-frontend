import { ReservationStatus, PricingType } from '../types';

/**
 * Format currency value
 */
export const formatCurrency = (amount: number, currency: string = 'TND'): string => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format duration in minutes to human readable format
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Get pricing type label in French
 */
export const getPricingTypeLabel = (pricingType: PricingType): string => {
  const labels: Record<PricingType, string> = {
    [PricingType.FIXED]: 'Prix Fixe',
    [PricingType.QUOTE]: 'Sur Devis',
    [PricingType.CONSULTATION]: 'Consultation',
  };
  return labels[pricingType] || pricingType;
};

/**
 * Get status badge color based on reservation status
 */
export const getStatusColor = (status: ReservationStatus): string => {
  const colors: Record<ReservationStatus, string> = {
    [ReservationStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [ReservationStatus.PENDING_QUOTE]: 'bg-orange-100 text-orange-800 border-orange-200',
    [ReservationStatus.QUOTE_PROVIDED]: 'bg-purple-100 text-purple-800 border-purple-200',
    [ReservationStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-200',
    [ReservationStatus.PENDING_CONSULTATION]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    [ReservationStatus.IN_PROGRESS]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    [ReservationStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
    [ReservationStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
    [ReservationStatus.NO_SHOW]: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get human-readable status label
 */
export const getStatusLabel = (status: ReservationStatus): string => {
  const labels: Record<ReservationStatus, string> = {
    [ReservationStatus.PENDING]: 'Pending',
    [ReservationStatus.PENDING_QUOTE]: 'Awaiting Quote',
    [ReservationStatus.QUOTE_PROVIDED]: 'Quote Provided',
    [ReservationStatus.CONFIRMED]: 'Confirmed',
    [ReservationStatus.PENDING_CONSULTATION]: 'Pending Consultation',
    [ReservationStatus.IN_PROGRESS]: 'In Progress',
    [ReservationStatus.COMPLETED]: 'Completed',
    [ReservationStatus.CANCELLED]: 'Cancelled',
    [ReservationStatus.NO_SHOW]: 'No Show',
  };

  return labels[status] || status;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Tunisian phone number (e.g., +216 12 345 678)
  if (cleaned.startsWith('216')) {
    const countryCode = cleaned.slice(0, 3);
    const rest = cleaned.slice(3);
    return `+${countryCode} ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
  }
  
  // Format local number
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};