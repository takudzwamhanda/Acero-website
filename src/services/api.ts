// Acero Steel Supply - API Service
// Frontend API client for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  email_verified: boolean;
  created_at: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  company?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('acero_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error. Please check your connection.' };
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('acero_token', response.data.token);
      localStorage.setItem('acero_refresh_token', response.data.refreshToken);
      localStorage.setItem('acero_user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('acero_token', response.data.token);
      localStorage.setItem('acero_refresh_token', response.data.refreshToken);
      localStorage.setItem('acero_user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const refreshToken = localStorage.getItem('acero_refresh_token');
    
    const response = await this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Clear local storage regardless of response
    this.token = null;
    localStorage.removeItem('acero_token');
    localStorage.removeItem('acero_refresh_token');
    localStorage.removeItem('acero_user');

    return response;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile');
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem('acero_refresh_token');
    
    if (!refreshToken) {
      return { error: 'No refresh token available' };
    }

    const response = await this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('acero_token', response.data.token);
    }

    return response;
  }

  // Products methods
  async getProducts(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/products');
  }

  async getProduct(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/products/${id}`);
  }

  // Orders methods
  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/orders');
  }

  async getOrder(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/orders/${id}`);
  }

  // Contact methods
  async submitInquiry(inquiryData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('acero_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('acero_token');
    localStorage.removeItem('acero_refresh_token');
    localStorage.removeItem('acero_user');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Export types
export type { User, AuthResponse, LoginCredentials, RegisterData, ApiResponse };
