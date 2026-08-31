import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "firebase/auth";
import { logoutUser, subscribeToAuthChanges } from "../services/authService";
import type { AuthContextValue, AuthProviderProps } from "../types/auth";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await logoutUser();
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-neutral-300">
        Loading authentication...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
