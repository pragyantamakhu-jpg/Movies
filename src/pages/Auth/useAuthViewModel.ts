import { useCallback, useState } from "react";
import { login, register } from "./AuthModel";
import type { AuthMode, AuthViewModel } from "../../types/auth";

const useAuthViewModel = (): AuthViewModel => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }

      setPassword("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Authentication failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [email, mode, password]);

  const toggleMode = useCallback((): void => {
    setMode((currentMode) => (currentMode === "login" ? "register" : "login"));
    setError(null);
  }, []);

  return {
    email,
    password,
    mode,
    loading,
    error,
    setEmail,
    setPassword,
    handleSubmit,
    toggleMode,
  };
};

export default useAuthViewModel;
