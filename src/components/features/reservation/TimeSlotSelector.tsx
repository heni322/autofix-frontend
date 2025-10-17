'use client';

import React, { useState } from 'react';
import { useReservationStore } from '@/lib/store/reservationStore';
import { useAvailableSlots } from '@/lib/hooks/useReservations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';
import { formatTimeSlot } from '@/lib/utils/date';

export const TimeSlotSelector: React.FC = () => {
  const { selectedGarageId, selectedServiceId, setTimeSlot, nextStep, previousStep } =
    useReservationStore();

  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

  const { data: slots, isLoading } = useAvailableSlots(
    selectedGarageId!,
    selectedServiceId!,
    selectedDate.toISOString().split('T')[0],
    !!selectedGarageId && !!selectedServiceId
  );

  const handleSelectSlot = (slot: string) => {
    setTimeSlot(slot);
    nextStep();
  };

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={previousStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose when you want to book your service</p>
      </div>

      {/* Date Selector */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Date
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {availableDates.map((date) => {
            const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            return (
              <Button
                key={date.toISOString()}
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => setSelectedDate(date)}
                className="flex flex-col h-auto py-3"
              >
                <span className="text-xs">{format(date, 'EEE')}</span>
                <span className="text-lg font-bold">{format(date, 'd')}</span>
                <span className="text-xs">{format(date, 'MMM')}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Available Time Slots
        </h3>

        {isLoading ? (
          <div className="text-center py-8">Loading available slots...</div>
        ) : slots && slots.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {slots.map((slot) => (
              <Button
                key={slot.timeSlot}
                variant={slot.available ? 'outline' : 'ghost'}
                disabled={!slot.available}
                onClick={() => handleSelectSlot(slot.timeSlot)}
                className="relative"
              >
                {formatTimeSlot(slot.timeSlot)}
                {slot.available && slot.remainingSlots <= 2 && (
                  <Badge
                    variant="warning"
                    className="absolute -top-2 -right-2 text-xs px-1 py-0"
                  >
                    {slot.remainingSlots}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No available slots for this date. Please select another date.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
