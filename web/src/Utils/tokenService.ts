const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const TokenService = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
