import { useNavigate } from 'react-router-dom'
import { removeToken } from '../utils/auth'

export default function Dashboard() {
  const navigate = useNavigate()

  function handleLogout() {
    removeToken()
    navigate('/')
  }

  return (
    <div>
      <h1>Bem-vindo!</h1>
      <button onClick={handleLogout}>Sair</button>
    </div>
  )
}
