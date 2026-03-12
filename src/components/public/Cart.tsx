import { useState } from 'react'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { generateWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp'

const DISTRITOS_LIMA = [
    'Miraflores', 'San Isidro', 'Barranco', 'Surco', 'San Borja',
    'La Molina', 'Ate', 'San Juan de Lurigancho', 'Comas', 'Los Olivos',
    'Independencia', 'El Agustino', 'Villa El Salvador', 'Villa María del Triunfo',
    'San Martín de Porres', 'Lince', 'Jesús María', 'Magdalena', 'Pueblo Libre',
    'Breña', 'Rímac', 'Cercado de Lima', 'Callao', 'Ventanilla', 'Otro',
]

export default function Cart() {
    const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')
    const [distrito, setDistrito] = useState('')
    const [sending, setSending] = useState(false)

    const handleSend = () => {
        if (!nombre.trim() || !telefono.trim() || !distrito) return
        setSending(true)
        const msg = generateWhatsAppMessage(cartItems, { nombre, telefono, distrito })
        openWhatsApp(msg)
        setTimeout(() => {
            clearCart()
            setNombre('')
            setTelefono('')
            setDistrito('')
            setSending(false)
            closeCart()
        }, 800)
    }

    if (!isCartOpen) return null

    return (
        <>
            <div
                className="fixed inset-0 z-50 cart-backdrop"
                onClick={closeCart}
                aria-hidden
            />

            <aside
                id="cart-drawer"
                className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-surface border-l border-border flex flex-col animate-slideIn shadow-2xl"
                role="dialog"
                aria-label="Carrito de compras"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <FiShoppingBag className="w-5 h-5 text-accent" />
                        <h2 className="font-display text-lg font-bold text-text-primary">Tu Pedido</h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-8 h-8 flex items-center justify-center rounded-[6px] text-text-muted hover:text-text-primary hover:bg-border transition-colors"
                        aria-label="Cerrar carrito"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
                        <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center">
                            <FiShoppingBag className="w-10 h-10 text-text-muted" />
                        </div>
                        <div>
                            <p className="font-display text-lg text-text-muted">Tu carrito está vacío</p>
                            <p className="text-sm text-text-muted mt-1">Agrega algunos productos del catálogo</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                            {cartItems.map((item, i) => (
                                <div key={i} className="flex gap-3 p-3 bg-bg rounded-[6px] border border-border">
                                    {item.foto_url ? (
                                        <img
                                            src={item.foto_url}
                                            alt={item.nombre}
                                            className="w-16 h-16 rounded-[6px] object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-[6px] bg-surface border border-border flex items-center justify-center shrink-0">
                                            <FiShoppingBag className="w-6 h-6 text-text-muted" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-text-primary leading-tight line-clamp-2">
                                            {item.nombre}
                                        </p>
                                        <p className="text-xs text-text-muted mt-0.5">
                                            Talla {item.talla} · {item.color}
                                        </p>
                                        <div className="flex items-center justify-between mt-1.5">
                                            <div className="flex items-center border border-border rounded-[6px] overflow-hidden bg-surface">
                                                <button
                                                    onClick={() => updateQuantity(item.id_modelo, item.talla, item.color, item.cantidad - 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-text-primary hover:bg-border transition-colors"
                                                >
                                                    <FiMinus className="w-3 h-3" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-medium text-text-primary">{item.cantidad}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id_modelo, item.talla, item.color, item.cantidad + 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-text-primary hover:bg-border transition-colors"
                                                >
                                                    <FiPlus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-accent font-bold text-sm">
                                                    S/. {(item.precio * item.cantidad).toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => removeFromCart(item.id_modelo, item.talla, item.color)}
                                                    className="text-text-muted hover:text-danger transition-colors"
                                                    aria-label="Eliminar"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border px-5 py-4 space-y-4 bg-surface">
                            <div className="flex items-center justify-between">
                                <span className="font-display text-base text-text-primary">Total</span>
                                <span className="font-mono text-xl font-bold text-accent">
                                    S/. {totalPrice.toFixed(2)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <input
                                    id="cart-nombre"
                                    type="text"
                                    placeholder="Nombre completo *"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="input-field"
                                />
                                <input
                                    id="cart-telefono"
                                    type="tel"
                                    placeholder="Teléfono *"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className="input-field"
                                />
                                <select
                                    id="cart-distrito"
                                    value={distrito}
                                    onChange={(e) => setDistrito(e.target.value)}
                                    className="input-field"
                                >
                                    <option value="">Distrito *</option>
                                    {DISTRITOS_LIMA.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                id="whatsapp-send-btn"
                                onClick={handleSend}
                                disabled={!nombre.trim() || !telefono.trim() || !distrito || sending}
                                className="btn-whatsapp w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                {sending ? 'Enviando...' : 'Enviar Pedido por WhatsApp'}
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </>
    )
}
