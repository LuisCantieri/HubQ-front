import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'
import api from '../services/api'

export default function AddToInventoryPage() {
  const [params] = useSearchParams()
  const quadrinhoId = params.get('quadrinhoId')
  const [quadrinho, setQuadrinho] = useState(null)
  const [quantidade, setQuantidade] = useState(1)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadQuadrinho() {
      if (!quadrinhoId) {
        setError('ID de quadrinho inválido.')
        return
      }
      try {
        setLoading(true)
        // usa a função dedicada do service
        const data = await api.getQuadrinho(Number(quadrinhoId))
        setQuadrinho(data)
      } catch (err) {
        console.error('Erro ao carregar quadrinho:', err)
        setError('Não foi possível carregar o quadrinho.')
      } finally {
        setLoading(false)
      }
    }
    loadQuadrinho()
  }, [quadrinhoId])

  async function handleAdd(e) {
    e.preventDefault()
    setError(null)
    try {
      setLoading(true)
      await api.addToInventory({
        quadrinhoId: Number(quadrinhoId),
        quantidade
      })
      navigate('/inventory')
    } catch (err) {
      console.error('Erro ao adicionar ao inventário:', err)
      setError('Falha ao adicionar ao inventário.')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !quadrinho) {
    return (
      <div>
        <Header />
        <div className="container">
          <Sidebar />
          <main className="main">
            {loading ? <p>Carregando…</p> : <p>ID inválido.</p>}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <h2>Adicionar ao Inventário</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p>
            <strong>
              {quadrinho.codigo} — {quadrinho.nome}
            </strong>{' '}
            (R$ {Number(quadrinho.preco ?? 0).toFixed(2)})
          </p>
          <form onSubmit={handleAdd} className="form">
            <div className="form-group">
              <label htmlFor="quantidade">Quantidade:</label>
              <input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={e => setQuantidade(parseInt(e.target.value, 10) || 1)}
                required
                disabled={loading}
              />
            </div>
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Adicionando…' : 'Adicionar'}
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}
