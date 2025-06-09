// src/pages/RegisterPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

export default function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')   // valor default
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    try {
      await register({ nome, email, password, role })
      navigate('/login')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Cadastro falhou.')
    }
  }

  return (
    <div className="main">
      <h2>Registrar</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label>Nome:</label>
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </div>

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

        <div>
          <label>Perfil:</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          >
            <option value="USER">Usuário</option>
            <option value="ADMIN">Administrador</option>
            {/* ajuste as opções conforme seu StatusRole */}
          </select>
        </div>

        <button className="button" type="submit">Cadastrar</button>
      </form>

      <p>
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  )
}
