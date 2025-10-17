'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/store/authStore';
import { useCreateGarage, useUpdateGarage, useGarage } from '@/lib/hooks/useGarages';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import Link from 'next/link';

const garageSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  postalCode: z.string().min(4, 'Le code postal est requis'),
  latitude: z.string().optional().or(z.literal('')),
  longitude: z.string().optional().or(z.literal('')),
  phone: z.string().min(8, 'Le numéro de téléphone est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
});

type GarageFormData = z.infer<typeof garageSchema>;

interface GarageFormProps {
  garageId?: number;
}

export default function GarageForm({ garageId }: GarageFormProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const createGarage = useCreateGarage();
  const updateGarage = useUpdateGarage();
  const { data: garage, isLoading } = useGarage(garageId || 0);

  const isEditMode = !!garageId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GarageFormData>({
    resolver: zodResolver(garageSchema),
  });

  // Load garage data for editing
  useEffect(() => {
    if (garage && isEditMode) {
      reset({
        name: garage.name,
        description: garage.description,
        address: garage.address,
        city: garage.city,
        postalCode: garage.postalCode,
        latitude: garage.latitude?.toString() || '',
        longitude: garage.longitude?.toString() || '',
        phone: garage.phone,
        email: garage.email || '',
        website: garage.website || '',
      });
    }
  }, [garage, isEditMode, reset]);

  // Redirect if not garage owner
  if (!isAuthenticated || user?.role !== UserRole.GARAGE_OWNER) {
    router.push('/');
    return null;
  }

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: GarageFormData) => {
    // Clean up empty optional fields and convert lat/lng to numbers
    const cleanedData = {
      ...data,
      latitude: data.latitude && data.latitude !== '' ? parseFloat(data.latitude) : undefined,
      longitude: data.longitude && data.longitude !== '' ? parseFloat(data.longitude) : undefined,
      email: data.email || undefined,
      website: data.website || undefined,
    };

    if (isEditMode && garageId) {
      await updateGarage.mutateAsync({ id: garageId, data: cleanedData });
    } else {
      await createGarage.mutateAsync(cleanedData);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/my-garages">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à mes garages
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {isEditMode ? 'Modifier le Garage' : 'Ajouter un Garage'}
          </h1>
          <p className="text-gray-600">
            {isEditMode 
              ? 'Mettez à jour les informations de votre garage' 
              : 'Renseignez les informations de votre garage'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Informations du Garage
            </CardTitle>
            <CardDescription>
              Ces informations seront visibles par vos clients
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Informations générales
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom du garage <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Garage Auto Pro"
                    error={errors.name?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    {...register('description')}
                    placeholder="Décrivez votre garage, vos spécialités, votre expérience..."
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localisation
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Adresse <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('address')}
                    placeholder="123 Avenue de la République"
                    error={errors.address?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register('city')}
                      placeholder="Tunis"
                      error={errors.city?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Code Postal <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register('postalCode')}
                      placeholder="1000"
                      error={errors.postalCode?.message}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Latitude <span className="text-gray-500">(Optionnel)</span>
                    </label>
                    <Input
                      type="number"
                      step="any"
                      {...register('latitude')}
                      placeholder="36.8065"
                      error={errors.latitude?.message}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ex: 36.8065 pour Tunis
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Longitude <span className="text-gray-500">(Optionnel)</span>
                    </label>
                    <Input
                      type="number"
                      step="any"
                      {...register('longitude')}
                      placeholder="10.1815"
                      error={errors.longitude?.message}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ex: 10.1815 pour Tunis
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Coordonnées
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('phone')}
                    placeholder="+216 12 345 678"
                    error={errors.phone?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-gray-500">(Optionnel)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      {...register('email')}
                      placeholder="contact@garage.com"
                      error={errors.email?.message}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Site Web <span className="text-gray-500">(Optionnel)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <Input
                      {...register('website')}
                      placeholder="https://www.mongarage.com"
                      error={errors.website?.message}
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              {!isEditMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Vérification du garage
                      </h4>
                      <p className="text-blue-800">
                        Après l'ajout de votre garage, notre équipe procédera à une vérification 
                        avant de le rendre visible au public. Vous recevrez un email une fois 
                        la vérification terminée (24-48h).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Link href="/my-garages" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Annuler
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={createGarage.isPending || updateGarage.isPending}
                >
                  {(createGarage.isPending || updateGarage.isPending)
                    ? 'Enregistrement...' 
                    : isEditMode 
                      ? 'Mettre à jour' 
                      : 'Enregistrer le Garage'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
