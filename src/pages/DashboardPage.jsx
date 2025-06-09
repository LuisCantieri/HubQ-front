// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react'
import { fetchDashboardStats } from '../services/api.js'
import Header from '../components/Header.jsx'
import Sidebar from '../components/SideBar.jsx'

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

          <div className="stats-cards">
            <div className="card">
              <h3>Valor Total</h3>
              <p>R$ {stats.totalValue?.toFixed(2)}</p>
            </div>
            <div className="card">
              <h3>Produtos em Estoque</h3>
              <p>{stats.productsInStock}</p>
            </div>
          </div>

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
                {stats.recentMovements?.map((m, i) => (
                  <tr key={i}>
                    <td>{new Date(m.dataHora).toLocaleString()}</td>
                    <td>{m.tipo}</td>
                    <td>{m.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </>
  )
}
