const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  data?: any;
}

async function fetchAPI<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...restOptions } = options;
  
  const config: RequestInit = {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || result.message || 'API Request failed');
    }

    // Since backend interceptor wraps everything in { success, data, message }, we extract it
    return result.data !== undefined ? result.data : result;
  } catch (error: any) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  auth: {
    sendOtp: (mobile: string) => fetchAPI('/api/auth/send-otp', { method: 'POST', data: { mobile } }),
    verifyOtp: (mobile: string, otp: string) => fetchAPI('/api/auth/verify-otp', { method: 'POST', data: { mobile, otp } }),
    logout: () => fetchAPI('/api/auth/logout', { method: 'POST' }),
  },
  
  // Products
  products: {
    getAll: (params?: string) => fetchAPI(`/api/products${params ? `?${params}` : ''}`),
    getBySlug: (slug: string) => fetchAPI(`/api/products/${slug}`),
  },

  // Cart
  cart: {
    merge: (items: any[]) => fetchAPI('/api/cart/merge', { method: 'POST', data: { items } }),
  },

  // Orders
  orders: {
    getAll: () => fetchAPI('/api/orders'),
    getById: (id: string) => fetchAPI(`/api/orders/${id}`),
    create: (addressId: string, paymentMethod: string) => fetchAPI('/api/orders', { method: 'POST', data: { addressId, paymentMethod } }),
  },

  // Addresses
  addresses: {
    getAll: () => fetchAPI('/api/addresses'),
    create: (data: any) => fetchAPI('/api/addresses', { method: 'POST', data }),
  }
};
