import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header>
      <div className="container">
        <h1>Sistema de Inventário de Quadrinhos</h1>
      </div>
      <div>
        <button className="button" onClick={logout}>Sair</button>
      </div>
    </header>
  )
}
