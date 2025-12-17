import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenService } from './tokenService';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupAxiosInterceptors = (serverURL: string) => {
  axios.defaults.baseURL = serverURL;

  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = TokenService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      // If error is not 401 or request already retried, reject
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = TokenService.getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${serverURL}/national/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;
        TokenService.setToken(newAccessToken);
        TokenService.setRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);
        return await axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        TokenService.clearTokens();
        window.location.href = '/login';
        return await Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
  );
};
