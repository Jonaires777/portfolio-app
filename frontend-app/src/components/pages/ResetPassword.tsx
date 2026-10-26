import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import authService, { getErrorMessage } from "../../services/AuthService";

type FormData = {
  senha: string;
  confirmarSenha: string;
};

const ResetPassword: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async ({ senha }: FormData) => {
    if (!token) {
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      await authService.resetPassword({ token, senha });
      setDone(true);
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível redefinir a senha. Tente novamente."));
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Link inválido">
        <Alert
          type="error"
          showIcon
          message="Este link de redefinição é inválido."
        />
        <p className="text-sm text-center text-slate-500 mt-6 mb-0">
          <Link to="/forgot-password">Solicitar um novo link</Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Nova senha" subtitle="Escolha uma nova senha para a sua conta">
      {done ? (
        <>
          <Alert type="success" showIcon message="Senha alterada com sucesso!" />
          <Link to="/login">
            <Button type="primary" block size="large" className="mt-4">
              Ir para o login
            </Button>
          </Link>
        </>
      ) : (
        <>
          {error && <Alert type="error" showIcon className="mb-4" message={error} />}
          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label="Nova senha"
              name="senha"
              rules={[{ required: true, min: 8, message: "A senha deve ter pelo menos 8 caracteres" }]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              label="Confirmar nova senha"
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
              Salvar nova senha
            </Button>
          </Form>
        </>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
