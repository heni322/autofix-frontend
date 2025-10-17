'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useSignOut } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Car, 
  Calendar, 
  User, 
  LogOut, 
  Settings,
  Home,
  MapPin,
  Building2
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const signOut = useSignOut();

  const isGarageOwner = user?.role === UserRole.GARAGE_OWNER;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await signOut.mutateAsync();
  };

  // Return a loading state during SSR/hydration
  if (!mounted) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
              <Car className="h-6 w-6" />
              <span>Autofix</span>
            </Link>
            <div className="h-10 w-32 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Car className="h-6 w-6" />
            <span>Autofix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="h-4 w-4" />
              {t('navigation.home')}
            </Link>

            {/* Hide "Garages" for garage owners */}
            {!isGarageOwner && (
              <Link
                href="/garages"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/garages') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapPin className="h-4 w-4" />
                {t('navigation.garages')}
              </Link>
            )}

            {isAuthenticated && (
              <>
                {/* Hide "My Reservations" for garage owners */}
                {!isGarageOwner && (
                  <Link
                    href="/reservations"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      pathname.startsWith('/reservations') 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    {t('navigation.myReservations')}
                  </Link>
                )}

                {/* Show Dashboard for garage owners */}
                {isGarageOwner && (
                  <Link
                    href="/dashboard/garage"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      pathname.startsWith('/dashboard/garage')
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    {t('navigation.dashboard')}
                  </Link>
                )}

                {/* Show "My Garages" for garage owners */}
                {isGarageOwner && (
                  <Link
                    href="/my-garages"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      pathname.startsWith('/my-garages')
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    Mes Garages
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                {/* Hide "Book Now" button for garage owners */}
                {!isGarageOwner && (
                  <Link href="/reservation/new">
                    <Button size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('home.bookNow')}
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {user?.firstName}
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={signOut.isPending}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('auth.signOut')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    {t('auth.signIn')}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">{t('auth.createAccount')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="pb-4 border-t border-gray-200">
            <div className="pt-4 px-3">
              <LanguageSwitcher />
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4 inline mr-2" />
                {t('navigation.home')}
              </Link>

              {/* Hide "Garages" for garage owners */}
              {!isGarageOwner && (
                <Link
                  href="/garages"
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive('/garages') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MapPin className="h-4 w-4 inline mr-2" />
                  {t('navigation.garages')}
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  {/* Hide "My Reservations" for garage owners */}
                  {!isGarageOwner && (
                    <Link
                      href="/reservations"
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        pathname.startsWith('/reservations')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Calendar className="h-4 w-4 inline mr-2" />
                      {t('navigation.myReservations')}
                    </Link>
                  )}

                  {/* Show Dashboard for garage owners */}
                  {isGarageOwner && (
                    <Link
                      href="/dashboard/garage"
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        pathname.startsWith('/dashboard/garage')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 inline mr-2" />
                      {t('navigation.dashboard')}
                    </Link>
                  )}

                  {/* Show "My Garages" for garage owners */}
                  {isGarageOwner && (
                    <Link
                      href="/my-garages"
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        pathname.startsWith('/my-garages')
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Building2 className="h-4 w-4 inline mr-2" />
                      Mes Garages
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    {t('navigation.profile')}
                  </Link>

                  <div className="border-t border-gray-200 my-2" />

                  {/* Hide "Book Now" for garage owners */}
                  {!isGarageOwner && (
                    <Link href="/reservation/new" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {t('home.bookNow')}
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    disabled={signOut.isPending}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('auth.signOut')}
                  </Button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2" />
                  <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      {t('auth.signIn')}
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">{t('auth.createAccount')}</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
