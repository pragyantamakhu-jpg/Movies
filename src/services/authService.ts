import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { auth } from "./firebaseService";

type FirebaseAuthError = {
  code?: string;
};

const getReadableAuthError = (action: string, error: unknown): Error => {
  const code = (error as FirebaseAuthError)?.code;

  const messages: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/operation-not-allowed": "Email and password sign-in is not enabled.",
    "auth/weak-password": "The password is too weak.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account was found for this email.",
    "auth/wrong-password": "The email or password is incorrect.",
  };

  if (code && messages[code]) {
    return new Error(messages[code]);
  }

  if (error instanceof Error) {
    return new Error(`Failed to ${action}: ${error.message}`);
  }

  return new Error(`Failed to ${action}. Please try again.`);
};

export const registerUser = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return credential.user;
  } catch (error) {
    throw getReadableAuthError("register user", error);
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    throw getReadableAuthError("log in", error);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw getReadableAuthError("log out", error);
  }
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void,
): Unsubscribe => onAuthStateChanged(auth, callback);
