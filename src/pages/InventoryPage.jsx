// src/pages/InventoryPage.jsx
import { useEffect, useState } from 'react'
import api from '../services/api'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'

export default function InventoryPage() {
  const [catalog, setCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [form, setForm] = useState({ quadrinhoId: '', quantidade: 1 })
  const [error, setError] = useState(null)
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [loadingInv, setLoadingInv] = useState(false)

  // 1) Carrega catálogo de quadrinhos
  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoadingCatalog(true)
        const data = await api.fetchQuadrinhoCatalog()
        setCatalog(data)
      } catch {
        setError('Falha ao carregar catálogo de quadrinhos.')
      } finally {
        setLoadingCatalog(false)
      }
    }
    loadCatalog()
  }, [])

  // 2) Carrega estoque atual
  useEffect(() => {
    async function loadInventory() {
      try {
        setLoadingInv(true)
        const data = await api.fetchInventoryStock()
        setInventory(data)
      } catch {
        setError('Falha ao carregar estoque.')
      } finally {
        setLoadingInv(false)
      }
    }
    loadInventory()
  }, [])

  // 3) Adiciona ao inventário e recarrega
  async function handleAdd(e) {
    e.preventDefault()
    setError(null)
    if (!form.quadrinhoId) return

    try {
      setLoadingInv(true)
      await api.addToInventory({
        quadrinhoId: Number(form.quadrinhoId),
        quantidade: form.quantidade
      })
      setForm({ quadrinhoId: '', quantidade: 1 })
      const data = await api.fetchInventoryStock()
      setInventory(data)
    } catch (err) {
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

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleAdd}>
            <label>
              Quadrinho:
              <select
                value={form.quadrinhoId}
                onChange={e =>
                  setForm({ ...form, quadrinhoId: e.target.value })
                }
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
            </label>

            <label>
              Quantidade:
              <input
                type="number"
                min="1"
                value={form.quantidade}
                onChange={e =>
                  setForm({
                    ...form,
                    quantidade: parseInt(e.target.value, 10) || 1
                  })
                }
                required
                disabled={loadingInv}
              />
            </label>

            <button className="button" type="submit" disabled={loadingInv}>
              {loadingInv ? 'Adicionando…' : 'Adicionar'}
            </button>
          </form>

          <h3>Estoque Atual</h3>
          {(loadingInv || loadingCatalog) && <p>Carregando…</p>}
          {!loadingInv && !loadingCatalog && (
            <table className="table">
              <thead>
                <tr>
                  <th>Quadrinho</th>
                  <th>Qtd em estoque</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => {
                  // Aqui faço o lookup no catálogo
                  const q = catalog.find(q => q.id === item.quadrinhoId)
                  return (
                    <tr key={item.quadrinhoId}>
                      <td>
                        {q
                          ? `${q.codigo} — ${q.nome}`
                          : `#${item.quadrinhoId} (não encontrado)`}
                      </td>
                      <td>{item.quantidade}</td>
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
