'use client';

import { useEffect, useState } from 'react';
import { useReservations } from '@/lib/hooks/useReservations';
import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/lib/types';
import { ReservationCard } from '@/components/features/reservation/ReservationCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function ReservationsPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  // Get auth state
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  
  const { data: reservations, isLoading } = useReservations(
    user ? { userId: user.id } : undefined
  );

  // Wait for client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication and role after hydration
  useEffect(() => {
    if (!isClient || !isHydrated) return;
    
    // Redirect garage owners - they shouldn't access this page
    if (isAuthenticated && user?.role === UserRole.GARAGE_OWNER) {
      router.push('/dashboard/garage');
      return;
    }
    
    // Small delay to ensure store is fully hydrated
    const timeout = setTimeout(() => {
      setIsChecking(false);
      
      if (!isAuthenticated) {
        router.push('/auth/signin?redirect=/reservations');
      }
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [isClient, isHydrated, isAuthenticated, user, router]);

  // Show loading during initial hydration
  if (!isClient || !isHydrated || isChecking) {
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
  if (isAuthenticated && user?.role === UserRole.GARAGE_OWNER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">
              Cette page n'est pas accessible pour les garagistes.
            </p>
            <Link href="/dashboard/garage">
              <Button>Aller au Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Connexion Requise</h2>
            <p className="text-gray-600 mb-6">
              Veuillez vous connecter pour voir vos réservations
            </p>
            <Link href="/auth/signin?redirect=/reservations">
              <Button>Se Connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes Réservations</h1>
            <p className="text-gray-600 mt-1">Consultez et gérez vos réservations</p>
          </div>
          <Link href="/reservation/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Réservation
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reservations && reservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onClick={() => router.push(`/reservations/${reservation.id}`)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">Aucune Réservation</h3>
              <p className="text-gray-600 mb-6">
                Commencez par réserver votre premier service
              </p>
              <Link href="/reservation/new">
                <Button>Réserver Maintenant</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
