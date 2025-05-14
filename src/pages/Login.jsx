import { useState } from 'react'
import { api } from '../services/api'
import { saveToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const response = await api.post('/login', { email, password })
      saveToken(response.data.token)
      navigate('/dashboard')
    } catch {
      alert('Login falhou')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  )
}
