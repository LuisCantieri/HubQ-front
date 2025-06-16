// src/pages/AddQuadrinhoPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/SideBar'
import api from '../services/api'

export default function AddQuadrinhoPage() {
  const [codigo, setCodigo] = useState('')
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [raridade, setRaridade] = useState('')
  const [urlImagem, setUrlImagem] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Monta payload de acordo com sua entidade Quadrinho
    const payload = {
      codigo,
      nome,
      preco: parseFloat(preco),
      raridade,
      urlImagem
    }

    try {
      await api.createQuadrinho(payload)
      alert('Quadrinho criado com sucesso!')
      navigate('/catalog')
    } catch (err) {
      console.error('Erro ao adicionar quadrinho:', err)
      setError(err.message)
    }
  }

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <main className="main">
          <h2>Adicionar Novo Quadrinho</h2>
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
            <button type="submit" className="button">
              Salvar
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}
