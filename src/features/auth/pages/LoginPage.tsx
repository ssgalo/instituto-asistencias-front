import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/apiClient';
import logoInstituto from '../../../assets/logo-instituto.jpg';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/login', {
        usuario,
        contrasena,
      });

      if (response.data && response.data.datos && response.data.datos.token) {
        login(response.data.datos.token);
        // La redirección será manejada por las rutas protegidas
        navigate('/');
      } else {
        setError(response.data.errores || 'Respuesta inesperada del servidor.');
      }
    } catch (err) {
      setError('Error de conexión o credenciales incorrectas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <img src={logoInstituto} alt="Logo Instituto" className="h-20 w-auto mx-auto mb-8" />
        <div className="bg-slate-700 shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center text-white mb-6">Iniciar Sesión</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-slate-300">Usuario</label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-slate-300">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 disabled:bg-teal-800 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;