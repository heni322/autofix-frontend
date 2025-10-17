'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useReservations } from '@/lib/hooks/useReservations';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Settings,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import { ReservationStatus, UserRole } from '@/lib/types';
import { formatDateTime } from '@/lib/utils/date';

export default function DashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  
  const { data: reservations, isLoading } = useReservations(
    user ? { userId: user.id } : undefined
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isHydrated) {
      // Redirect garage owners to their dashboard
      if (isAuthenticated && user?.role === UserRole.GARAGE_OWNER) {
        router.push('/dashboard/garage');
        return;
      }
      
      // Redirect unauthenticated users to signin
      if (!isAuthenticated) {
        router.push('/auth/signin?redirect=/dashboard');
      }
    }
  }, [isClient, isHydrated, isAuthenticated, user, router]);

  if (!isClient || !isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Block garage owners
  if (user?.role === UserRole.GARAGE_OWNER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">
              Accédez à votre dashboard garagiste
            </p>
            <Link href="/dashboard/garage">
              <Button>Aller au Dashboard Garagiste</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const totalReservations = reservations?.length || 0;
  const pendingReservations =
    reservations?.filter((r) => r.status === ReservationStatus.PENDING).length || 0;
  const confirmedReservations =
    reservations?.filter((r) => r.status === ReservationStatus.CONFIRMED).length || 0;
  const completedReservations =
    reservations?.filter((r) => r.status === ReservationStatus.COMPLETED).length || 0;

  // Get upcoming reservations
  const upcomingReservations = reservations
    ?.filter(
      (r) =>
        r.status !== ReservationStatus.CANCELLED &&
        r.status !== ReservationStatus.COMPLETED &&
        new Date(r.timeSlot) >= new Date()
    )
    .sort((a, b) => new Date(a.timeSlot).getTime() - new Date(b.timeSlot).getTime())
    .slice(0, 3);

  const getStatusIcon = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4" />;
      case ReservationStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      case ReservationStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: ReservationStatus): "default" | "success" | "warning" | "error" | "info" => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return 'success';
      case ReservationStatus.CANCELLED:
        return 'error';
      case ReservationStatus.PENDING:
        return 'warning';
      case ReservationStatus.COMPLETED:
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Bienvenue, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de vos réservations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Réservations
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalReservations}</div>
              <p className="text-xs text-gray-500 mt-1">Toutes vos réservations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                En Attente
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingReservations}</div>
              <p className="text-xs text-gray-500 mt-1">En attente de confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Confirmées
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{confirmedReservations}</div>
              <p className="text-xs text-gray-500 mt-1">Prêtes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Terminées
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedReservations}</div>
              <p className="text-xs text-gray-500 mt-1">Services effectués</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Reservations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Réservations à Venir</CardTitle>
                    <CardDescription>Vos prochains services</CardDescription>
                  </div>
                  <Link href="/reservations">
                    <Button variant="outline" size="sm">
                      Voir Tout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : upcomingReservations && upcomingReservations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                        onClick={() => router.push(`/reservations/${reservation.id}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                              {reservation.service?.name}
                            </h4>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {reservation.garage?.name}
                            </p>
                          </div>
                          <Badge
                            variant={getStatusVariant(reservation.status)}
                            className="flex items-center gap-1"
                          >
                            {getStatusIcon(reservation.status)}
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(reservation.timeSlot)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">Aucune réservation à venir</p>
                    <Link href="/garages">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Réserver un Service
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Tâches communes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/garages">
                  <Button className="w-full justify-start" variant="outline">
                    <Wrench className="h-4 w-4 mr-2" />
                    Trouver un Garage
                  </Button>
                </Link>
                <Link href="/reservation/new">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Réservation
                  </Button>
                </Link>
                <Link href="/reservations">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Mes Réservations
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Mon Profil
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informations Compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rôle</p>
                  <Badge variant="default">Client</Badge>
                </div>
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Settings className="h-4 w-4 mr-2" />
                    Modifier le Profil
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
