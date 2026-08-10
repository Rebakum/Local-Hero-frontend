import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Both the access token and refresh token live in httpOnly cookies
// (withCredentials: true sends them automatically), so we never read or
// store tokens in JS. When a request comes back 401, we hit
// /auth/refresh-token once (which reads the refreshToken cookie and sets
// fresh cookies), then retry the original request exactly once.
//
// Concurrent 401s while a refresh is already in flight all wait on the
// same refresh promise instead of each firing their own refresh call.
let refreshPromise: Promise<void> | null = null;

const requestRefresh = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post('/auth/refresh-token')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh-token');

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        await requestRefresh();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token is invalid/expired too — genuinely logged out.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
