import { AxiosRequestConfig } from 'axios';
import { ReactNode } from 'react';

export type Methods = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface ConnectionProps {
  post: (path: string, data?: any, config?: AxiosRequestConfig, extraUrl?: string) => Promise<any>;
  put: (path: string, data?: any, config?: AxiosRequestConfig) => Promise<any>;
  get: (path: string, config?: AxiosRequestConfig, extraUrl?: string) => Promise<any>;
  patch: (path: string, data?: any, config?: AxiosRequestConfig) => Promise<any>;
  delete: (path: string, data?: any, config?: AxiosRequestConfig) => Promise<any>;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  removeTokens: () => void;
  refreshTokenIfNeeded: () => Promise<boolean>;
  token?: string;
  statServerUrl?: string;
}

export interface ConnectionContextProviderProps {
  serverURL: string;
  statServerUrl?: string;
  t: (key: string) => string;
  children: ReactNode;
}
