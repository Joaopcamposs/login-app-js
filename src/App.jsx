import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import { SnackbarProvider } from 'notistack'
import axios from 'axios';

export const API_V1_PREFIX = '/api/v1';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.timeout = 30000; // Timeout de 30 segundos

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Accept = 'application/json';
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Função que verifica se o usuário está autenticado
const isAuthenticated = () => {
  // Verifica se o token está presente no localStorage ou em qualquer outro local
  // que você esteja armazenando
  const token = localStorage.getItem('token');
  return !!token; // Retorna true se o token estiver presente, false caso contrário
};

// Componente de "Inicio" protegido
const InicioProtegido = () => (isAuthenticated() ? <Inicio/> : <Navigate to="/login"/>);

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
  <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login"/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/inicio/*" element={<InicioProtegido/>} />
          <Route path="/test" element={<div>OK</div>}/>
      <Route path="/sentry-test" element={<div><button
        type="button"
        onClick={() => {
          throw new Error('Sentry Test Error');
        }}
      >
        Break the world
      </button></div>}/>
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  )
}
