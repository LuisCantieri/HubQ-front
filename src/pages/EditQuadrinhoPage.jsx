import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/SideBar';
import api from '../services/api';

export default function EditQuadrinhoPage() {
  const { id } = useParams();
  const [codigo, setCodigo]       = useState('');
  const [nome, setNome]           = useState('');
  const [preco, setPreco]         = useState('');
  const [raridade, setRaridade]   = useState('');
  const [urlImagem, setUrlImagem] = useState('');
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadQuadrinho() {
      try {
        const quadrinho = await api.getQuadrinho(id);
        if (!quadrinho || typeof quadrinho !== 'object') {
          throw new Error('Resposta inválida da API.');
        }
        setCodigo(quadrinho.codigo || '');
        setNome(quadrinho.nome || '');
        setPreco(quadrinho.preco?.toString() || '');
        setRaridade(quadrinho.raridade || '');
        setUrlImagem(quadrinho.urlImagem || '');
      } catch (err) {
        console.error('Erro ao carregar quadrinho:', err);
        setError('Não foi possível carregar os dados do quadrinho.');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadQuadrinho();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    const dto = { codigo, nome, raridade, urlImagem };
    const novoPreco = parseFloat(preco);

    try {
      // atualiza campos básicos (sem preço)
      await api.updateQuadrinho(id, dto);
      // atualiza preço e propaga no inventário
      await api.updatePreco(id, { novoPreco });
      alert('Quadrinho atualizado com sucesso!');
      navigate('/catalog');
    } catch (err) {
      console.error('Erro ao atualizar quadrinho:', err);
      setError('Falha ao atualizar: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container">
          <Sidebar />
          <main className="main">
            <p>Carregando dados do quadrinho...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <h2>Editar Quadrinho</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="codigo">Código*</label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nome">Nome*</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="preco">Preço (R$)*</label>
              <input
                id="preco"
                type="number"
                step="0.01"
                value={preco}
                onChange={e => setPreco(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="raridade">Raridade</label>
              <input
                id="raridade"
                type="text"
                value={raridade}
                onChange={e => setRaridade(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="urlImagem">URL da Imagem</label>
              <input
                id="urlImagem"
                type="url"
                value={urlImagem}
                onChange={e => setUrlImagem(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="button">
                Atualizar
              </button>
              <button
                type="button"
                className="button"
                style={{ backgroundColor: '#666' }}
                onClick={() => navigate('/catalog')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
