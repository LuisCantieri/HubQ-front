const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080"

/**
 * Retorna cabeçalhos de autenticação se existir token em localStorage
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Faz parsing do corpo da resposta e lança erro com a mensagem do servidor, se houver
 */
async function handleResponse(res) {
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!res.ok) {
    const msg = (data && data.message) || text || res.statusText
    throw new Error(`Erro ${res.status}: ${msg}`)
  }
  return data
}

/**
 * Helper genérico para requisições
 */
async function request(method, path, body) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    mode: 'cors'
  }
  if (body != null) opts.body = JSON.stringify(body)
  const res = await fetch(`${API_BASE}${path}`, opts)
  return handleResponse(res)
}

// — Genéricos —

export async function get(path) {
  return request('GET', path)
}

export async function post(path, body) {
  return request('POST', path, body)
}

export async function put(path, body) {
  return request('PUT', path, body)
}

export async function del(path) {
  return request('DELETE', path)
}

// — Autenticação —

export async function login({ email, password }) {
  const result = await post('/auth/login', { email, password })
  if (result.token) localStorage.setItem('token', result.token)
  return result
}

export async function register({ email, password, nome, role }) {
  return post('/auth/register', { email, password, nome, role })
}

export function logout() {
  localStorage.removeItem('token')
}

// — Dashboard & Inventário —

export async function fetchDashboardStats() {
  return get('/api/dashboard/stats')
}

export async function fetchInventorySummary() {
  return get('/api/dashboard/summary')
}

export async function fetchInventoryStock() {
  return get('/api/inventory/stock')
}

export async function addToInventory({ quadrinhoId, quantidade }) {
  return post('/api/inventory/add', { quadrinhoId, quantidade })
}

// — Catálogo de Quadrinhos CRUD —

export async function fetchQuadrinhoCatalog() {
  return get('/api/quadrinho')
}

/** 
 * @param {{ codigo: string, nome: string, preco: number, raridade: string, urlImagem: string }} data 
 */
export async function createQuadrinho(data) {
  return post('/api/quadrinho', data)
}

/**
 * @param {number} id 
 */
export async function deleteQuadrinho(id) {
  return del(`/api/quadrinho/${id}`)
}

/**
 * @param {number} id 
 * @param {{ codigo?: string, nome?: string, preco?: number, raridade?: string, urlImagem?: string }} data 
 */
export async function updateQuadrinho(id, data) {
  return put(`/api/quadrinho/${id}`, data)
}

/**
 * @param {number} id 
 */
export async function getQuadrinho(id) {
  return get(`/api/quadrinho/${id}`)
}

export default {
  // genéricos
  get, post, put, del,
  // auth
  login, register, logout,
  // dashboard/inventory
  fetchDashboardStats, fetchInventorySummary, fetchInventoryStock, addToInventory,
  // quadrinhos
  fetchQuadrinhoCatalog, createQuadrinho, updateQuadrinho, deleteQuadrinho, getQuadrinho
}