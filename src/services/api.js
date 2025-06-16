import axios from 'axios';

// Base URL configuration
const API_BASE = import.meta.env.VITE_API_URL ||
  'https://hubq-gzfhhrg0acgqhfh5.brazilsouth-01.azurewebsites.net/api';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // include cookies if needed
});

// Attach authentication token to each request if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic request wrapper
async function request(method, path, body = null) {
  try {
    const response = await apiClient({
      method,
      url: path,
      data: body,
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    const msg = (data && data.message) || error.message || error.toString();
    throw new Error(`Erro ${status}: ${msg}`);
  }
}

// — Genéricos —
export async function get(path)    { return request('GET',    path); }
export async function post(path, body) { return request('POST',   path, body); }
export async function put(path, body)  { return request('PUT',    path, body); }
export async function del(path)        { return request('DELETE', path); }

// — Autenticação —
export async function login({ email, password }) {
  const result = await post('/auth/login', { email, password });
  if (result.token) {
    localStorage.setItem('token', result.token);
  }
  return result;
}

export async function register({ email, password, nome, role }) {
  return post('/auth/register', { email, password, nome, role });
}

export function logout() {
  localStorage.removeItem('token');
}

// — Dashboard & Inventário —
export async function fetchDashboardStats()   { return get('/dashboard/stats'); }
export async function fetchInventorySummary() { return get('/dashboard/summary'); }
export async function fetchInventoryStock()   { return get('/inventory/stock'); }
export async function getProductsInStockCount() { return get('/inventory/count'); }
export async function getTotalInventoryValue()  { return get('/inventory/value'); }
export async function addToInventory({ quadrinhoId, quantidade }) {
  return post('/inventory/add', { quadrinhoId, quantidade });
}

// — Catálogo de Quadrinhos (CRUD) —
export async function fetchQuadrinhoCatalog() { return get('/quadrinhos'); }
export async function createQuadrinho(data)   { return post('/quadrinhos', data); }
export async function updateQuadrinho(id, data) { return put(`/quadrinhos/${id}`, data); }
export async function deleteQuadrinho(id)     { return del(`/quadrinhos/${id}`); }
export async function getQuadrinho(id)        { return get(`/quadrinhos/${id}`); }
export async function updatePreco(id, body)   { return put(`/quadrinhos/${id}/preco`, body); }

// — Movimentações —
export async function fetchMovimentacoes()                  { return get('/movimentacoes'); }
export async function fetchMovimentacoesPorTipo(tipo)       { return get(`/movimentacoes/tipo/${tipo}`); }
export async function fetchMovimentacoesPorPeriodo(params = {}) {
  const qs = new URLSearchParams();
  if (params.inicio) qs.append('inicio', params.inicio.toISOString());
  if (params.fim)    qs.append('fim',    params.fim.toISOString());
  const query = qs.toString() ? `?${qs}` : '';
  return get(`/movimentacoes${query}`);
}
export async function fetchMovimentacoesPorInventario(id)   { return get(`/movimentacoes/quadrinho/${id}`); }
export async function deleteMovimentacao(id)                { return del(`/movimentacoes/${id}`); }

// — Agrupamento de exports —
export default {
  get, post, put, del,
  login, register, logout,
  fetchDashboardStats, fetchInventorySummary, fetchInventoryStock,
  getProductsInStockCount, getTotalInventoryValue, addToInventory,
  fetchQuadrinhoCatalog, createQuadrinho, updateQuadrinho,
  updatePreco, deleteQuadrinho, getQuadrinho,
  fetchMovimentacoes, fetchMovimentacoesPorTipo, fetchMovimentacoesPorPeriodo,
  fetchMovimentacoesPorInventario, deleteMovimentacao,
};