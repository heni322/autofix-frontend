'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@/lib/hooks/useAuth';
import { signInSchema, SignInFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export const SignInForm: React.FC = () => {
  const { t } = useTranslation();
  const signIn = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    await signIn.mutateAsync(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t('auth.signInTitle')}</CardTitle>
        <CardDescription>{t('auth.signInDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('common.email')}</label>
            <Input
              type="email"
              {...register('email')}
              placeholder={t('auth.emailPlaceholder')}
              error={errors.email?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('common.password')}</label>
            <Input
              type="password"
              {...register('password')}
              placeholder={t('auth.passwordPlaceholder')}
              error={errors.password?.message}
            />
          </div>

          <Button type="submit" className="w-full" disabled={signIn.isPending}>
            {signIn.isPending ? t('auth.signingIn') : t('auth.signIn')}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              {t('auth.signUp')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
