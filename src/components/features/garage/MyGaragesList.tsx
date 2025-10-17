'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useMyGarages } from '@/lib/hooks/useGarages';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import Link from 'next/link';

export default function MyGaragesList() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: garages, isLoading } = useMyGarages();

  // Redirect if not garage owner
  if (!isAuthenticated || user?.role !== UserRole.GARAGE_OWNER) {
    router.push('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos garages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Garages</h1>
            <p className="text-gray-600">
              Gérez les informations de vos garages
            </p>
          </div>
          <Link href="/my-garages/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un Garage
            </Button>
          </Link>
        </div>

        {/* Garages List */}
        {garages && garages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {garages.map((garage) => (
              <Card key={garage.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        {garage.name}
                      </CardTitle>
                      <CardDescription>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {garage.address}, {garage.city}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      {garage.isActive ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="error" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactif
                        </Badge>
                      )}
                      {garage.isVerified ? (
                        <Badge variant="info" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Vérifié
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          En attente
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Information */}
                  <div className="space-y-2 text-sm">
                    {garage.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{garage.phone}</span>
                      </div>
                    )}
                    {garage.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{garage.email}</span>
                      </div>
                    )}
                    {garage.website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={garage.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {garage.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {garage.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {garage.description}
                    </p>
                  )}

                  {/* Services Count */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wrench className="h-4 w-4" />
                      <span>{garage.garageServices?.length || 0} service(s)</span>
                    </div>
                    <Link href={`/my-garages/${garage.id}/services`}>
                      <Button variant="ghost" size="sm">
                        Gérer Services
                      </Button>
                    </Link>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Link href={`/my-garages/${garage.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </Link>
                    <Link href={`/garages/${garage.id}`}>
                      <Button variant="ghost">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun garage enregistré</h3>
                <p className="text-gray-600 mb-6">
                  Commencez par ajouter les informations de votre premier garage
                </p>
                <Link href="/my-garages/new">
                  <Button size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter mon Premier Garage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card for unverified garages */}
        {garages && garages.some(g => !g.isVerified) && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="py-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">
                    Garage en attente de vérification
                  </p>
                  <p className="text-blue-800">
                    Votre garage sera vérifié par notre équipe avant d'être visible publiquement. 
                    Ce processus peut prendre 24-48 heures. Vous serez notifié par email une fois la vérification terminée.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
