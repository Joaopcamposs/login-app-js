import { useEffect, useState } from 'react'
import './styles/Dashboard.css'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const SidebarMenu = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="sidebar">
      <div className="menu-items">
        <div className="menu-item logo-container">
          <img src="src/pages/styles/templates/favicon-white.png" alt="Logo" className="logo-icon" />
          <div className="menu-label"></div>
        </div>
        <div className="menu-item">🏠<div className="menu-label">Locação</div></div>
        <div className="menu-item">📄<div className="menu-label">PDF</div></div>
        <div className="menu-item">👤<div className="menu-label">Clientes</div></div>
        <div className="menu-item">📦<div className="menu-label">Disponível</div></div>
        <div className="menu-item">👗<div className="menu-label">Trajes</div></div>
        <div className="menu-item">🧢<div className="menu-label">Acessórios</div></div>
        <div className="menu-item">🛠️<div className="menu-label">Usuários</div></div>
      </div>
      <div className="logout-button" onClick={handleLogout}>🚪<div className="menu-label">Sair</div></div>
    </div>
  )
}

// Dados fake para fallback
const dadosFake = [
  {
    cliente: 'João da Silva',
    dama: 'Maria Oliveira',
    idade: 25,
    data_retirada: '2023-01-01',
    data_evento: '2023-01-05',
    valor_restante: 1000,
    observacoes: 'Observações sobre a locação',
    codigos_trajes: '1234567890',
    descricao_trajes: 'Descrição dos trajes',
    tamanhos: 'M, L, XL',
    codigos_acessorios: '1234567890',
    descricao_acessorios: 'Descrição dos acessórios',
  },
  {
    cliente: 'Pedro Santos',
    dama: 'Ana Costa',
    idade: 28,
    data_retirada: '2023-01-02',
    data_evento: '2023-01-06',
    valor_restante: 1500,
    observacoes: 'Traje para casamento',
    codigos_trajes: '9876543210',
    descricao_trajes: 'Terno completo',
    tamanhos: 'G, GG',
    codigos_acessorios: '9876543210',
    descricao_acessorios: 'Gravata e sapatos',
  }
]

export default function Dashboard() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [locacoes, setLocacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const today = new Date()
    const sunday = new Date()
    sunday.setDate(today.getDate() + (7 - today.getDay()))

    setStartDate(today.toISOString().slice(0, 10))
    setEndDate(sunday.toISOString().slice(0, 10))

    const fetchLocacoes = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get('/api/locacoes')
        // Se a resposta for inválida ou vazia, usa dados fake
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          setLocacoes(dadosFake)
          setError('Exibindo dados falsos temporários')
        } else {
          setLocacoes(response.data)
        }
      } catch (err) {
        setError('Não foi possível carregar as locações')
        setLocacoes(dadosFake)
      } finally {
        setLoading(false)
      }
    }

    fetchLocacoes()
  }, [])

  // Renderização condicional para diferentes estados
  const renderContent = () => {
    if (loading) {
      return <div className="loading-message">Carregando locações...</div>
    }

    // Garante que locacoes seja um array antes de usar .map
    const locacoesArray = Array.isArray(locacoes) ? locacoes : []

    if (locacoesArray.length === 0) {
      return <div className="empty-message">Nenhuma locação encontrada para o período selecionado</div>
    }

    return (
      <table className="locacoes-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Dama</th>
            <th>Idade</th>
            <th>Data Retirada</th>
            <th>Data Evento</th>
            <th>Valor Restante</th>
            <th>Observações</th>
            <th>Códigos Trajes</th>
            <th>Descrição Trajes</th>
            <th>Tamanhos</th>
            <th>Códigos Acessórios</th>
            <th>Descrição Acessórios</th>
          </tr>
        </thead>
        <tbody>
          {locacoesArray.map((item, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'linha-par' : 'linha-impar'}>
              <td>{item.cliente}</td>
              <td>{item.dama}</td>
              <td>{item.idade}</td>
              <td>{item.data_retirada}</td>
              <td>{item.data_evento}</td>
              <td>{item.valor_restante}</td>
              <td>{item.observacoes}</td>
              <td>{item.codigos_trajes}</td>
              <td>{item.descricao_trajes}</td>
              <td>{item.tamanhos}</td>
              <td>{item.codigos_acessorios}</td>
              <td>{item.descricao_acessorios}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className="dashboard">
      <SidebarMenu />
      <div className="main-content">
        <h1>Locações dos próximos dias:</h1>

        <div className="filters">
          <label>De:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>Até:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          {error && <span className="error-text">* {error}</span>}
        </div>

        {renderContent()}
      </div>
    </div>
  )
}
