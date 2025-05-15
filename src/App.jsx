import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Inicio'


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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/inicio/*" element={<InicioProtegido/>} />
      </Routes>
    </BrowserRouter>
  )
}
