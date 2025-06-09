// src/pages/MovementPage.jsx
import { useEffect, useState } from 'react'
import api from '../services/api'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'

export default function MovementPage() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadMovements() {
      try {
        const data = await api.get('/api/movimentacoes')
        setMovements(data)
      } catch (err) {
        console.error('Erro ao buscar movimentações:', err)
        setError('Não foi possível carregar as movimentações.')
      } finally {
        setLoading(false)
      }
    }
    loadMovements()
  }, [])

  if (loading) {
    return <p>Carregando movimentações...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <h2>Movimentações</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
  {movements.map((m, idx) => {
    // Cria o objeto Date a partir do campo correto
    const dataObj = new Date(m.dataMovimentacao)

    // Valida antes de formatar
    const dataFormatada =
      m.dataMovimentacao && !isNaN(dataObj)
        ? dataObj.toLocaleString('pt-BR')
        : 'Data Inválida'

    return (
      <tr key={m.id ?? idx}>
        <td>{dataFormatada}</td>
        <td>{m.tipo}</td>
        <td>{m.quantidade}</td>
        <td>{m.descricao || '-'}</td>
      </tr>
    )
  })}
</tbody>
          </table>
        </main>
      </div>
    </div>
  )
}
