'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGarage } from '@/lib/hooks/useGarages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, getPricingTypeLabel } from '@/lib/utils/formatting';

export default function GarageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const garageId = Number(params.id);

  const { data: garage, isLoading } = useGarage(garageId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading garage details...</div>
      </div>
    );
  }

  if (!garage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Garage Not Found</h2>
            <Button onClick={() => router.push('/garages')}>
              Back to Garages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{garage.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <MapPin className="h-5 w-5" />
                      {garage.address}, {garage.city} {garage.postalCode}
                    </CardDescription>
                  </div>
                  {garage.isVerified && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{garage.description}</p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
                <CardDescription>Services offered by this garage</CardDescription>
              </CardHeader>
              <CardContent>
                {garage.garageServices && garage.garageServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {garage.garageServices.map((gs) => (
                      <div
                        key={gs.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{gs.service?.name}</h4>
                          <Badge variant="info">
                            {getPricingTypeLabel(gs.pricingType)}
                          </Badge>
                        </div>
                        {gs.service?.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {gs.service.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          {gs.price && (
                            <span className="text-lg font-bold text-blue-600">
                              {formatCurrency(gs.price)}
                            </span>
                          )}
                          {gs.capacity && (
                            <span className="text-sm text-gray-500">
                              Capacity: {gs.capacity}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No services configured yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Opening Hours */}
            {garage.openingHours && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {daysOfWeek.map((day) => {
                      const hours = garage.openingHours?.[day];
                      return (
                        <div
                          key={day}
                          className="flex items-center justify-between py-2 border-b border-gray-100"
                        >
                          <span className="font-medium capitalize">{day}</span>
                          <span className="text-gray-600">
                            {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <a href={`tel:${garage.phone}`} className="text-blue-600 hover:underline">
                    {garage.phone}
                  </a>
                </div>

                {garage.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <a href={`mailto:${garage.email}`} className="text-blue-600 hover:underline">
                      {garage.email}
                    </a>
                  </div>
                )}

                {garage.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a
                      href={garage.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">{garage.address}</p>
                    <p className="text-sm">{garage.city}, {garage.postalCode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Now */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Ready to Book?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule your service appointment now
                </p>
                <Link href={`/reservation/new?garageId=${garage.id}`}>
                  <Button className="w-full" size="lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Book an Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            {garage.latitude && garage.longitude && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-gray-400" />
                    <p className="text-gray-500 ml-2">Map View</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Lat: {garage.latitude}, Lng: {garage.longitude}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
