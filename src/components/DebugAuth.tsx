'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/lib/types';

export default function DebugAuth() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <div className="space-y-1">
        <div>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
        <div>Hydrated: {isHydrated ? '✅ Yes' : '❌ No'}</div>
        <div>User: {user ? user.firstName + ' ' + user.lastName : 'None'}</div>
        <div>Email: {user?.email || 'N/A'}</div>
        <div>Role: {user?.role || 'N/A'}</div>
        <div>Is Garage Owner: {user?.role === UserRole.GARAGE_OWNER ? '✅ Yes' : '❌ No'}</div>
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="font-bold">Should see "Mes Garages":</div>
          <div>{user?.role === UserRole.GARAGE_OWNER ? '✅ YES' : '❌ NO'}</div>
        </div>
      </div>
    </div>
  );
}
