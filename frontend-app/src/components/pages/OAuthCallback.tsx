import { useEffect, useRef } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const OAuthCallback: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    // StrictMode executa o efeito duas vezes em desenvolvimento
    if (handled.current) {
      return;
    }
    handled.current = true;

    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
    // Remove o token da barra de endereco e do historico
    window.history.replaceState(null, "", window.location.pathname);

    if (!token) {
      navigate("/login?error=oauth", { replace: true });
      return;
    }

    signIn(token)
      .then(() => navigate("/", { replace: true }))
      .catch(() => navigate("/login?error=oauth", { replace: true }));
  }, [signIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
};

export default OAuthCallback;
