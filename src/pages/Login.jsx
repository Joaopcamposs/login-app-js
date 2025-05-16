import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLoginFake = (e) => {
    e.preventDefault()
    // Simulação de login (substituir por chamada de API)
    if (email && password) {
      localStorage.setItem('token', 'fake-token')
      navigate('/inicio')
    } else {
      alert('Preencha todos os campos')
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <form className="login-form" onSubmit={handleLoginFake}>
          <div className="logo-container">
            <img src="/logo_blanca.png" alt="Logo" className="logo" />
          </div>
          <h2>Login</h2>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  )
}
