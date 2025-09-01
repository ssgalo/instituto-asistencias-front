// src/context/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id_asistente: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getInitialUser = (): User | null => {
    const storedToken = localStorage.getItem('authToken');
    try {
      if (storedToken) {
        return jwtDecode<User>(storedToken);
      }
    } catch (error) {
      // Si el token es inválido, lo limpiamos
      localStorage.removeItem('authToken');
      return null;
    }
    return null;
  };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<User | null>(getInitialUser());

  const login = (newToken: string) => {
    try {
      const decodedUser: User = jwtDecode(newToken);
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(decodedUser);
    } catch (error) {
      console.error("Error al decodificar el nuevo token:", error);
      logout();
    }
  };

  const logout = (shouldNavigate = true) => { 
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    if (shouldNavigate) {
      window.location.href = '/login';
    }
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};