'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DebugPage() {
  const { user, isAuthenticated, isHydrated, accessToken } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Debug - Auth Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded">
                <div className="text-sm text-gray-600">Authentifié</div>
                <div className="text-xl font-bold">
                  {isAuthenticated ? 'Oui' : 'Non'}
                </div>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <div className="text-sm text-gray-600">Hydraté</div>
                <div className="text-xl font-bold">
                  {isHydrated ? 'Oui' : 'Non'}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Utilisateur</h3>
              <div className="space-y-2 bg-gray-50 p-4 rounded text-sm">
                <div>Nom: {user?.firstName} {user?.lastName}</div>
                <div>Email: {user?.email}</div>
                <div className="font-bold text-lg">Role: {user?.role}</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Vérification</h3>
              <div className="p-3 bg-blue-50 rounded">
                <div>Est GARAGE_OWNER ?</div>
                <div className="text-xl font-bold">
                  {user?.role === UserRole.GARAGE_OWNER ? 'OUI' : 'NON'}
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex gap-3">
              <Button onClick={() => router.push('/')}>
                Retour
              </Button>
              {user?.role === UserRole.GARAGE_OWNER && (
                <Button onClick={() => router.push('/my-garages')}>
                  Mes Garages
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
