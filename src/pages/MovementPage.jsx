// src/pages/MovementPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';

export default function MovementPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function load() {
      if (!localStorage.getItem('token')) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }
      try {
        const data = await api.fetchMovimentacoes();
        setMovements(data || []);
      } catch (err) {
        setError('Não foi possível carregar as movimentações.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Carregando movimentações...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="app-layout">
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main-content">
          <h2>Movimentações</h2>
          {movements.length === 0
            ? <p>Nenhuma movimentação encontrada.</p>
            : (
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
                  {movements.map(m => {
                    const dt = new Date(m.dataMovimentacao);
                    return (
                      <tr key={m.id}>
                        <td>{isNaN(dt) ? '-' : dt.toLocaleString('pt-BR')}</td>
                        <td>{m.tipo}</td>
                        <td>{m.quantidade}</td>
                        <td>{m.descricao || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          }
        </main>
      </div>
    </div>
  );
}
