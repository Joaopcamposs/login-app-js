import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/Login.css'
import useAxiosWithTimeout from '../services/AxiosWithTimeout'
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const { makeRequest } = useAxiosWithTimeout();
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await makeRequest({
        url: '/api/token',
        data: { username: email, password: password },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      });

      if (response.status === 200 && response.data) {
        const accessToken = response.data;
        if (accessToken) {
          // Armazena o token
          localStorage.setItem('token', response.data.access_token);
          // Se o token for verdadeiro, redireciona para a tela inicial
          navigate('/inicio');
        }
      }
    } catch (erro) {
      setMensagemErro(`Erro ao realizar login: ${erro}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <form className="login-form" onSubmit={handleLogin}>
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
          <ErrorMessage message={mensagemErro} />
          <button type="submit" className="login-button">{isLoading ? 'Entrando...' : 'Entrar'}</button>
        </form>
      </div>
    </div>
  )
}
