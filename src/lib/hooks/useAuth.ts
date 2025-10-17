import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, SignInData, SignUpData } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useSignUp = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignUpData) => authApi.signUp(data),
    onSuccess: (response) => {
      // Backend returns access_token, we need to map it to accessToken
      const accessToken = response.access_token || response.accessToken;
      
      if (!accessToken) {
        console.error('No access token in response:', response);
        toast.error('Authentication failed - no token received');
        return;
      }
      
      setAuth(response.user, accessToken);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    },
  });
};

export const useSignIn = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignInData) => authApi.signIn(data),
    onSuccess: (response) => {
      console.log('Sign in response:', response);
      
      // Backend returns access_token, we need to map it to accessToken
      const accessToken = response.access_token || response.accessToken;
      
      if (!accessToken) {
        console.error('No access token in response:', response);
        toast.error('Authentication failed - no token received');
        return;
      }
      
      setAuth(response.user, accessToken);
      toast.success('Welcome back!');
      
      // Check for redirect parameter
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/dashboard';
      router.push(redirect);
    },
    onError: (error: any) => {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Invalid credentials');
    },
  });
};

export const useSignOut = () => {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.signOut(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Signed out successfully');
      router.push('/');
    },
    onError: () => {
      // Clear auth anyway on error
      clearAuth();
      queryClient.clear();
      router.push('/');
    },
  });
};
