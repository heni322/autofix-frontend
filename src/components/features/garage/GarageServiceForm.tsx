'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PricingType, GarageService, Service } from '@/lib/types';
import { useCreateGarageService, useUpdateGarageService } from '@/lib/hooks/useGarageServices';
import { Loader2 } from 'lucide-react';

const garageServiceSchema = z.object({
  serviceId: z.number().min(1, 'Veuillez sélectionner un service'),
  capacity: z.number().min(1, 'La capacité doit être au moins 1'),
  pricingType: z.nativeEnum(PricingType),
  price: z.number().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    // If pricing type is FIXED, price is required
    if (data.pricingType === PricingType.FIXED) {
      return data.price !== undefined && data.price > 0;
    }
    return true;
  },
  {
    message: 'Le prix est requis pour un tarif fixe',
    path: ['price'],
  }
);

type GarageServiceFormData = z.infer<typeof garageServiceSchema>;

interface GarageServiceFormProps {
  garageId: number;
  availableServices: Service[];
  existingService?: GarageService;
  open: boolean;
  onClose: () => void;
}

export default function GarageServiceForm({
  garageId,
  availableServices,
  existingService,
  open,
  onClose,
}: GarageServiceFormProps) {
  const createMutation = useCreateGarageService();
  const updateMutation = useUpdateGarageService();
  const [selectedPricingType, setSelectedPricingType] = useState<PricingType>(
    existingService?.pricingType || PricingType.FIXED
  );

  const isEditMode = !!existingService;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<GarageServiceFormData>({
    resolver: zodResolver(garageServiceSchema),
    defaultValues: existingService
      ? {
          serviceId: existingService.serviceId,
          capacity: existingService.capacity,
          pricingType: existingService.pricingType,
          price: existingService.price || undefined,
          notes: existingService.notes || undefined,
        }
      : {
          capacity: 1,
          pricingType: PricingType.FIXED,
        },
  });

  const pricingType = watch('pricingType');

  useEffect(() => {
    setSelectedPricingType(pricingType);
  }, [pricingType]);

  useEffect(() => {
    if (existingService) {
      reset({
        serviceId: existingService.serviceId,
        capacity: existingService.capacity,
        pricingType: existingService.pricingType,
        price: existingService.price || undefined,
        notes: existingService.notes || undefined,
      });
    }
  }, [existingService, reset]);

  const onSubmit = async (data: GarageServiceFormData) => {
    try {
      const submitData = {
        ...data,
        garageId,
        price: data.pricingType === PricingType.FIXED ? data.price : undefined,
      };

      if (isEditMode && existingService) {
        await updateMutation.mutateAsync({
          id: existingService.id,
          data: {
            capacity: submitData.capacity,
            pricingType: submitData.pricingType,
            price: submitData.price,
            notes: submitData.notes,
          },
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      onClose();
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier le Service' : 'Ajouter un Service'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Selection */}
          {!isEditMode && (
            <div>
              <Label htmlFor="serviceId">
                Service <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue('serviceId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un service" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name} - {service.category?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceId && (
                <p className="text-sm text-red-500 mt-1">{errors.serviceId.message}</p>
              )}
            </div>
          )}

          {isEditMode && existingService?.service && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="text-sm text-gray-600">Service</Label>
              <p className="font-semibold">{existingService.service.name}</p>
              <p className="text-sm text-gray-500">{existingService.service.category?.name}</p>
            </div>
          )}

          {/* Pricing Type */}
          <div>
            <Label htmlFor="pricingType">
              Type de Tarification <span className="text-red-500">*</span>
            </Label>
            <Select
              value={pricingType}
              onValueChange={(value) => setValue('pricingType', value as PricingType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PricingType.FIXED}>Prix Fixe</SelectItem>
                <SelectItem value={PricingType.QUOTE}>Sur Devis</SelectItem>
                <SelectItem value={PricingType.CONSULTATION}>Consultation</SelectItem>
              </SelectContent>
            </Select>
            {errors.pricingType && (
              <p className="text-sm text-red-500 mt-1">{errors.pricingType.message}</p>
            )}
          </div>

          {/* Price (only for FIXED) */}
          {selectedPricingType === PricingType.FIXED && (
            <div>
              <Label htmlFor="price">
                Prix (TND) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="50.00"
                {...register('price', { valueAsNumber: true })}
                error={errors.price?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Prix en dinars tunisiens (TND)
              </p>
            </div>
          )}

          {selectedPricingType === PricingType.QUOTE && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 Le prix sera déterminé après évaluation et fourni au client via devis.
              </p>
            </div>
          )}

          {selectedPricingType === PricingType.CONSULTATION && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 Service de consultation - le client prendra rendez-vous pour discuter de ses besoins.
              </p>
            </div>
          )}

          {/* Capacity */}
          <div>
            <Label htmlFor="capacity">
              Capacité par Créneau <span className="text-red-500">*</span>
            </Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              placeholder="1"
              {...register('capacity', { valueAsNumber: true })}
              error={errors.capacity?.message}
            />
            <p className="text-xs text-gray-500 mt-1">
              Nombre de clients que vous pouvez servir simultanément
            </p>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">
              Notes <span className="text-gray-500">(Optionnel)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Informations complémentaires..."
              rows={3}
              {...register('notes')}
              className={errors.notes ? 'border-red-500' : ''}
            />
            {errors.notes && (
              <p className="text-sm text-red-500 mt-1">{errors.notes.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : isEditMode ? (
                'Mettre à jour'
              ) : (
                'Ajouter'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
