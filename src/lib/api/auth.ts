import { User, UserRole } from '../types';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

// Backend returns access_token, but we'll normalize to accessToken in our app
export interface AuthResponse {
  access_token?: string;  // Backend format
  accessToken?: string;    // Frontend format
  user: User;
}

export const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create account' }));
      throw new Error(error.message || 'Failed to create account');
    }

    return response.json();
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(error.message || 'Invalid credentials');
    }

    return response.json();
  },

  signOut: async (): Promise<void> => {
    // Just clear local storage, backend doesn't have a signout endpoint
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('auth-storage');
    }
  },

  getProfile: async (): Promise<User> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  },
};
