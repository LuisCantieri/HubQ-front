// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/api.js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const res = await login({ email, password })
      const token = res.token || res.accessToken
      if (!token) throw new Error('Token não encontrado')
      localStorage.setItem('token', token)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Login falhou.')
    }
  }

  return (
    <div className="main">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="button" type="submit">
          Entrar
        </button>
      </form>
      <p>
        Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  )
}
