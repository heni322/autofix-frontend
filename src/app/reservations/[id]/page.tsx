'use client';

import { useParams, useRouter } from 'next/navigation';
import { useReservation, useAcceptQuote, useCancelReservation } from '@/lib/hooks/useReservations';
import { useAuthStore } from '@/lib/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Wrench, Calendar, DollarSign, User } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/date';
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils/formatting';
import { ReservationStatus, UserRole } from '@/lib/types';
import { useState } from 'react';

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const reservationId = Number(params.id);

  const { data: reservation, isLoading } = useReservation(reservationId);
  const acceptQuote = useAcceptQuote();
  const cancelReservation = useCancelReservation();
  
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleAcceptQuote = async () => {
    await acceptQuote.mutateAsync(reservationId);
  };

  const handleCancel = async () => {
    await cancelReservation.mutateAsync({ id: reservationId, reason: cancelReason });
    setShowCancelDialog(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading reservation details...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Reservation Not Found</h2>
            <Button onClick={() => router.push('/reservations')}>
              Back to Reservations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canAcceptQuote =
    reservation.status === ReservationStatus.QUOTE_PROVIDED &&
    user?.id === reservation.userId;

  const canCancel =
    ![ReservationStatus.COMPLETED, ReservationStatus.CANCELLED].includes(reservation.status) &&
    (user?.id === reservation.userId || user?.role === UserRole.GARAGE_OWNER);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">Reservation #{reservation.id}</CardTitle>
                  <CardDescription className="mt-2">
                    {formatDateTime(reservation.createdAt)}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(reservation.status)}>
                  {getStatusLabel(reservation.status)}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-semibold">{reservation.service?.name}</p>
                  <p className="text-sm text-gray-600">{reservation.service?.description}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-semibold">{reservation.garage?.name}</p>
                  <p className="text-sm text-gray-600">
                    {reservation.garage?.address}, {reservation.garage?.city}
                  </p>
                  <p className="text-sm text-gray-600">{reservation.garage?.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-semibold">{formatDateTime(reservation.timeSlot)}</p>
                  <p className="text-sm text-gray-600">
                    Duration: {reservation.service?.durationMinutes} minutes
                  </p>
                </div>
              </div>

              {reservation.price && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-lg text-blue-600">
                      {formatCurrency(reservation.price)}
                    </p>
                  </div>
                </div>
              )}

              {reservation.user && user?.role !== UserRole.CLIENT && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      {reservation.user.firstName} {reservation.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{reservation.user.email}</p>
                    {reservation.user.phone && (
                      <p className="text-sm text-gray-600">{reservation.user.phone}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {(reservation.clientNotes || reservation.garageNotes) && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reservation.clientNotes && (
                  <div>
                    <p className="font-semibold text-sm text-gray-600 mb-1">Client Notes:</p>
                    <p className="text-sm">{reservation.clientNotes}</p>
                  </div>
                )}
                {reservation.garageNotes && (
                  <div>
                    <p className="font-semibold text-sm text-gray-600 mb-1">Garage Notes:</p>
                    <p className="text-sm">{reservation.garageNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="py-6">
              <div className="flex gap-3">
                {canAcceptQuote && (
                  <Button
                    onClick={handleAcceptQuote}
                    disabled={acceptQuote.isPending}
                    className="flex-1"
                  >
                    {acceptQuote.isPending ? 'Accepting...' : 'Accept Quote'}
                  </Button>
                )}
                
                {canCancel && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowCancelDialog(true)}
                    className="flex-1"
                  >
                    Cancel Reservation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cancel Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Cancel Reservation</CardTitle>
                <CardDescription>
                  Please provide a reason for cancellation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  className="w-full border rounded-lg p-3 min-h-[100px]"
                  placeholder="Reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={!cancelReason || cancelReservation.isPending}
                    className="flex-1"
                  >
                    {cancelReservation.isPending ? 'Cancelling...' : 'Confirm Cancel'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
