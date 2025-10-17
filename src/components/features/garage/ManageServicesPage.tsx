'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useGarage } from '@/lib/hooks/useGarages';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@/lib/types';
import GarageServicesManager from './GarageServicesManager';

export default function ManageServicesPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const garageId = parseInt(params.id as string);
  
  const { data: garage, isLoading } = useGarage(garageId);

  // Redirect if not garage owner
  if (!isAuthenticated || user?.role !== UserRole.GARAGE_OWNER) {
    router.push('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!garage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Garage non trouvé</h2>
          <p className="text-gray-600 mb-6">Le garage demandé n'existe pas.</p>
          <Link href="/my-garages">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à mes garages
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/my-garages">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à mes garages
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{garage.name}</h1>
              <p className="text-gray-600">
                Gérez les services proposés par votre garage
              </p>
            </div>
          </div>
        </div>

        {/* Garage Info Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Adresse</p>
              <p className="font-medium">{garage.address}, {garage.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Téléphone</p>
              <p className="font-medium">{garage.phone}</p>
            </div>
            {garage.email && (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{garage.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Services Manager */}
        <GarageServicesManager garageId={garageId} />
      </div>
    </div>
  );
}
