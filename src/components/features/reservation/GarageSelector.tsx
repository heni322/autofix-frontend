'use client';

import React, { useState } from 'react';
import { useReservationStore } from '@/lib/store/reservationStore';
import { useGarages } from '@/lib/hooks/useGarages';
import { useCategories } from '@/lib/hooks/useServices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Star, Search, X, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Garage, Service, GarageService } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const GarageSelector: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(undefined);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const limit = 9;
  
  const { setGarage, nextStep } = useReservationStore();
  
  const { data: garagesResponse, isLoading } = useGarages({ 
    page,
    limit,
    search: searchQuery || undefined,
    city: searchCity || undefined,
    categoryId: selectedCategoryId,
    serviceId: selectedServiceId,
    isActive: true,
    isVerified: showVerifiedOnly || undefined,
  });
  
  const { data: categories } = useCategories();

  // Get services for selected category
  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);
  const availableServices: Service[] = selectedCategory?.services || [];

  const handleSelectGarage = (garage: Garage) => {
    setGarage(garage.id);
    nextStep();
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleCityChange = (value: string) => {
    setSearchCity(value);
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSearchCity('');
    setSelectedCategoryId(undefined);
    setSelectedServiceId(undefined);
    setShowVerifiedOnly(false);
    setPage(1);
  };

  const hasActiveFilters = searchQuery || searchCity || selectedCategoryId || selectedServiceId || showVerifiedOnly;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select a Garage</h2>
        <p className="text-gray-600">Choose the garage where you want to book your service</p>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="h-4 w-4" />
          Filter Garages
        </div>

        {/* Search by Name/Description */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search by City */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Filter by city..."
            value={searchCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchCity && (
            <button
              onClick={() => handleCityChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Category
            </label>
            <Select
              value={selectedCategoryId?.toString() || 'all'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
              Specific Service
            </label>
            <Select
              value={selectedServiceId?.toString() || 'all'}
              onValueChange={handleServiceChange}
              disabled={!selectedCategoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedCategoryId ? "Select Service" : "Select category first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
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
              Verification Status
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
              {showVerifiedOnly ? 'Verified Only' : 'All Garages'}
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <Badge variant="info" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => handleSearch('')} className="ml-1 hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchCity && (
              <Badge variant="info" className="flex items-center gap-1">
                City: {searchCity}
                <button onClick={() => handleCityChange('')} className="ml-1 hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedCategoryId && (
              <Badge variant="info" className="flex items-center gap-1">
                Category: {categories?.find(c => c.id === selectedCategoryId)?.name}
                <button onClick={() => {
                  setSelectedCategoryId(undefined);
                  setSelectedServiceId(undefined);
                  setPage(1);
                }} className="ml-1 hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedServiceId && (
              <Badge variant="info" className="flex items-center gap-1">
                Service: {availableServices.find(s => s.id === selectedServiceId)?.name}
                <button onClick={() => {
                  setSelectedServiceId(undefined);
                  setPage(1);
                }} className="ml-1 hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {showVerifiedOnly && (
              <Badge variant="info" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Verified Only
                <button onClick={() => {
                  setShowVerifiedOnly(false);
                  setPage(1);
                }} className="ml-1 hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto text-xs">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Count & Pagination Info */}
      {!isLoading && garagesResponse && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {garagesResponse.data.length} of {garagesResponse.meta.total} garage
            {garagesResponse.meta.total !== 1 ? 's' : ''}
          </div>
          <div>
            Page {garagesResponse.meta.page} of {garagesResponse.meta.totalPages}
          </div>
        </div>
      )}

      {/* Garages Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading garages...</p>
        </div>
      ) : garagesResponse && garagesResponse.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {garagesResponse.data.map((garage) => (
              <Card
                key={garage.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleSelectGarage(garage)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {garage.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {garage.city}
                      </CardDescription>
                    </div>
                    {garage.isVerified && (
                      <Badge variant="success" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {garage.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {garage.phone}
                  </div>

                  {garage.garageServices && garage.garageServices.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Available services:</p>
                      <div className="flex flex-wrap gap-1">
                        {garage.garageServices.slice(0, 3).map((gs: GarageService) => (
                          <Badge key={gs.id} variant="default" className="text-xs">
                            {gs.service?.name}
                          </Badge>
                        ))}
                        {garage.garageServices.length > 3 && (
                          <Badge variant="default" className="text-xs">
                            +{garage.garageServices.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Button className="w-full mt-4 group-hover:bg-blue-700 transition-colors">
                    Select This Garage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {garagesResponse.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
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
                          <span className="px-2 text-gray-400">...</span>
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
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Garages Found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your filters to see more results'
                : 'No garages available in this area'}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};