// src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/** Retorna cabeçalhos de autenticação se existir token em localStorage */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Faz parsing do corpo da resposta e lança erro com a mensagem do servidor, se houver */
async function handleResponse(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; }
  catch { data = text; }
  if (!res.ok) {
    const msg = (data && data.message) || text || res.statusText;
    throw new Error(`Erro ${res.status}: ${msg}`);
  }
  return data;
}

/** Helper genérico para requisições */
async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    mode: 'cors',
    credentials: 'include'
  };
  if (body != null) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  return handleResponse(res);
}

// — Genéricos —
export async function get(path)        { return request('GET',    path); }
export async function post(path, body) { return request('POST',   path, body); }
export async function put(path, body)  { return request('PUT',    path, body); }
export async function del(path)        { return request('DELETE', path); }

// — Autenticação —
export async function login({ email, password }) {
  const result = await post('/auth/login', { email, password });
  if (result.token) localStorage.setItem('token', result.token);
  return result;
}
export async function register({ email, password, nome, role }) {
  return post('/auth/register', { email, password, nome, role });
}
export function logout() {
  localStorage.removeItem('token');
}

// — Dashboard & Inventário —
export async function fetchDashboardStats()     { return get('/api/dashboard/stats'); }
export async function fetchInventorySummary()   { return get('/api/dashboard/summary'); }
export async function fetchInventoryStock()     { return get('/api/inventory/stock'); }
export async function getProductsInStockCount() { return get('/api/inventory/count'); }
export async function getTotalInventoryValue()  { return get('/api/inventory/value'); }
export async function addToInventory({ quadrinhoId, quantidade }) {
  return post('/api/inventory/add', { quadrinhoId, quantidade });
}

// — Catálogo de Quadrinhos (CRUD) —
export async function fetchQuadrinhoCatalog()   { return get('/api/quadrinhos'); }
export async function createQuadrinho(data)     { return post('/api/quadrinhos', data); }
export async function updateQuadrinho(id, data) { return put(`/api/quadrinhos/${id}`, data); }
export async function deleteQuadrinho(id)       { return del(`/api/quadrinhos/${id}`); }
export async function getQuadrinho(id)          { return get(`/api/quadrinhos/${id}`); }
export async function updatePreco(id, body)     { return put(`/api/quadrinhos/${id}/preco`, body); }

// — Movimentações —
export async function fetchMovimentacoes()                    { return get('/api/movimentacoes'); }
export async function fetchMovimentacoesPorTipo(tipo)         { return get(`/api/movimentacoes/tipo/${tipo}`); }
export async function fetchMovimentacoesPorPeriodo(params={}) {
  const qs = new URLSearchParams();
  if (params.inicio) qs.append('inicio', params.inicio.toISOString());
  if (params.fim)    qs.append('fim',    params.fim.toISOString());
  const query = qs.toString() ? `?${qs}` : '';
  return get(`/api/movimentacoes${query}`);
}
export async function fetchMovimentacoesPorInventario(id)     { return get(`/api/movimentacoes/quadrinho/${id}`); }
export async function deleteMovimentacao(id)                  { return del(`/api/movimentacoes/${id}`); }

// — Agrupamento de exports —
export default {
  get, post, put, del,
  login, register, logout,
  fetchDashboardStats, fetchInventorySummary, fetchInventoryStock,
  getProductsInStockCount, getTotalInventoryValue, addToInventory,
  fetchQuadrinhoCatalog, createQuadrinho, updateQuadrinho,
  updatePreco, deleteQuadrinho, getQuadrinho,
  fetchMovimentacoes, fetchMovimentacoesPorTipo, fetchMovimentacoesPorPeriodo,
  fetchMovimentacoesPorInventario, deleteMovimentacao
};
