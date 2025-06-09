// src/pages/QuadrinhosCatalogPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'
import api from '../services/api'

export default function QuadrinhosCatalogPage() {
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        // fetchQuadrinhoCatalog já retorna o array de quadrinhos
        const quadrinhos = await api.fetchQuadrinhoCatalog()
        setCatalog(quadrinhos)
      } catch (err) {
        console.error('Erro ao carregar catálogo:', err)
        setError('Não foi possível carregar o catálogo.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p>Carregando catálogo...</p>
  if (error)   return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <div
            className="main-header"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <h2>Catálogo de Quadrinhos</h2>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Raridade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((q) => (
                <tr key={q.id}>
                  <td>{q.id}</td>
                  <td>{q.codigo}</td>
                  <td>{q.nome}</td>
                  <td>R$ {Number(q.preco ?? 0).toFixed(2)}</td>
                  <td>{q.raridade}</td>
                  <td>
                    <button
                      className="btnAddInv"
                      onClick={() =>
                        navigate(`/add-to-inventory?quadrinhoId=${q.id}`)
                      }
                    >
                      Adicionar ao Inventário
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
              className="btnAddQuad"
              style={{ marginLeft: '1rem' }}
              onClick={() => navigate('/add-quadrinho')}
            >
              Adicionar Quadrinho
            </button>
        </main>
      </div>
    </div>
  )
}
