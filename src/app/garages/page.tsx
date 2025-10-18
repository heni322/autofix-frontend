'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { useGarages } from '@/lib/hooks/useGarages';
import { useCategories } from '@/lib/hooks/useServices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Phone, Star, Clock, ArrowRight, Filter, X, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Garage, Service, GarageService } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function GaragesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(undefined);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  
  const { data: garagesResponse, isLoading } = useGarages({ 
    page,
    limit,
    search: searchQuery || undefined,
    city: selectedCity || undefined,
    categoryId: selectedCategoryId,
    serviceId: selectedServiceId,
    isActive: true,
    isVerified: showVerifiedOnly || undefined,
  });
  
  const { data: categories } = useCategories();

  // Redirect garage owners - they shouldn't access this page
  useEffect(() => {
    if (isAuthenticated && user?.role === UserRole.GARAGE_OWNER) {
      router.push('/dashboard/garage');
    }
  }, [isAuthenticated, user, router]);

  // Get services for selected category
  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);
  const availableServices: Service[] = selectedCategory?.services || [];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city === 'all' ? '' : city);
    setPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    const id = categoryId === 'all' ? undefined : parseInt(categoryId);
    setSelectedCategoryId(id);
    setSelectedServiceId(undefined);
    setPage(1);
  };

  const handleServiceChange = (serviceId: string) => {
    const id = serviceId === 'all' ? undefined : parseInt(serviceId);
    setSelectedServiceId(id);
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedCategoryId(undefined);
    setSelectedServiceId(undefined);
    setShowVerifiedOnly(false);
    setPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCity || selectedCategoryId || selectedServiceId || showVerifiedOnly;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Block rendering for garage owners AFTER all hooks are called
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

  // Get unique cities from garages data for dropdown
  const cities = useMemo(() => {
    if (!garagesResponse?.data) return [];
    return Array.from(new Set(garagesResponse.data.map((g) => g.city))).sort();
  }, [garagesResponse]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trouver un Garage</h1>
          <p className="text-gray-600">
            Découvrez des garages de confiance près de chez vous
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="h-4 w-4" />
            Recherche & Filtres
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher par nom, ville ou description..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <Select
                value={selectedCity || 'all'}
                onValueChange={handleCityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <Select
                value={selectedCategoryId?.toString() || 'all'}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <Select
                value={selectedServiceId?.toString() || 'all'}
                onValueChange={handleServiceChange}
                disabled={!selectedCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedCategoryId ? "Sélectionner" : "Catégorie d'abord"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les services</SelectItem>
                  {availableServices.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vérification
              </label>
              <Button
                variant={showVerifiedOnly ? 'default' : 'outline'}
                size="default"
                onClick={() => {
                  setShowVerifiedOnly(!showVerifiedOnly);
                  setPage(1);
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                <Star className={`h-4 w-4 ${showVerifiedOnly ? 'fill-current' : ''}`} />
                {showVerifiedOnly ? 'Vérifiés uniquement' : 'Tous les garages'}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 flex-wrap">
              <span className="text-sm text-gray-600">Filtres actifs:</span>
              {searchQuery && (
                <Badge variant="default" className="flex items-center gap-1">
                  Recherche: "{searchQuery.slice(0, 20)}{searchQuery.length > 20 ? '...' : ''}"
                  <button
                    onClick={() => handleSearch('')}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCity && (
                <Badge variant="default" className="flex items-center gap-1">
                  Ville: {selectedCity}
                  <button
                    onClick={() => handleCityChange('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategoryId && (
                <Badge variant="default" className="flex items-center gap-1">
                  Catégorie: {categories?.find(c => c.id === selectedCategoryId)?.name}
                  <button
                    onClick={() => {
                      setSelectedCategoryId(undefined);
                      setSelectedServiceId(undefined);
                      setPage(1);
                    }}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedServiceId && (
                <Badge variant="default" className="flex items-center gap-1">
                  Service: {availableServices.find(s => s.id === selectedServiceId)?.name}
                  <button
                    onClick={() => {
                      setSelectedServiceId(undefined);
                      setPage(1);
                    }}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {showVerifiedOnly && (
                <Badge variant="default" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Vérifiés uniquement
                  <button
                    onClick={() => {
                      setShowVerifiedOnly(false);
                      setPage(1);
                    }}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="ml-auto text-xs"
              >
                Effacer tous les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : garagesResponse && garagesResponse.data.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-600">
                Affichage de <strong>{garagesResponse.data.length}</strong> sur <strong>{garagesResponse.meta.total}</strong> garage{garagesResponse.meta.total !== 1 ? 's' : ''}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Par page:</span>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    setLimit(parseInt(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Garage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {garagesResponse.data.map((garage) => (
                <GarageCard key={garage.id} garage={garage} />
              ))}
            </div>

            {/* Pagination */}
            {garagesResponse.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: garagesResponse.meta.totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      return (
                        pageNum === 1 ||
                        pageNum === garagesResponse.meta.totalPages ||
                        Math.abs(pageNum - page) <= 1
                      );
                    })
                    .map((pageNum, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && pageNum - prevPage > 1;

                      return (
                        <React.Fragment key={pageNum}>
                          {showEllipsis && (
                            <span className="px-3 py-2 text-gray-400">...</span>
                          )}
                          <Button
                            variant={page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="min-w-[40px]"
                          >
                            {pageNum}
                          </Button>
                        </React.Fragment>
                      );
                    })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === garagesResponse.meta.totalPages}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun Garage Trouvé</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'Essayez d\'ajuster vos filtres pour voir plus de résultats'
                  : 'Aucun garage disponible pour le moment'}
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                >
                  Effacer tous les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface GarageCardProps {
  garage: Garage;
}

const GarageCard: React.FC<GarageCardProps> = ({ garage }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{garage.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {garage.city}
            </CardDescription>
          </div>
          {garage.isVerified && (
            <Badge variant="default" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Vérifié
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1 flex flex-col">
        <p className="text-sm text-gray-600 line-clamp-2">{garage.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          {garage.phone}
        </div>

        {garage.openingHours && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Ouvert aujourd'hui</span>
          </div>
        )}

        {garage.garageServices && garage.garageServices.length > 0 && (
          <div className="pt-2 border-t border-gray-100 flex-1">
            <p className="text-xs text-gray-500 mb-1">Services offerts:</p>
            <div className="flex flex-wrap gap-1">
              {garage.garageServices.slice(0, 3).map((gs: GarageService) => (
                <Badge key={gs.id} variant="default" className="text-xs">
                  {gs.service?.name}
                </Badge>
              ))}
              {garage.garageServices.length > 3 && (
                <Badge variant="default" className="text-xs">
                  +{garage.garageServices.length - 3} plus
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-4">
          <Link href={`/garages/${garage.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Voir Détails
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href={`/reservation/new?garageId=${garage.id}`}>
            <Button>Réserver</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};