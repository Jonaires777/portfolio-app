import { useState } from "react";
import { Alert, Button, Divider, Form, Input } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import authService, {
  getErrorMessage,
  GITHUB_LOGIN_URL,
} from "../../services/AuthService";
import { useAuth } from "../../contexts/AuthContext";

type FormData = {
  email: string;
  senha: string;
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [searchParams] = useSearchParams();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from || "/";
  const oauthError = searchParams.get("error") === "oauth";

  const handleSubmit = async (values: FormData) => {
    setSubmitting(true);
    setError(undefined);
    try {
      const response = await authService.login(values);
      await signIn(response.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível entrar. Tente novamente."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Entrar" subtitle="Acesse sua conta para gerenciar fornecedores">
      {(error || oauthError) && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          message={error || "Não foi possível entrar com o GitHub."}
        />
      )}
      <Button icon={<GithubOutlined />} block size="large" href={GITHUB_LOGIN_URL}>
        Continuar com GitHub
      </Button>
      <Divider plain>ou</Divider>
      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label="E-mail"
          name="email"
          rules={[{ required: true, type: "email", message: "Informe um e-mail válido" }]}
        >
          <Input autoComplete="email" />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="senha"
          rules={[{ required: true, message: "Informe a sua senha" }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <div className="flex justify-end -mt-3 mb-4">
          <Link to="/forgot-password" className="text-sm">
            Esqueci minha senha
          </Link>
        </div>
        <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
          Entrar
        </Button>
      </Form>
      <p className="text-sm text-center text-slate-500 mt-6 mb-0">
        Não tem conta? <Link to="/register">Criar conta</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
