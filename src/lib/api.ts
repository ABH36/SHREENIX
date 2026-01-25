// Type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
}

// API configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// Fetch wrapper with auth and error handling
export async function fetchWithAuth<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    
    // Normalize headers to Record<string, string>
    let normalizedHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          normalizedHeaders[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          normalizedHeaders[key] = value;
        });
      } else {
        normalizedHeaders = { ...normalizedHeaders, ...(options.headers as Record<string, string>) };
      }
    }
    const headers: Record<string, string> = normalizedHeaders;

    // Add auth token if available
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle unauthorized (401) - redirect to login
    if (response.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      throw { status: 401, message: 'Session expired. Please login again.' };
    }

    // Handle other errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw { status: response.status, message: error.message };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred',
    };
  }
}

// Auth utilities
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_token', token);
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
  document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      clearAuth();
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Specific API functions
export const adminApi = {
  // Dashboard
  getStats: () => fetchWithAuth<{
    revenue: number;
    orders: number;
    pending: number;
    customers: number;
    thisMonthRevenue: number;
    growth: number;
  }>('/api/admin/dashboard/stats'),

  // Orders
  getOrders: (params?: { page?: number; limit?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.status) query.set('status', params.status);
    
    return fetchWithAuth(`/api/admin/orders${query.toString() ? `?${query}` : ''}`);
  },

  updateOrderStatus: (orderId: string, status: string) =>
    fetchWithAuth(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  exportOrders: () =>
    fetchWithAuth('/api/admin/orders/export', {
      headers: {
        'Accept': 'text/csv',
      },
    }),

  // Products
  getProducts: () => fetchWithAuth('/api/admin/products'),
  updateProduct: (data: any) =>
    fetchWithAuth('/api/admin/products', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Customers
  getCustomers: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    
    return fetchWithAuth(`/api/admin/customers${query.toString() ? `?${query}` : ''}`);
  },

  // Reviews
  getReviews: () => fetchWithAuth('/api/admin/reviews'),
  createReview: (data: any) =>
    fetchWithAuth('/api/admin/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteReview: (id: string) =>
    fetchWithAuth(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
    }),

  // Coupons
  getCoupons: () => fetchWithAuth('/api/admin/coupons'),
  createCoupon: (data: { code: string; discountAmount: number }) =>
    fetchWithAuth('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteCoupon: (id: string) =>
    fetchWithAuth(`/api/admin/coupons/${id}`, {
      method: 'DELETE',
    }),

  // Settings
  getSettings: () => fetchWithAuth('/api/admin/settings'),
  updateSettings: (data: any) =>
    fetchWithAuth('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Auth
  login: (username: string, password: string) =>
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    fetchWithAuth('/api/admin/logout', {
      method: 'POST',
    }),

  // Verify token
  verifyToken: () => fetchWithAuth('/api/admin/verify'),
};