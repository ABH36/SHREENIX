import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, isAuthenticated, clearAuth } from '../lib/api';

export function useAuth() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const hasToken = isAuthenticated();
      
      if (!hasToken) {
        if (window.location.pathname.startsWith('/admin') && 
            window.location.pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        return;
      }

      // Verify token with server
      const result = await adminApi.verifyToken();
      
      if (result.success) {
        setUser(result.data?.user || null);
        
        // If on login page, redirect to dashboard
        if (window.location.pathname === '/admin/login') {
          router.push('/admin/dashboard');
        }
      } else {
        clearAuth();
        if (window.location.pathname.startsWith('/admin') && 
            window.location.pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuth();
    } finally {
      setIsAuthChecked(true);
      setIsLoading(false);
    }
  }, [router]);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await adminApi.login(username, password);
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
        setUser(data.user);
        router.push('/admin/dashboard');
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Network error' };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      setUser(null);
      router.push('/admin/login');
    }
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    isAuthChecked,
    login,
    logout,
    checkAuth,
  };
}