'use client';

import React from 'react';
import { useReservationStore } from '@/lib/store/reservationStore';
import { GarageSelector } from './GarageSelector';
import { ServiceSelector } from './ServiceSelector';
import { TimeSlotSelector } from './TimeSlotSelector';
import { ReservationConfirmation } from './ReservationConfirmation';

export const ReservationWizard: React.FC = () => {
  const { currentStep } = useReservationStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { step: 1, label: 'Garage' },
            { step: 2, label: 'Service' },
            { step: 3, label: 'Date & Time' },
            { step: 4, label: 'Confirm' },
          ].map((item, index) => (
            <div key={item.step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= item.step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {item.step}
                </div>
                <span className="text-sm mt-2 font-medium">{item.label}</span>
              </div>
              {index < 3 && (
                <div
                  className={`h-1 flex-1 -mt-6 transition-colors ${
                    currentStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {currentStep === 1 && <GarageSelector />}
        {currentStep === 2 && <ServiceSelector />}
        {currentStep === 3 && <TimeSlotSelector />}
        {currentStep === 4 && <ReservationConfirmation />}
      </div>
    </div>
  );
};
