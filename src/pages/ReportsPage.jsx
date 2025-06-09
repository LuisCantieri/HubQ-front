// src/pages/ReportsPage.jsx
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'
import api from '../services/api'

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadReports() {
      try {
        // Ajuste aqui se o endpoint for outro, ex: fetchDashboardStats()
        const data = await api.fetchInventorySummary()
        setReportData(data)
      } catch (err) {
        console.error('Erro ao carregar relatórios:', err)
        setError('Não foi possível carregar os relatórios.')
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  if (loading) {
    return <p>Carregando relatórios...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  // Desestruturação segura com defaults
  const {
    totalValue = 0,
    totalItems = 0,
    byCategory = []
  } = reportData || {}

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <h2>Relatórios de Inventário</h2>

          <section className="report-summary" style={{ marginBottom: '2rem' }}>
            <div>
              <strong>Valor Total em Estoque:</strong>{' '}
              R$ {Number(totalValue).toFixed(2)}
            </div>
            <div>
              <strong>Total de Itens:</strong> {totalItems}
            </div>
          </section>

          <section className="report-by-category">
            <h3>Estoque por Categoria</h3>
            {byCategory.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {byCategory.map((cat) => (
                    <tr key={cat.category}>
                      <td>{cat.category}</td>
                      <td>{cat.count}</td>
                      <td>R$ {Number(cat.value).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhuma categoria encontrada.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
