// Mock API service for development
// This allows testing the frontend without a backend server

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

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class MockApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('acero_token');
  }

  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateMockToken(): string {
    return 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9);
  }

  private generateMockRefreshToken(): string {
    return 'mock-refresh-token-' + Math.random().toString(36).substr(2, 9);
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    await this.delay(800); // Simulate network delay

    // Mock validation - accept any email/password for demo
    if (!credentials.email || !credentials.password) {
      return { error: 'Email and password are required' };
    }

    // Mock user data
    const mockUser: User = {
      id: 'mock-user-123',
      email: credentials.email,
      name: credentials.email.split('@')[0] || 'Demo User',
      phone: '+263 77 463 7836',
      company: 'Demo Company',
      email_verified: true,
      created_at: new Date().toISOString()
    };

    const token = this.generateMockToken();
    const refreshToken = this.generateMockRefreshToken();

    // Store in localStorage
    this.token = token;
    localStorage.setItem('acero_token', token);
    localStorage.setItem('acero_refresh_token', refreshToken);
    localStorage.setItem('acero_user', JSON.stringify(mockUser));

    return {
      data: {
        user: mockUser,
        token,
        refreshToken
      }
    };
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    await this.delay(1000); // Simulate network delay

    // Mock validation
    if (!userData.email || !userData.password || !userData.name) {
      return { error: 'Email, password, and name are required' };
    }

    // Mock user data
    const mockUser: User = {
      id: 'mock-user-' + Date.now(),
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      company: userData.company,
      email_verified: false,
      created_at: new Date().toISOString()
    };

    const token = this.generateMockToken();
    const refreshToken = this.generateMockRefreshToken();

    // Store in localStorage
    this.token = token;
    localStorage.setItem('acero_token', token);
    localStorage.setItem('acero_refresh_token', refreshToken);
    localStorage.setItem('acero_user', JSON.stringify(mockUser));

    return {
      data: {
        user: mockUser,
        token,
        refreshToken
      }
    };
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    await this.delay(300);

    // Clear localStorage
    this.token = null;
    localStorage.removeItem('acero_token');
    localStorage.removeItem('acero_refresh_token');
    localStorage.removeItem('acero_user');

    return {
      data: { message: 'Logout successful' }
    };
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    await this.delay(400);

    const userStr = localStorage.getItem('acero_user');
    if (!userStr) {
      return { error: 'User not found' };
    }

    const user = JSON.parse(userStr);
    return { data: { user } };
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    await this.delay(600);

    const userStr = localStorage.getItem('acero_user');
    if (!userStr) {
      return { error: 'User not found' };
    }

    const user = { ...JSON.parse(userStr), ...updates };
    localStorage.setItem('acero_user', JSON.stringify(user));

    return { data: { user } };
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    await this.delay(300);

    const refreshToken = localStorage.getItem('acero_refresh_token');
    if (!refreshToken) {
      return { error: 'No refresh token available' };
    }

    const newToken = this.generateMockToken();
    this.token = newToken;
    localStorage.setItem('acero_token', newToken);

    return { data: { token: newToken } };
  }

  // Mock product methods
  async getProducts(): Promise<ApiResponse<any[]>> {
    await this.delay(500);
    return { data: [] }; // Products are handled by the frontend data
  }

  async getProduct(id: string): Promise<ApiResponse<any>> {
    await this.delay(300);
    return { data: { id, name: 'Mock Product' } };
  }

  // Mock order methods
  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    await this.delay(800);
    return { 
      data: { 
        id: 'mock-order-' + Date.now(),
        ...orderData,
        status: 'pending',
        created_at: new Date().toISOString()
      } 
    };
  }

  async getOrders(): Promise<ApiResponse<any[]>> {
    await this.delay(500);
    return { data: [] };
  }

  async getOrder(id: string): Promise<ApiResponse<any>> {
    await this.delay(300);
    return { data: { id, status: 'pending' } };
  }

  // Mock contact methods
  async submitInquiry(inquiryData: any): Promise<ApiResponse<any>> {
    await this.delay(600);
    return { 
      data: { 
        id: 'mock-inquiry-' + Date.now(),
        ...inquiryData,
        status: 'received',
        created_at: new Date().toISOString()
      } 
    };
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
export const mockApiService = new MockApiService();

// Export types
export type { User, AuthResponse, LoginCredentials, RegisterData, ApiResponse };
