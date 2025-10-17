'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useReservations, useConfirmReservation, useProvideQuote } from '@/lib/hooks/useReservations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  User,
  TrendingUp,
  CheckCircle,
  XCircle,
  DollarSign,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserRole, ReservationStatus, Reservation } from '@/lib/types';
import { formatDateTime } from '@/lib/utils/date';
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils/formatting';

export default function GarageDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Fetch reservations for garage owner
  const { data: reservations, isLoading } = useReservations({
    // TODO: Filter by garage owner's garages
  });

  // Redirect if not garage owner
  if (!isAuthenticated || user?.role !== UserRole.GARAGE_OWNER) {
    router.push('/');
    return null;
  }

  const pendingReservations = reservations?.filter(
    (r) => r.status === ReservationStatus.PENDING || r.status === ReservationStatus.PENDING_QUOTE
  );
  const activeReservations = reservations?.filter(
    (r) => r.status === ReservationStatus.CONFIRMED || r.status === ReservationStatus.IN_PROGRESS
  );
  const completedToday = reservations?.filter(
    (r) => r.status === ReservationStatus.COMPLETED
  ).length || 0;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Garage Dashboard</h1>
          <p className="text-gray-600">Manage your reservations and services</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReservations?.length || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting action
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeReservations?.length || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                In progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completed Today
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedToday}</div>
              <p className="text-xs text-gray-500 mt-1">
                Services finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(0)}</div>
              <p className="text-xs text-gray-500 mt-1">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions */}
        {pendingReservations && pendingReservations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>Reservations requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingReservations.map((reservation) => (
                  <PendingReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>All Reservations</CardTitle>
            <CardDescription>Complete list of your bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading reservations...</div>
            ) : reservations && reservations.length > 0 ? (
              <div className="space-y-3">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/reservations/${reservation.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{reservation.service?.name}</h4>
                          <Badge className={getStatusColor(reservation.status)}>
                            {getStatusLabel(reservation.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {reservation.user?.firstName} {reservation.user?.lastName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDateTime(reservation.timeSlot)}
                          </div>
                          {reservation.price && (
                            <div className="flex items-center gap-1 font-semibold text-green-600">
                              <DollarSign className="h-4 w-4" />
                              {formatCurrency(reservation.price)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reservations yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface PendingReservationCardProps {
  reservation: Reservation;
}

const PendingReservationCard: React.FC<PendingReservationCardProps> = ({ reservation }) => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  const confirmReservation = useConfirmReservation();
  const provideQuote = useProvideQuote();

  const handleConfirm = async () => {
    await confirmReservation.mutateAsync(reservation.id);
  };

  const handleProvideQuote = async () => {
    await provideQuote.mutateAsync({
      id: reservation.id,
      data: {
        price: parseFloat(quotePrice),
        garageNotes: quoteNotes,
      },
    });
    setShowQuoteForm(false);
    setQuotePrice('');
    setQuoteNotes('');
  };

  return (
    <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-lg mb-1">{reservation.service?.name}</h4>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {reservation.user?.firstName} {reservation.user?.lastName}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDateTime(reservation.timeSlot)}
            </div>
          </div>
        </div>
        <Badge variant="warning">Action Required</Badge>
      </div>

      {reservation.clientNotes && (
        <div className="mb-3 p-3 bg-white rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-1">Client Notes:</p>
          <p className="text-sm">{reservation.clientNotes}</p>
        </div>
      )}

      {!showQuoteForm ? (
        <div className="flex gap-2">
          {reservation.status === ReservationStatus.PENDING && (
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={confirmReservation.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Reservation
            </Button>
          )}
          {reservation.status === ReservationStatus.PENDING_QUOTE && (
            <Button
              size="sm"
              onClick={() => setShowQuoteForm(true)}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Provide Quote
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3 mt-3 p-3 bg-white rounded border border-gray-200">
          <div>
            <label className="block text-sm font-medium mb-1">Quote Price</label>
            <Input
              type="number"
              placeholder="0.00"
              value={quotePrice}
              onChange={(e) => setQuotePrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <Textarea
              placeholder="Additional notes for the client..."
              value={quoteNotes}
              onChange={(e) => setQuoteNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleProvideQuote}
              disabled={!quotePrice || provideQuote.isPending}
            >
              Submit Quote
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowQuoteForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
