import { useContext } from 'react';
import { AuthContext } from '../context/authContextObj';
import type { AuthContextType } from '../context/authContextObj';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
