import { create } from 'zustand';
import { CreateReservationData } from '../api/reservations';

interface ReservationFormState {
  // Multi-step form state
  currentStep: number;
  totalSteps: number;
  
  // Form data
  formData: Partial<CreateReservationData>;
  
  // Selected entities
  selectedGarageId: number | null;
  selectedServiceId: number | null;
  selectedTimeSlot: string | null;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (data: Partial<CreateReservationData>) => void;
  setGarage: (garageId: number) => void;
  setService: (serviceId: number) => void;
  setTimeSlot: (timeSlot: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  totalSteps: 4,
  formData: {},
  selectedGarageId: null,
  selectedServiceId: null,
  selectedTimeSlot: null,
};

export const useReservationStore = create<ReservationFormState>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setGarage: (garageId) =>
    set((state) => ({
      selectedGarageId: garageId,
      formData: { ...state.formData, garageId },
    })),

  setService: (serviceId) =>
    set((state) => ({
      selectedServiceId: serviceId,
      formData: { ...state.formData, serviceId },
    })),

  setTimeSlot: (timeSlot) =>
    set((state) => ({
      selectedTimeSlot: timeSlot,
      formData: { ...state.formData, timeSlot },
    })),

  reset: () => set(initialState),
}));
