'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Wrench, MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/lib/types';

export default function HomePage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const isGarageOwner = isAuthenticated && user?.role === UserRole.GARAGE_OWNER;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="h-12 bg-blue-700 rounded w-3/4 mx-auto mb-6 animate-pulse" />
            <div className="h-6 bg-blue-700 rounded w-2/3 mx-auto mb-8 animate-pulse" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {isGarageOwner ? 'Gérez Votre Garage' : t('home.heroTitle')}
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            {isGarageOwner 
              ? 'Accédez à votre tableau de bord pour gérer vos réservations et services'
              : t('home.heroDescription')
            }
          </p>
          <div className="flex gap-4 justify-center">
            {isGarageOwner ? (
              <>
                <Link href="/dashboard/garage">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Mon Dashboard
                  </Button>
                </Link>
                <Link href="/my-garages">
                  <Button 
                    size="lg" 
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all"
                  >
                    Mes Garages
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/reservation/new">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    {t('home.bookNow')}
                  </Button>
                </Link>
                <Link href="/garages">
                  <Button size="lg" className="bg-white text-blue-600 border-white hover:bg-blue-50">
                    {t('home.browseGarages')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {!isGarageOwner && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t('home.whyChooseUs')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <Calendar className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>{t('home.easyBooking')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('home.easyBookingDesc')}</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>{t('home.findLocalGarages')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('home.findLocalGaragesDesc')}</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>{t('home.realTimeAvailability')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('home.realTimeAvailabilityDesc')}</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Wrench className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>{t('home.qualityServices')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t('home.qualityServicesDesc')}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {isGarageOwner && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités Garagiste</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Calendar className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Gestion des Réservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Gérez facilement toutes vos réservations en un seul endroit
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Wrench className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Services & Prix</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Définissez vos services et tarifs selon votre expertise
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Visibilité en Ligne</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Attirez plus de clients grâce à votre présence en ligne
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {!isAuthenticated && (
        <section className="bg-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{t('home.readyToStart')}</h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('home.readyToStartDesc')}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg">{t('auth.createAccount')}</Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline">{t('auth.signIn')}</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
