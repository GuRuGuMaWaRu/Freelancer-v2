import {
  useEffect,
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  IResponseUserData,
  ILoginFormInputs,
  IRegisterFormInputs,
} from "shared/types";
import { FullPageSpinner } from "shared/ui/FullPageSpinner/FullPageSpinner";
import { config } from "shared/const";
import { apiClient } from "shared/api";
import { useNotification } from "app";

interface IAuthContext {
  user: IResponseUserData | null;
  login: (data: ILoginFormInputs) => Promise<IResponseUserData>;
  signup: (data: IRegisterFormInputs) => Promise<IResponseUserData>;
  logout: () => void;
}

type AuthStatus = "loading" | "ready";

const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const notify = useNotification();

  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<IResponseUserData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapUser() {
      const token = localStorage.getItem(config.LOCAL_STORAGE_KEY);

      if (!token) {
        setStatus("ready");
        return;
      }

      try {
        const res = await apiClient.get<IResponseUserData>("users/getUser");

        if (!cancelled) setUser(res.data);
      } catch (error) {
        if (cancelled) return;

        console.error(error);

        let message = "Could not restore your session.";

        if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
        ) {
          message = error.message;
        }

        notify.showWarning(message);
      } finally {
        if (!cancelled) setStatus("ready");
      }
    }

    bootstrapUser();

    return () => {
      cancelled = true;
    };
  }, [notify]);

  const signup = async (data: IRegisterFormInputs) => {
    const res = await apiClient.post<IResponseUserData>("users/signup", {
      data,
    });

    localStorage.setItem(config.LOCAL_STORAGE_KEY, res.data.token);
    setUser(res.data);

    return res.data;
  };

  const login = async (data: ILoginFormInputs) => {
    const res = await apiClient.post<IResponseUserData>("users/login", {
      data,
    });

    localStorage.setItem(config.LOCAL_STORAGE_KEY, res.data.token);
    setUser(res.data);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem(config.LOCAL_STORAGE_KEY);
    queryClient.clear();
    setUser(null);
  };

  if (status === "loading") {
    return <FullPageSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context == null) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
