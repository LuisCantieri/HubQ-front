  import { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import Header from '../components/Header';
  import Sidebar from '../components/SideBar';
  import api from '../services/api';

  export default function QuadrinhosCatalogPage() {
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      async function load() {
        try {
          const quadrinhos = await api.fetchQuadrinhoCatalog();
          setCatalog(quadrinhos);
        } catch (err) {
          console.error('Erro ao carregar catálogo:', err);
          setError('Não foi possível carregar o catálogo.');
        } finally {
          setLoading(false);
        }
      }
      load();
    }, []);

    const handleDelete = async (id) => {
      if (!window.confirm('Tem certeza que deseja excluir este quadrinho?')) return;
      try {
        await api.deleteQuadrinho(id);
        setCatalog((prev) => prev.filter(q => q.id !== id));
        alert('Quadrinho excluído com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir quadrinho:', err);
        alert('Erro ao excluir quadrinho: ' + err.message);
      }
    };

    if (loading) return <p>Carregando catálogo...</p>;
    if (error)   return <p style={{ color: 'red' }}>{error}</p>;

    return (
      <div>
        <Header />
        <div className="container">
          <Sidebar />
          <main className="main">
            <div className="main-header" style={{ display: 'flex', alignItems: 'center' }}>
              <h2>Catálogo de Quadrinhos</h2>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagem</th>
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
                    <td>
                      {q.urlImagem
                        ? <img
                            src={q.urlImagem}
                            alt={q.nome}
                            style={{ width: '60px', height: 'auto', borderRadius: '4px' }}
                          />
                        : <span>—</span>
                      }
                    </td>
                    <td>{q.codigo}</td>
                    <td>{q.nome}</td>
                    <td>R$ {Number(q.preco ?? 0).toFixed(2)}</td>
                    <td>{q.raridade}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className="btnEdit"
                          onClick={() => navigate(`/edit-quadrinho/${q.id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="btnAddInv"
                          onClick={() => navigate(`/add-to-inventory?quadrinhoId=${q.id}`)}
                        >
                          Adicionar ao Inventário
                        </button>
                        <button
                          className="btnDelete"
                          onClick={() => handleDelete(q.id)}
                        >
                          Excluir
                        </button>
                      </div>
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
    );
  }
