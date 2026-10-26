import { useState } from "react";
import { Alert, Button, Divider, Form, Input } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import authService, {
  getErrorMessage,
  GITHUB_LOGIN_URL,
} from "../../services/AuthService";
import { useAuth } from "../../contexts/AuthContext";

type FormData = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

const Register: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ nome, email, senha }: FormData) => {
    setSubmitting(true);
    setError(undefined);
    try {
      const response = await authService.register({ nome, email, senha });
      await signIn(response.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível criar a conta. Tente novamente."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Criar conta" subtitle="Comece a organizar seus fornecedores">
      {error && <Alert type="error" showIcon className="mb-4" message={error} />}
      <Button icon={<GithubOutlined />} block size="large" href={GITHUB_LOGIN_URL}>
        Continuar com GitHub
      </Button>
      <Divider plain>ou</Divider>
      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label="Nome"
          name="nome"
          rules={[{ required: true, whitespace: true, message: "Informe o seu nome" }]}
        >
          <Input autoComplete="name" />
        </Form.Item>
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
          rules={[{ required: true, min: 8, message: "A senha deve ter pelo menos 8 caracteres" }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="Confirmar senha"
          name="confirmarSenha"
          dependencies={["senha"]}
          rules={[
            { required: true, message: "Confirme a sua senha" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("senha") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("As senhas não coincidem"));
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
          Criar conta
        </Button>
      </Form>
      <p className="text-sm text-center text-slate-500 mt-6 mb-0">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
