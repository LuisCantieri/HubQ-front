// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react'
import { fetchDashboardStats } from '../services/api.js'
import Header from '../components/Header.jsx'
import Sidebar from '../components/SideBar.jsx'

// importa (ou cole) a parseDate aqui
function parseDate(value) {
  if (value == null) return null
  if (typeof value === 'number') return new Date(value)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value)) {
    return new Date(value + 'Z')
  }
  return new Date(value)
}

export default function DashboardPage() {
  const [stats, setStats] = useState({})

  useEffect(() => {
    fetchDashboardStats()
      .then(data => setStats(data))
      .catch(err => console.error('Erro ao carregar dashboard:', err))
  }, [])

  return (
    <>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <h2>Dashboard</h2>

          {/* cards de estatísticas omissos para brevidade */}

          <section className="movements">
            <h3>Movimentações Recentes</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMovements?.map((m, i) => {
                  const d = parseDate(m.dataMovimentacao)
                  const display = d && !isNaN(d)
                    ? d.toLocaleString('pt-BR')
                    : 'Data Inválida'

                  return (
                    <tr key={i}>
                      <td>{display}</td>
                      <td>{m.tipo}</td>
                      <td>{m.quantidade}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </>
  )
}
