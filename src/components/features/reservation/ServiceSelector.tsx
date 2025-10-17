'use client';

import React, { useState } from 'react';
import { useReservationStore } from '@/lib/store/reservationStore';
import { useCategories } from '@/lib/hooks/useServices';
import { useGarage, useGarageServices } from '@/lib/hooks/useGarages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, ArrowLeft, Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDuration, getPricingTypeLabel, formatCurrency } from '@/lib/utils/formatting';

export const ServiceSelector: React.FC = () => {
  const { selectedGarageId, setService, nextStep, previousStep } = useReservationStore();
  const { data: garage } = useGarage(selectedGarageId!);
  
  // Pagination and filter states
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 12;

  // Fetch garage services with filters
  const { data: servicesResponse, isLoading: servicesLoading } = useGarageServices(
    selectedGarageId!,
    {
      page,
      limit,
      search: searchQuery || undefined,
      categoryId: selectedCategory,
      isAvailable: true,
    }
  );

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleSelectService = (serviceId: number) => {
    setService(serviceId);
    nextStep();
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSearchQuery('');
    setPage(1);
  };

  // Group services by category for display - Fix: use string keys instead of undefined
  const servicesByCategory = servicesResponse?.data.reduce((acc, garageService) => {
    const categoryId = garageService?.service?.categoryId ?? 'uncategorized';
    const key = String(categoryId);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(garageService);
    return acc;
  }, {} as Record<string, typeof servicesResponse.data>);

  const isLoading = servicesLoading || categoriesLoading;
  const hasActiveFilters = selectedCategory !== undefined || searchQuery !== '';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={previousStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Select a Service</h2>
        <p className="text-gray-600">
          Choose the service you need at <strong>{garage?.name}</strong>
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="h-4 w-4" />
          Filters
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search services..."
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

        {/* Category Filter Pills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === undefined ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(undefined)}
            >
              All Categories
            </Button>
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCategory !== undefined && (
              <Badge variant="default" className="flex items-center gap-1">
                {categories?.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => handleCategoryChange(undefined)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="default" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <button
                  onClick={() => handleSearch('')}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto text-xs"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Results Count & Pagination Info */}
      {!isLoading && servicesResponse && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {servicesResponse.data.length} of {servicesResponse.meta.total} service
            {servicesResponse.meta.total !== 1 ? 's' : ''}
          </div>
          <div>
            Page {servicesResponse.meta.page} of {servicesResponse.meta.totalPages}
          </div>
        </div>
      )}

      {/* Services List */}
      {isLoading ? (
        <div className="text-center py-8">Loading services...</div>
      ) : servicesResponse && servicesResponse.data.length > 0 ? (
        <div className="space-y-6">
          {categories?.map((category) => {
            const categoryServices = servicesByCategory?.[String(category.id)] || [];
            
            if (categoryServices.length === 0) return null;

            return (
              <div key={category.id}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {category.name}
                    <Badge variant="default" className="text-xs">
                      {categoryServices.length}
                    </Badge>
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryServices.map((garageService) => {
                    // Fix: Add null check for garageService.service
                    if (!garageService.service) return null;
                    
                    const service = garageService.service;

                    return (
                      <Card
                        key={garageService.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer group"
                        onClick={() => handleSelectService(service.id)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                                {service.name}
                              </CardTitle>
                              <CardDescription className="mt-1 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {formatDuration(service.durationMinutes)}
                              </CardDescription>
                            </div>
                            <Badge variant="info">
                              {getPricingTypeLabel(garageService.pricingType)}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          {service.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {service.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            {garageService.price ? (
                              <div className="text-lg font-bold text-blue-600">
                                {formatCurrency(garageService.price)}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                Price on request
                              </div>
                            )}

                            <Button 
                              size="sm" 
                              className="group-hover:bg-blue-700 transition-colors"
                            >
                              Select
                            </Button>
                          </div>

                          {garageService.capacity && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Badge variant="info" className="text-xs">
                                {garageService.capacity} slots available
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {servicesResponse.meta.totalPages > 1 && (
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
                {Array.from({ length: servicesResponse.meta.totalPages }, (_, i) => i + 1)
                  .filter((pageNum) => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      pageNum === 1 ||
                      pageNum === servicesResponse.meta.totalPages ||
                      Math.abs(pageNum - page) <= 1
                    );
                  })
                  .map((pageNum, index, array) => {
                    // Add ellipsis
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
                disabled={page === servicesResponse.meta.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more services'
                : 'No services available for this garage'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};