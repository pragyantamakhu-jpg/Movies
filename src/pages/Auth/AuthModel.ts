import type { User } from "firebase/auth";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../../services/authService";
import type { AuthViewState } from "../../types/auth";

export const initialAuthState: AuthViewState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

const validateCredentials = (email: string, password: string): string => {
  if (!email.trim()) {
    throw new Error("Email is required.");
  }

  if (!password.trim()) {
    throw new Error("Password is required.");
  }

  if (password.length < 6) {
    throw new Error("Password must contain at least six characters.");
  }

  return email.trim().toLowerCase();
};

export const register = async (
  email: string,
  password: string,
): Promise<User> =>
  registerUser(validateCredentials(email, password), password);

export const login = async (email: string, password: string): Promise<User> =>
  loginUser(validateCredentials(email, password), password);

export const logout = async (): Promise<void> => logoutUser();
