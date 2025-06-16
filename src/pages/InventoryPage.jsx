import { useEffect, useState } from 'react'
import api from '../services/api'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'

export default function InventoryPage() {
  const [catalog, setCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [form, setForm] = useState({ quadrinhoId: '', quantidade: 1 })
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [loadingInv, setLoadingInv] = useState(false)

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoadingCatalog(true)
        const data = await api.fetchQuadrinhoCatalog()
        setCatalog(data)
      } catch (err) {
        console.error('Erro ao carregar catálogo:', err)
        setError('Falha ao carregar catálogo de quadrinhos.')
      } finally {
        setLoadingCatalog(false)
      }
    }
    loadCatalog()
  }, [])

  useEffect(() => {
    loadInventory()
  }, [])

  async function loadInventory() {
    try {
      setLoadingInv(true)
      const data = await api.fetchInventoryStock()
      setInventory(data)
    } catch (err) {
      console.error('Erro ao carregar estoque:', err)
      setError('Falha ao carregar estoque.')
    } finally {
      setLoadingInv(false)
    }
  }

  async function handleAddOrUpdate(e) {
    e.preventDefault()
    setError(null)
    if (!form.quadrinhoId) return

    try {
      setLoadingInv(true)
      const { quadrinhoId, quantidade } = form

      if (editing) {
        // Ajuste de estoque
        await api.put(
          `/api/inventory/adjust/${quadrinhoId}`,
          {
            newQuantity: quantidade,
            description: 'Ajuste manual pelo usuário'
          }
        )
      } else {
        // Nova entrada
        await api.addToInventory({
          quadrinhoId: Number(quadrinhoId),
          quantidade
        })
      }

      setForm({ quadrinhoId: '', quantidade: 1 })
      setEditing(false)
      await loadInventory()
    } catch (err) {
      console.error('Erro ao adicionar/atualizar:', err)
      setError(err.message)
    } finally {
      setLoadingInv(false)
    }
  }

  function handleEdit(item) {
    setForm({
      quadrinhoId: String(item.quadrinho.id),
      quantidade: item.quantidade
    })
    setEditing(true)
  }

  async function handleDelete(item) {
    if (!window.confirm('Tem certeza que deseja remover este item do inventário?')) return
    try {
      setLoadingInv(true)
      await api.del(`/api/inventory/delete/${item.quadrinho.id}`)
      await loadInventory()
    } catch (err) {
      console.error('Erro ao excluir:', err)
      setError(err.message)
    } finally {
      setLoadingInv(false)
    }
  }

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <h2>Inventário</h2>
          {error && <p className="error">{error}</p>}

          <form className="form" onSubmit={handleAddOrUpdate}>
            <div className="form-group">
              <label htmlFor="quadrinho">Quadrinho:</label>
              <select
                id="quadrinho"
                value={form.quadrinhoId}
                onChange={e => setForm({ ...form, quadrinhoId: e.target.value })}
                required
                disabled={loadingCatalog}
              >
                <option value="">Selecione um quadrinho</option>
                {catalog.map(q => (
                  <option key={q.id} value={q.id}>
                    {q.codigo} — {q.nome} — R$ {Number(q.preco ?? 0).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantidade">Quantidade:</label>
              <input
                id="quantidade"
                type="number"
                min="1"
                value={form.quantidade}
                onChange={e =>
                  setForm({ ...form, quantidade: parseInt(e.target.value, 10) || 1 })
                }
                required
                disabled={loadingInv}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="button" type="submit" disabled={loadingInv}>
                {loadingInv
                  ? editing
                    ? 'Atualizando…'
                    : 'Adicionando…'
                  : editing
                  ? 'Atualizar'
                  : 'Adicionar'}
              </button>
              {editing && (
                <button
                  type="button"
                  className="button cancel"
                  onClick={() => {
                    setForm({ quadrinhoId: '', quantidade: 1 })
                    setEditing(false)
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <h3>Estoque Atual</h3>
          {(loadingInv || loadingCatalog) && <p>Carregando…</p>}

          {!loadingInv && !loadingCatalog && (
            <table className="table">
              <thead>
                <tr>
                  <th>Quadrinho</th>
                  <th>Qtd em estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => {
                  const q = catalog.find(q => q.id === item.quadrinho.id)
                  return (
                    <tr key={item.id}>
                      <td>
                        {q
                          ? `${q.codigo} — ${q.nome}`
                          : `#${item.quadrinho.id} (não encontrado)`}
                      </td>
                      <td>{item.quantidade}</td>
                      <td>
                        <button onClick={() => handleEdit(item)} className="button">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(item)} className="button delete">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  )
}
