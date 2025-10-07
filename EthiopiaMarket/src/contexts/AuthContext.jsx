import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = (userData, token) => {
    // Merge user data with token
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const register = (userData, token) => {
    // Merge user data with token
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      register,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

