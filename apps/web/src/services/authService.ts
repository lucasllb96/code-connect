import { fetchApi } from './api';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authService = {
  registerUser: async (data: RegisterRequest): Promise<AuthUser> => {
    return fetchApi<AuthUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  loginUser: async (data: LoginRequest): Promise<LoginResponse> => {
    return fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async (): Promise<AuthUser> => {
    return fetchApi<AuthUser>('/auth/me', {
      method: 'GET',
    });
  },
};
