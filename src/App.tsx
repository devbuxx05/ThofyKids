import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { CartProvider } from './context/CartContext'

// Public layout components
import Header from './components/public/Header'
import Footer from './components/public/Footer'
import Cart from './components/public/Cart'

// Public pages
import Home from './pages/public/Home'
import Catalogo from './pages/public/Catalogo'
import Nosotros from './pages/public/Nosotros'

// Admin components
import PrivateRoute from './components/admin/PrivateRoute'
import AdminLayout from './components/admin/AdminLayout'

// Admin pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Modelos from './pages/admin/Modelos'
import Produccion from './pages/admin/Produccion'
import Costureros from './pages/admin/Costureros'
import Pagos from './pages/admin/Pagos'

function PublicLayout() {
    return (
        <>
            <Header />
            <Cart />
            <Outlet />
            <Footer />
        </>
    )
}

export default function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/catalogo" element={<Catalogo />} />
                        <Route path="/nosotros" element={<Nosotros />} />
                    </Route>

                    {/* Admin Login (unauthenticated) */}
                    <Route path="/admin/login" element={<Login />} />

                    {/* Protected Admin Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="/admin/dashboard" element={<Dashboard />} />
                            <Route path="/admin/modelos" element={<Modelos />} />
                            <Route path="/admin/produccion" element={<Produccion />} />
                            <Route path="/admin/costureros" element={<Costureros />} />
                            <Route path="/admin/pagos" element={<Pagos />} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    )
}
