import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

export default function Header() {
    const { totalItems, openCart } = useCart()
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const navLinks = [
        { to: '/', label: 'Inicio' },
        { to: '/catalogo', label: 'Catálogo' },
        { to: '/nosotros', label: 'Nosotros' },
    ]

    return (
        <header
            className={`sticky top-0 z-50 bg-bg border-b border-border transition-shadow duration-200 ${
                scrolled ? 'shadow-lg shadow-black/20' : ''
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo — Thofy Kids con T o punto en amarillo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="font-display text-xl font-bold text-text-primary tracking-tight">
                            <span className="text-accent">T</span>hofy Kids
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
                                    `px-4 py-2 rounded-[6px] text-sm font-medium transition-all duration-hover ${
                                        isActive
                                            ? 'text-accent'
                                            : 'text-text-muted hover:text-accent'
                                    }`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <button
                            id="cart-btn"
                            onClick={openCart}
                            className="relative flex items-center justify-center w-10 h-10 rounded-[6px] text-text-primary hover:text-accent transition-colors duration-hover"
                            aria-label="Abrir carrito"
                        >
                            <FiShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-black text-xs font-bold rounded-full flex items-center justify-center">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-[6px] text-text-primary hover:text-accent transition-colors"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menú"
                        >
                            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t border-border bg-bg animate-fadeIn">
                    <nav className="flex flex-col px-4 py-3 gap-1">
                        {navLinks.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.to === '/'}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-[6px] text-sm font-medium transition-colors ${
                                        isActive ? 'text-accent' : 'text-text-muted hover:text-accent'
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
