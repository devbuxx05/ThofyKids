import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
    FiGrid, FiPackage, FiTool, FiUsers, FiCreditCard,
    FiLogOut, FiMenu, FiX, FiChevronRight
} from 'react-icons/fi'
import { supabase } from '../../lib/supabase'

const navItems = [
    { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
    { to: '/admin/modelos', icon: FiPackage, label: 'Modelos' },
    { to: '/admin/produccion', icon: FiTool, label: 'Producción' },
    { to: '/admin/costureros', icon: FiUsers, label: 'Costureros' },
    { to: '/admin/pagos', icon: FiCreditCard, label: 'Pagos' },
]

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/admin/login')
    }

    const Sidebar = ({ mobile = false }) => (
        <aside
            className={`${mobile
                    ? 'fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white shadow-2xl animate-slideIn'
                    : 'hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0'
                }`}
        >
            {/* Logo */}
            <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <span className="text-white font-display font-bold text-sm">TK</span>
                    </div>
                    <div>
                        <p className="font-display font-bold text-slate-brand text-sm leading-none">Thofy Kids</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Panel Administrativo</p>
                    </div>
                </div>
                {mobile && (
                    <button onClick={() => setSidebarOpen(false)}>
                        <FiX className="w-5 h-5 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={() => mobile && setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `admin-sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                        <FiChevronRight className="w-3 h-3 ml-auto opacity-40" />
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-all"
                >
                    <FiLogOut className="w-4 h-4" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            {sidebarOpen && <Sidebar mobile />}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center gap-4 sticky top-0 z-30">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-50"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <FiMenu className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-accent font-bold text-xs">A</span>
                        </div>
                        <span className="text-sm text-gray-600 hidden sm:block">Admin</span>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
