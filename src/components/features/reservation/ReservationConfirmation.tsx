'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReservationStore } from '@/lib/store/reservationStore';
import { useGarage } from '@/lib/hooks/useGarages';
import { useService } from '@/lib/hooks/useServices';
import { useCreateReservation } from '@/lib/hooks/useReservations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Wrench, Clock, Calendar } from 'lucide-react';
import { reservationSchema, ReservationFormData } from '@/lib/validations/reservation';
import { formatDateTime } from '@/lib/utils/date';

export const ReservationConfirmation: React.FC = () => {
  const {
    selectedGarageId,
    selectedServiceId,
    selectedTimeSlot,
    formData,
    previousStep,
    reset,
  } = useReservationStore();

  const { data: garage } = useGarage(selectedGarageId!);
  const { data: service } = useService(selectedServiceId!);
  const createReservation = useCreateReservation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      garageId: selectedGarageId!,
      serviceId: selectedServiceId!,
      timeSlot: selectedTimeSlot!,
      clientNotes: formData.clientNotes || '',
    },
  });

  const onSubmit = async (data: ReservationFormData) => {
    await createReservation.mutateAsync(data);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={previousStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Confirm Your Reservation</h2>
        <p className="text-gray-600">Review your booking details before confirming</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold">{garage?.name}</p>
              <p className="text-sm text-gray-600">
                {garage?.address}, {garage?.city}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Wrench className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold">{service?.name}</p>
              <p className="text-sm text-gray-600">{service?.description}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold">
                {selectedTimeSlot && formatDateTime(selectedTimeSlot)}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {service?.durationMinutes} minutes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Additional Notes (Optional)
          </label>
          <Textarea
            {...register('clientNotes')}
            placeholder="Any special requirements or notes for the garage..."
            rows={4}
            error={errors.clientNotes?.message}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createReservation.isPending}
            className="flex-1"
          >
            {createReservation.isPending ? 'Creating...' : 'Confirm Reservation'}
          </Button>
        </div>
      </form>
    </div>
  );
};
