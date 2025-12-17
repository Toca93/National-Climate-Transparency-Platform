import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt_decode from 'jwt-decode';
import { TokenService } from '../../Utils/tokenService';
import { setupAxiosInterceptors } from '../../Utils/axiosInterceptor';
import {
  ConnectionContextProviderProps,
  ConnectionProps,
  Methods,
} from '../../Definitions/connectionContext.definitions';

const ConnectionContext = createContext<{
  connection?: ConnectionProps;
}>({});

export const ConnectionContextProvider: FC<ConnectionContextProviderProps> = (
  props: ConnectionContextProviderProps
) => {
  const [token, setToken] = useState<string>();
  const { serverURL, t, statServerUrl, children } = props;

  // Initialize axios interceptors
  useEffect(() => {
    setupAxiosInterceptors(serverURL);
  }, [serverURL]);

  const send = useCallback(
    (method: Methods, path: string, data?: any, config?: AxiosRequestConfig, extraUrl?: string) => {
      return new Promise((resolve, reject) => {
        const url = `${extraUrl ? extraUrl : serverURL}/${path}`;
        let headers: any;
        const currentToken = TokenService.getToken() || token;

        if (currentToken) {
          headers = { authorization: `Bearer ${currentToken}` };
        } else {
          headers = {
            authorization: `Bearer ${process.env.STORYBOOK_ACCESS_TOKEN}`,
          };
        }

        axios({
          method,
          url,
          data,
          headers,
          ...config,
        })
          .then((response: AxiosResponse) => {
            if (response.status) {
              if (response.status === 200 || response.status === 201) {
                resolve({
                  status: response.status,
                  data: response.data.data ?? response.data,
                  response: response,
                  statusText: 'SUCCESS',
                  message: response.data.message,
                });
              } else if (response.status === 422) {
                reject({
                  status: response.status,
                  data: response.data?.data,
                  statusText: 'ERROR',
                  response: response,
                  message: response.data.message,
                  errors: response.data?.errors,
                });
              }
            } else {
              reject({
                status: 500,
                statusText: 'UNKNOWN',
                message: t('common:systemError'),
              });
            }
          })
          .catch((e: any) => {
            if (e.response) {
              if (e.response.status) {
                if (e.response.data.message === 'user deactivated') {
                  localStorage.setItem('userState', '0');
                }

                reject({
                  status: e.response.status,
                  statusText: 'ERROR',
                  errors: e.response.data?.errors,
                  message: e.response.data.message,
                });
              } else {
                reject({
                  statusText: 'ERROR',
                  message: t('common:systemError'),
                });
              }
            } else {
              reject({
                statusText: 'ERROR',
                message: t('common:networkError'),
              });
            }
          });
      }) as any;
    },
    [token, serverURL]
  );

  const post = useCallback(
    (path: string, data?: any, config?: AxiosRequestConfig, extraUrl?: string) => {
      return send('post', path, data, config, extraUrl);
    },
    [send]
  );

  const put = useCallback(
    (path: string, data?: any, config?: AxiosRequestConfig) => {
      return send('put', path, data, config);
    },
    [send]
  );

  const get = useCallback(
    (path: string, config?: AxiosRequestConfig, extraUrl?: string) => {
      return send('get', path, undefined, config, extraUrl);
    },
    [send]
  );

  const patch = useCallback(
    (path: string, data?: any, config?: AxiosRequestConfig) => {
      return send('patch', path, data, config);
    },
    [send]
  );

  const del = useCallback(
    (path: string, data?: any, config?: AxiosRequestConfig) => {
      return send('delete', path, data, config);
    },
    [send]
  );

  const updateTokens = useCallback((accessToken: string, refreshToken: string) => {
    TokenService.setToken(accessToken);
    TokenService.setRefreshToken(refreshToken);
    setToken(accessToken);
  }, []);

  const removeTokens = useCallback(() => {
    TokenService.clearTokens();
    setToken(undefined);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }, []);

  const refreshTokenIfNeeded = async () => {
    console.log('Refreshing Token');
    try {
      const refreshToken = TokenService.getRefreshToken();
      if (!refreshToken) return false;

      const response = await post('national/auth/refresh', { refresh_token: refreshToken });
      if (response.status === 200 || response.status === 201) {
        const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;
        updateTokens(newAccessToken, newRefreshToken);
        return true;
      }
      return false;
    } catch (error) {
      removeTokens();
      return false;
    }
  };

  // Token expiry check
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (token) {
      const { exp } = jwt_decode(token) as any;
      const diff = exp * 1000 - Date.now();

      if (diff <= 0) {
        // Token already expired, try to refresh immediately
        refreshTokenIfNeeded().catch(() => removeTokens());
      } else {
        // Token valid, set timeout to refresh before expiry
        const refreshDelay = Math.max(0, diff - 60000); // Refresh 1 minute before expiry

        timeoutId = setTimeout(() => {
          console.log('Refreshing Token Automatically');
          refreshTokenIfNeeded().catch(() => removeTokens());
        }, refreshDelay);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [token]);

  return (
    <ConnectionContext.Provider
      value={{
        connection: {
          post,
          put,
          get,
          patch,
          delete: del,
          updateTokens,
          removeTokens,
          refreshTokenIfNeeded,
          token,
          statServerUrl,
        },
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionContext;

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  return context.connection!;
};
