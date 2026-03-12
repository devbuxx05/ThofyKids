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

    const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
        <aside
            className={`${mobile
                ? 'fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-admin-bg shadow-2xl animate-slideIn'
                : 'hidden lg:flex flex-col w-64 shrink-0 bg-admin-bg border-r border-border h-screen sticky top-0'
            }`}
        >
            <div className="px-5 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-text-primary text-sm leading-none">
                        <span className="text-accent">T</span>hofy Kids
                    </span>
                    <p className="text-[10px] text-text-muted mt-0.5 ml-1">Panel Admin</p>
                </div>
                {mobile && (
                    <button onClick={() => setSidebarOpen(false)} className="p-1 text-text-muted hover:text-text-primary">
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>

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

            <div className="px-3 py-4 border-t border-border">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[6px] text-sm font-medium text-danger hover:bg-danger/10 transition-all"
                >
                    <FiLogOut className="w-4 h-4" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    )

    return (
        <div className="min-h-screen bg-bg flex">
            <Sidebar />

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden
                />
            )}

            {sidebarOpen && <Sidebar mobile />}

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-admin-bg border-b border-border px-4 sm:px-6 h-14 flex items-center gap-4 sticky top-0 z-30">
                    <button
                        className="lg:hidden p-2 rounded-[6px] text-text-muted hover:text-text-primary hover:bg-surface"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <FiMenu className="w-5 h-5" />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[6px] bg-accent/10 flex items-center justify-center">
                            <span className="text-accent font-bold text-xs">A</span>
                        </div>
                        <span className="text-sm text-text-muted hidden sm:block">Admin</span>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-bg">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
