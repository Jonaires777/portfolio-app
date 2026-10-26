import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import authService, { Usuario } from "../services/AuthService";
import { TOKEN_KEY } from "../utils/constants";

type AuthContextType = {
  usuario: Usuario | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUsuario(null);
  }, []);

  const signIn = useCallback(async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUsuario(await authService.me());
  }, []);

  useEffect(() => {
    const loadUsuario = async () => {
      if (!localStorage.getItem(TOKEN_KEY)) {
        setLoading(false);
        return;
      }
      try {
        setUsuario(await authService.me());
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
