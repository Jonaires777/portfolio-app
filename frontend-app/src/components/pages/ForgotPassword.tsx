import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import authService, { getErrorMessage } from "../../services/AuthService";

type FormData = {
  email: string;
};

const ForgotPassword: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async ({ email }: FormData) => {
    setSubmitting(true);
    setError(undefined);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível enviar o e-mail. Tente novamente."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Esqueci minha senha"
      subtitle="Enviaremos um link para você criar uma nova senha"
    >
      {sent ? (
        <Alert
          type="success"
          showIcon
          message="Verifique o seu e-mail"
          description="Se existir uma conta com este e-mail, você receberá um link para redefinir a senha. O link expira em 30 minutos."
        />
      ) : (
        <>
          {error && <Alert type="error" showIcon className="mb-4" message={error} />}
          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[{ required: true, type: "email", message: "Informe um e-mail válido" }]}
            >
              <Input autoComplete="email" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
              Enviar link
            </Button>
          </Form>
        </>
      )}
      <p className="text-sm text-center text-slate-500 mt-6 mb-0">
        <Link to="/login">Voltar para o login</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
