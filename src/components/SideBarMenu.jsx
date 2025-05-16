import './styles/SideBarMenu.css'
import { useNavigate } from 'react-router-dom'

export default function SidebarMenu() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleClick = (entidade) => {
    if (entidade === 'inicio') {
      navigate(`/inicio`);
    } else if (entidade === 'contrato') {
      navigate(`/inicio/contrato/`);
    } else if (entidade === 'disponibilidades') {
      navigate(`/inicio/disponibilidades/`);
    } 
    else {
      navigate(`/inicio/${entidade}/consultar`);  // sempre começa em consultar
    }
  };

  return (
    <div className="sidebar">
      <div className="menu-items">
        <div className="menu-item logo-container">
          <img src="/favicon-white.png" alt="Logo" className="logo-icon" />
          <div className="menu-label"></div>
        </div>
        <div className="menu-item" onClick={() => handleClick('inicio')}>📅<div className="menu-label">Início</div></div>
        <div className="menu-item" onClick={() => handleClick('locacao')}>✒️<div className="menu-label">Locação</div></div>
        <div className="menu-item" onClick={() => handleClick('contrato')}>📄<div className="menu-label">Contrato</div></div>
        <div className="menu-item" onClick={() => handleClick('clientes')}>👤<div className="menu-label">Clientes</div></div>
        <div className="menu-item" onClick={() => handleClick('disponibilidades')}>✅<div className="menu-label">Disponível</div></div>
        <div className="menu-item" onClick={() => handleClick('trajes')}>👗<div className="menu-label">Trajes</div></div>
        <div className="menu-item" onClick={() => handleClick('acessorios')}>🧢<div className="menu-label">Acessórios</div></div>
        <div className="menu-item" onClick={() => handleClick('usuarios')}>👨‍💼<div className="menu-label">Usuários</div></div>
      </div>
      <div className="logout-button" onClick={handleLogout}>🚪<div className="menu-label">Sair</div></div>
    </div>
  )
}
