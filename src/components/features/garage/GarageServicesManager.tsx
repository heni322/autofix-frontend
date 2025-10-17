'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Power, DollarSign, Users, Tag, Loader2 } from 'lucide-react';
import { GarageService, PricingType } from '@/lib/types';
import {
  useGarageServices,
  useToggleServiceAvailability,
  useRemoveGarageService,
} from '@/lib/hooks/useGarageServices';
import { useServices } from '@/lib/hooks/useServices';
import GarageServiceForm from './GarageServiceForm';

interface GarageServicesManagerProps {
  garageId: number;
}

export default function GarageServicesManager({ garageId }: GarageServicesManagerProps) {
  const { data: garageServices, isLoading: isLoadingServices } = useGarageServices(garageId);
  const { data: allServices, isLoading: isLoadingAllServices } = useServices();
  const toggleAvailability = useToggleServiceAvailability();
  const removeService = useRemoveGarageService();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<GarageService | undefined>();
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);

  const availableServices = useMemo(() => {
    if (!allServices || !garageServices) return [];
    const addedServiceIds = garageServices.map((gs) => gs.serviceId);
    return allServices.filter((service) => !addedServiceIds.includes(service.id));
  }, [allServices, garageServices]);

  const getPricingBadge = (pricingType: PricingType, price?: number | null) => {
    switch (pricingType) {
      case PricingType.FIXED:
        return (
          <Badge variant="default" className="bg-green-500">
            <DollarSign className="h-3 w-3 mr-1" />
            {price ? `${price} TND` : 'Prix Fixe'}
          </Badge>
        );
      case PricingType.QUOTE:
        return (
          <Badge variant="secondary">
            <Tag className="h-3 w-3 mr-1" />
            Sur Devis
          </Badge>
        );
      case PricingType.CONSULTATION:
        return (
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            Consultation
          </Badge>
        );
    }
  };

  if (isLoadingServices || isLoadingAllServices) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services du Garage</CardTitle>
              <CardDescription>Gérez les services proposés par votre garage</CardDescription>
            </div>
            <Button onClick={() => { setEditingService(undefined); setIsFormOpen(true); }} disabled={availableServices.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Service
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {garageServices && garageServices.length > 0 ? (
            <div className="space-y-4">
              {garageServices.map((gs) => (
                <div key={gs.id} className={`border rounded-lg p-4 ${gs.isAvailable ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{gs.service?.name}</h3>
                        {gs.service?.category && <Badge variant="outline">{gs.service.category.name}</Badge>}
                        {!gs.isAvailable && <Badge variant="destructive">Désactivé</Badge>}
                      </div>
                      {gs.service?.description && <p className="text-sm text-gray-600 mb-3">{gs.service.description}</p>}
                      <div className="flex flex-wrap items-center gap-3">
                        {getPricingBadge(gs.pricingType, gs.price)}
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          Capacité: {gs.capacity}
                        </div>
                      </div>
                      {gs.notes && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                          <p className="text-blue-800">{gs.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant={gs.isAvailable ? 'outline' : 'default'} onClick={() => toggleAvailability.mutateAsync(gs.id)}>
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingService(gs); setIsFormOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => setDeletingServiceId(gs.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Tag className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun service ajouté</h3>
              <p className="text-gray-600 mb-6">Commencez par ajouter des services à votre garage</p>
              <Button onClick={() => { setEditingService(undefined); setIsFormOpen(true); }} disabled={availableServices.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Service
              </Button>
            </div>
          )}

          {availableServices.length === 0 && garageServices && garageServices.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">✓ Tous les services disponibles ont été ajoutés à votre garage.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <GarageServiceForm
        garageId={garageId}
        availableServices={availableServices}
        existingService={editingService}
        open={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingService(undefined); }}
      />

      <AlertDialog open={deletingServiceId !== null} onOpenChange={() => setDeletingServiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingServiceId && removeService.mutateAsync(deletingServiceId).then(() => setDeletingServiceId(null))} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
