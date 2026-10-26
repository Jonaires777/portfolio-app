import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL, TOKEN_KEY } from "../utils/constants";

class ApiProvider {
  private instance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
    });

    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Token expirado ou invalido: limpa a sessao e recarrega como visitante
    // (rotas protegidas redirecionam para o login pelo RequireAuth)
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(path: string, options?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.get<T>(path, options);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T, D>(
    path: string,
    data?: D,
    options?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.instance.post<T>(path, data, options);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T, D>(
    path: string,
    data?: D,
    options?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.instance.put<T>(path, data, options);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(
    path: string,
    data?: string,
    options?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.instance.delete<T>(path, options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const apiProvider = new ApiProvider();

export default apiProvider;
