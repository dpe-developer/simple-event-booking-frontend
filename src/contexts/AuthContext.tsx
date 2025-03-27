import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from 'react';
import Cookies from 'js-cookie';
import {
  register as registerService,
  login as loginService,
  fetchUser,
  logout as logoutService
} from '@/services/authService';
import { User, Login, Register } from '@/types/index';

interface AuthContextType {
  user: User | null | false;
  login: ({email, password} : Login) => Promise<User>;
  register: ({name, email, password, passwordConfirmation} : Register) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async ({ email, password }: Login) => {
    return {} as User; // Provide a placeholder implementation
  },
  logout: async () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const token = Cookies.get('token');

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch user data if a token exists
  useEffect(() => {
    if (token) {
      fetchUser()
        .then((userData) => {
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        });
    } else {
      setUser(false);
    }
  }, [token]);

  // TODO: User Registration
  const register = async ({name, email, password, passwordConfirmation}: Register) => {
    try {
      const { user } = await registerService(name, email, password, passwordConfirmation);
      setUser(user);
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Login function
  /* const login = async ({email, password}: Login) => {
    try {
      const { user } = await loginService(email, password);
      setUser(user);
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }; */
  const login = async ({ email, password }: Login): Promise<User> => {
    try {
      const { user } = await loginService(email, password); // Fetch user data from the login service
      setUser(user); // Set the user in the context
      return user; // Return the user object
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };
  

  // Logout function
  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error: any) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};