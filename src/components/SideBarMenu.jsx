import './styles/SideBarMenu.css'
import { useNavigate } from 'react-router-dom'

export default function SidebarMenu({ setEntidade }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="sidebar">
      <div className="menu-items">
        <div className="menu-item logo-container">
          <img src="src/templates/favicon-white.png" alt="Logo" className="logo-icon" />
          <div className="menu-label"></div>
        </div>
        <div className="menu-item" onClick={() => setEntidade('inicio')}>📅<div className="menu-label">Início</div></div>
        <div className="menu-item" onClick={() => setEntidade('locacao')}>🏠<div className="menu-label">Locação</div></div>
        <div className="menu-item" onClick={() => setEntidade('pdf_contrato')}>📄<div className="menu-label">PDF</div></div>
        <div className="menu-item" onClick={() => setEntidade('cliente')}>👤<div className="menu-label">Clientes</div></div>
        <div className="menu-item" onClick={() => setEntidade('disponibilidade')}>📦<div className="menu-label">Disponível</div></div>
        <div className="menu-item" onClick={() => setEntidade('traje')}>👗<div className="menu-label">Trajes</div></div>
        <div className="menu-item" onClick={() => setEntidade('acessorio')}>🧢<div className="menu-label">Acessórios</div></div>
        <div className="menu-item" onClick={() => setEntidade('usuario')}>🛠️<div className="menu-label">Usuários</div></div>
      </div>
      <div className="logout-button" onClick={handleLogout}>🚪<div className="menu-label">Sair</div></div>
    </div>
  )
}
