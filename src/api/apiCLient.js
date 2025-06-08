import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const isLoginRequest =
      error.config?.url?.includes('/auth/login') &&
      error.config?.method === 'post';

    if (!isLoginRequest && error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);


export const deleteAccount = async () => {
  return await api.delete("/delete");
};

export default api;
