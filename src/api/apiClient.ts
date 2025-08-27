import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor para agregar el token JWT a cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, no hace nada
  (error) => {
    // Si la respuesta es un error 401 (No Autorizado), significa que el token es inválido o expiró
    if (error.response && error.response.status === 401) {
      // Limpiamos el token del storage
      localStorage.removeItem('authToken');
      // Redirigimos al usuario a la página de login
      window.location.href = '/login';
    }
    // Devolvemos el error para que otros componentes puedan manejarlo si es necesario
    return Promise.reject(error);
  }
);

export default apiClient;