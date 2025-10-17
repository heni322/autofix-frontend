'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@/lib/hooks/useAuth';
import { signUpSchema, SignUpFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { UserRole } from '@/lib/types';
import { User, Building2, CheckCircle } from 'lucide-react';

export const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const signUp = useSignUp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CLIENT);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: UserRole.CLIENT,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    const { confirmPassword, ...signUpData } = data;
    await signUp.mutateAsync({
      ...signUpData,
      role: selectedRole,
    });
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t('auth.signUpTitle')}</CardTitle>
        <CardDescription>{t('auth.signUpDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Je m'inscris en tant que
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client Card */}
              <div
                onClick={() => handleRoleChange(UserRole.CLIENT)}
                className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedRole === UserRole.CLIENT
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {selectedRole === UserRole.CLIENT && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="h-6 w-6 text-blue-500" />
                  </div>
                )}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`mb-4 p-4 rounded-full ${
                      selectedRole === UserRole.CLIENT
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    <User
                      className={`h-8 w-8 ${
                        selectedRole === UserRole.CLIENT
                          ? 'text-blue-600'
                          : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Client</h3>
                  <p className="text-sm text-gray-600">
                    Je cherche un garage pour entretenir mon véhicule
                  </p>
                </div>
              </div>

              {/* Garage Owner Card */}
              <div
                onClick={() => handleRoleChange(UserRole.GARAGE_OWNER)}
                className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedRole === UserRole.GARAGE_OWNER
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {selectedRole === UserRole.GARAGE_OWNER && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`mb-4 p-4 rounded-full ${
                      selectedRole === UserRole.GARAGE_OWNER
                        ? 'bg-green-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Building2
                      className={`h-8 w-8 ${
                        selectedRole === UserRole.GARAGE_OWNER
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Garagiste</h3>
                  <p className="text-sm text-gray-600">
                    Je suis propriétaire d'un garage et je veux recevoir des réservations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('auth.firstName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('firstName')}
                  placeholder={t('auth.enterFirstName')}
                  error={errors.firstName?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('auth.lastName')} <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('lastName')}
                  placeholder={t('auth.enterLastName')}
                  error={errors.lastName?.message}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                {t('common.email')} <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                {...register('email')}
                placeholder={t('auth.emailPlaceholder')}
                error={errors.email?.message}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                {t('common.phone')} <span className="text-gray-500">(Optionnel)</span>
              </label>
              <Input
                type="tel"
                {...register('phone')}
                placeholder="+216 12 345 678"
                error={errors.phone?.message}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                {t('common.password')} <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                {...register('password')}
                placeholder={t('auth.passwordPlaceholder')}
                error={errors.password?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Au moins 6 caractères
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                {t('auth.confirmPassword')} <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                {...register('confirmPassword')}
                placeholder={t('auth.passwordPlaceholder')}
                error={errors.confirmPassword?.message}
              />
            </div>
          </div>

          {/* Additional info for garage owners */}
          {selectedRole === UserRole.GARAGE_OWNER && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-blue-900 mb-1">
                    Information pour les garagistes
                  </h4>
                  <p className="text-sm text-blue-800">
                    Après votre inscription, vous pourrez ajouter les informations de votre garage 
                    (adresse, services, horaires, etc.) depuis votre tableau de bord. 
                    Votre compte sera vérifié par notre équipe avant d'être activé.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={signUp.isPending}
            size="lg"
          >
            {signUp.isPending ? t('auth.signingUp') : t('auth.createAccount')}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {t('auth.hasAccount')}{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
              {t('auth.signIn')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};