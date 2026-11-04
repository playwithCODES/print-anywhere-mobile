
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import authService from "@/services/auth.service";

// Types
type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore existing session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.restoreSession();

        setUser(currentUser);
      } catch (error) {
        console.log("SESSION RESTORE ERROR:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login
  const signIn = async (email: string, password: string) => {
    const authenticatedUser = await authService.login(
      email,
      password
    );

    setUser(authenticatedUser);
  };

  // Register
  const signUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    const registeredUser = await authService.register(
      name,
      email,
      password
    );

    setUser(registeredUser);
  };

  // Logout
  const signOut = async () => {
    await authService.logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}
