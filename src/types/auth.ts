import type { User } from "firebase/auth";
import type { ReactNode } from "react";

export type AuthMode = "login" | "register";

export interface AuthViewState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthViewModel {
  email: string;
  password: string;
  mode: AuthMode;
  loading: boolean;
  error: string | null;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSubmit: () => Promise<void>;
  toggleMode: () => void;
}

export interface AuthContextValue {
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
