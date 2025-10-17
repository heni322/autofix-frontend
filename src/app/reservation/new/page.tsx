'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReservationWizard } from '@/components/features/reservation/ReservationWizard';

export default function NewReservationPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Redirect garage owners - they can't book
  useEffect(() => {
    if (isAuthenticated && user?.role === UserRole.GARAGE_OWNER) {
      router.push('/dashboard/garage');
    }
  }, [isAuthenticated, user, router]);

  // Block garage owners
  if (isAuthenticated && user?.role === UserRole.GARAGE_OWNER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">
              Les garagistes ne peuvent pas créer de réservations.
            </p>
            <Link href="/dashboard/garage">
              <Button>Aller au Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ReservationWizard />;
}
