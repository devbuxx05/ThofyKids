import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

export default function Header() {
    const { totalItems, openCart } = useCart()
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = [
        { to: '/', label: 'Inicio' },
        { to: '/catalogo', label: 'Catálogo' },
        { to: '/nosotros', label: 'Nosotros' },
    ]

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                            <span className="text-white font-display font-bold text-sm">TK</span>
                        </div>
                        <span className="font-display text-xl font-bold text-slate-brand tracking-tight group-hover:text-accent transition-colors">
                            Thofy Kids
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.to === '/'}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${isActive
                                        ? 'bg-accent/10 text-accent'
                                        : 'text-gray-600 hover:text-accent hover:bg-accent/5'
                                    }`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Cart button */}
                        <button
                            id="cart-btn"
                            onClick={openCart}
                            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent/10 transition-colors"
                            aria-label="Abrir carrito"
                        >
                            <FiShoppingBag className="w-5 h-5 text-slate-brand" />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </button>

                        {/* Mobile menu */}
                        <button
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent/10"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menú"
                        >
                            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {menuOpen && (
                <div className="md:hidden border-t border-cream-dark bg-white animate-fadeIn">
                    <nav className="flex flex-col px-4 py-3 gap-1">
                        {navLinks.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.to === '/'}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-accent/10 text-accent' : 'text-gray-600 hover:text-accent'
                                    }`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}
