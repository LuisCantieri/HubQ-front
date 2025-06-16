import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'
import api from '../services/api'

export default function ReportsPage() {
  const [stock, setStock]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function loadReports() {
      try {
        const items = await api.fetchInventoryStock()
        // garante que quadrinho.preco exista e seja número
        const normalized = items.map(i => ({
          quantidade: i.quantidade || 0,
          quadrinho: {
            ...i.quadrinho,
            preco: Number(i.quadrinho?.preco) || 0
          }
        }))
        setStock(normalized)
      } catch (err) {
        console.error('Erro ao carregar relatórios:', err)
        setError('Não foi possível carregar os relatórios.')
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  if (loading) return <p>Carregando relatórios...</p>
  if (error)   return <p style={{ color: 'red' }}>{error}</p>

  // Totais
  const totalItems = stock.reduce((sum, i) => sum + i.quantidade, 0)
  const totalValue = stock
    .reduce((sum, i) => sum + i.quantidade * i.quadrinho.preco, 0)
    .toFixed(2)

  // Agrupa por categoria (raridade)
  const byCategory = stock.reduce((acc, i) => {
    const cat   = i.quadrinho.raridade || 'Sem categoria'
    const qty   = i.quantidade
    const price = i.quadrinho.preco

    if (!acc[cat]) acc[cat] = { quantidade: 0, valor: 0 }
    acc[cat].quantidade += qty
    acc[cat].valor      += qty * price

    return acc
  }, {})

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <h2>Relatórios de Inventário</h2>

          {/* RESUMO GERAL */}
          <section className="report-summary" style={{ marginBottom: '2rem' }}>
            <div>
              <strong>Valor Total em Estoque:</strong> R$ {totalValue}
            </div>
            <div>
              <strong>Total de Itens:</strong> {totalItems}
            </div>
          </section>

          {/* LISTA DETALHADA */}
          <section className="report-details" style={{ marginBottom: '2rem' }}>
            <h3>Detalhamento por Quadrinho</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Quantidade</th>
                  <th>Preço Unitário (R$)</th>
                  <th>Valor Total (R$)</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.quadrinho.nome}</td>
                    <td>{i.quantidade}</td>
                    <td>{i.quadrinho.preco.toFixed(2)}</td>
                    <td>{(i.quantidade * i.quadrinho.preco).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* AGRUPADO POR CATEGORIA */}
          <section className="report-by-category">
            <h3>Por Categoria</h3>
            <table className="table">
              <thead>
                <tr>
                
                  <th>Itens</th>
                  <th>Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byCategory).map(([cat, data]) => (
                  <tr key={cat}>
             
                    <td>{data.quantidade}</td>
                    <td>{data.valor.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  )
}
