import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { authService, type AuthUser, type LoginRequest, type RegisterRequest } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cc_token'));
  const [isLoading, setIsLoading] = useState<boolean>(!!localStorage.getItem('cc_token'));

  const logout = useCallback(() => {
    localStorage.removeItem('cc_token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchUser();
    }
  }, [token, fetchUser]);

  const login = async (data: LoginRequest) => {
    const response = await authService.loginUser(data);
    const newToken = response.access_token;
    
    localStorage.setItem('cc_token', newToken);
    setToken(newToken);
    
    const userData = await authService.getMe();
    setUser(userData);
  };

  const register = async (data: RegisterRequest) => {
    await authService.registerUser(data);
    await login({ email: data.email, password: data.password });
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
