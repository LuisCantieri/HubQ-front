import { Routes, Route, Navigate } from 'react-router-dom'

// Páginas
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import InventoryPage from './pages/InventoryPage'
import MovementPage from './pages/MovementPage'
import ReportsPage from './pages/ReportsPage'
import QuadrinhosCatalogPage from './pages/QuadrinhosCatalogPage'
import AddToInventoryPage from './pages/addToInventoryPage'
import AddQuadrinhoPage from './pages/AddQuadrinhoPage'
import EditQuadrinhoPage from './pages/EditQuadrinhoPage'  // <-- novo import

function Private({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Autenticação */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Área protegida */}
      <Route
        path="/"
        element={
          <Private>
            <DashboardPage />
          </Private>
        }
      />
      <Route
        path="/inventory"
        element={
          <Private>
            <InventoryPage />
          </Private>
        }
      />
      <Route
        path="/movements"
        element={
          <Private>
            <MovementPage />
          </Private>
        }
      />
      <Route
        path="/reports"
        element={
          <Private>
            <ReportsPage />
          </Private>
        }
      />

      {/* Catálogo e adição */}
      <Route
        path="/catalog"
        element={
          <Private>
            <QuadrinhosCatalogPage />
          </Private>
        }
      />
      <Route
        path="/add-to-inventory"
        element={
          <Private>
            <AddToInventoryPage />
          </Private>
        }
      />

      {/* Rota: adicionar quadrinho */}
      <Route
        path="/add-quadrinho"
        element={
          <Private>
            <AddQuadrinhoPage />
          </Private>
        }
      />

      {/* Nova rota: editar quadrinho */}
      <Route
        path="/edit-quadrinho/:id"
        element={
          <Private>
            <EditQuadrinhoPage />
          </Private>
        }
      />

      {/* Redirecionamento padrão */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}