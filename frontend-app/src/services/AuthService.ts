import apiProvider from "../providers/ApiProviver";
import { BASE_URL } from "../utils/constants";

export type Usuario = {
  id: string;
  nome: string;
  email: string | null;
  avatarUrl: string | null;
};

export type AuthResponse = {
  token: string;
  usuario: Usuario;
};

type LoginRequest = {
  email: string;
  senha: string;
};

type RegisterRequest = {
  nome: string;
  email: string;
  senha: string;
};

type ResetPasswordRequest = {
  token: string;
  senha: string;
};

export const GITHUB_LOGIN_URL = `${BASE_URL}/oauth2/authorization/github`;

const login = async (loginRequest: LoginRequest): Promise<AuthResponse> => {
  return apiProvider.post<AuthResponse, LoginRequest>(
    "/api/auth/login",
    loginRequest
  );
};

const register = async (
  registerRequest: RegisterRequest
): Promise<AuthResponse> => {
  return apiProvider.post<AuthResponse, RegisterRequest>(
    "/api/auth/register",
    registerRequest
  );
};

const me = async (): Promise<Usuario> => {
  return apiProvider.get<Usuario>("/api/auth/me");
};

const forgotPassword = async (email: string): Promise<void> => {
  await apiProvider.post<void, { email: string }>(
    "/api/auth/forgot-password",
    { email }
  );
};

const resetPassword = async (
  resetPasswordRequest: ResetPasswordRequest
): Promise<void> => {
  await apiProvider.post<void, ResetPasswordRequest>(
    "/api/auth/reset-password",
    resetPasswordRequest
  );
};

// Extrai a mensagem de erro enviada pelo backend ({ message: "..." })
export const getErrorMessage = (error: unknown, fallback: string): string => {
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return message || fallback;
};

const authService = {
  login,
  register,
  me,
  forgotPassword,
  resetPassword,
};

export default authService;
