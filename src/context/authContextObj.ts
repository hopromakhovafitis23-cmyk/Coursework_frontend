import { createContext } from 'react';
import type { User } from './AuthContext';

export interface AuthContextType {
  user: User | null;
  register: (nickname: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
