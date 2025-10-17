'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/lib/types';
import { formatDateTime } from '@/lib/utils/date';
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils/formatting';
import { MapPin, Clock, Wrench, User } from 'lucide-react';

interface ReservationCardProps {
  reservation: Reservation;
  onClick?: () => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onClick }) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {reservation.service?.name || 'Service'}
            </CardTitle>
            <CardDescription className="mt-1">
              {reservation.garage?.name || 'Garage'}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(reservation.status)}>
            {getStatusLabel(reservation.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{formatDateTime(reservation.timeSlot)}</span>
        </div>
        
        {reservation.garage && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{reservation.garage.city}</span>
          </div>
        )}
        
        {reservation.price && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Wrench className="h-4 w-4" />
            <span className="font-semibold">{formatCurrency(reservation.price)}</span>
          </div>
        )}
        
        {reservation.user && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>
              {reservation.user.firstName} {reservation.user.lastName}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
