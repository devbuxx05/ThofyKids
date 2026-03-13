import { useState } from 'react'
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiUser } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { generateWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp'

const DEPARTAMENTOS_PERU = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
    'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad',
    'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco',
    'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
]

export default function Cart() {
    const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')
    const [destino, setDestino] = useState('')
    const [sending, setSending] = useState(false)

    const handleSend = () => {
        if (!nombre.trim() || telefono.length !== 9 || !destino || cartItems.length === 0) return
        setSending(true)

        const datosEnvio = { nombre, telefono, distrito: destino }
        const msg = generateWhatsAppMessage(cartItems, datosEnvio)
        openWhatsApp(msg)

        setTimeout(() => {
            clearCart()
            setNombre('')
            setTelefono('')
            setDestino('')
            setSending(false)
            closeCart()
        }, 800)
    }

    if (!isCartOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
                aria-hidden
            />

            <aside
                id="cart-drawer"
                className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-bg-surface flex flex-col shadow-2xl transition-transform duration-300"
                role="dialog"
                aria-label="Carrito de compras"
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="bg-accent/10 p-2 rounded-lg text-accent">
                            <FiShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-display text-lg font-bold text-text-primary leading-tight">
                                Tu Pedido
                            </h2>
                            <p className="text-xs text-text-muted font-medium">
                                {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} seleccionados
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-full transition-colors duration-200"
                        aria-label="Cerrar carrito"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* CARRITO VACÍO */}
                {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
                        <div className="w-24 h-24 rounded-full bg-bg-elevated flex items-center justify-center border-2 border-dashed border-border">
                            <FiShoppingBag className="w-10 h-10 text-text-muted" />
                        </div>
                        <div>
                            <p className="font-display text-xl font-bold text-text-primary">
                                Tu carrito está vacío
                            </p>
                            <p className="text-sm text-text-muted mt-2 max-w-[250px] mx-auto">
                                Descubre nuestra colección y viste a los más pequeños con la mejor calidad.
                            </p>
                        </div>
                        <button
                            onClick={closeCart}
                            className="mt-4 text-accent font-bold text-sm hover:underline"
                        >
                            Seguir explorando
                        </button>
                    </div>
                ) : (
                    <>
                        {/* LISTA DE PRODUCTOS */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-bg">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id_modelo}
                                    className="flex gap-4 p-3 bg-bg-surface rounded-card border border-border relative group hover:border-accent/20 transition-colors duration-200"
                                >
                                    {/* Botón eliminar */}
                                    <button
                                        onClick={() => removeFromCart(item.id_modelo)}
                                        className="absolute -top-2 -right-2 w-7 h-7 bg-bg-surface border border-border text-text-muted hover:text-danger hover:border-danger/40 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        aria-label="Eliminar"
                                    >
                                        <FiX className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Imagen */}
                                    {item.foto_url ? (
                                        <img
                                            src={item.foto_url}
                                            alt={item.nombre}
                                            className="w-20 h-24 rounded-lg object-cover bg-bg-elevated shrink-0"
                                        />
                                    ) : (
                                        <div className="w-20 h-24 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0">
                                            <FiShoppingBag className="w-6 h-6 text-text-muted" />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <p className="font-bold text-xl text-text-primary leading-tight line-clamp-2">
                                            {item.nombre}
                                        </p>

                                        <div className="flex items-center justify-between mt-2">
                                            {/* Selector cantidad */}
                                            <div className="flex items-center border border-border rounded-[6px] overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.id_modelo, item.cantidad - 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-text-muted hover:bg-bg-elevated hover:text-text-primary transition-colors duration-200"
                                                >
                                                    <FiMinus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-base font-bold text-text-primary">
                                                    {item.cantidad}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id_modelo, item.cantidad + 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-text-muted hover:bg-bg-elevated hover:text-text-primary transition-colors duration-200"
                                                >
                                                    <FiPlus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="font-mono font-bold text-accent text-lg">
                                                S/. {(item.precio * item.cantidad).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FORMULARIO + TOTAL */}
                        <div className="border-t border-border px-6 py-5 bg-bg-surface">

                            {/* Total */}
                            <div className="flex items-center justify-between mb-5">
                                <span className="font-body text-text-muted text-sm font-medium">
                                    Total referencial
                                </span>
                                <span className="font-mono text-3xl font-black text-accent">
                                    S/. {totalPrice.toFixed(2)}
                                </span>
                            </div>

                            {/* Nota precio referencial */}
                            <p className="text-[11px] text-text-muted bg-bg-elevated rounded-[6px] px-3 py-2 mb-4 leading-relaxed">
                                💬 El precio final se coordinará por WhatsApp según tallas y cantidades exactas.
                            </p>

                            {/* Datos personales */}
                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiUser className="text-accent w-4 h-4" />
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                                        Datos Personales
                                    </p>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nombre completo *"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="input-field"
                                />
                                <input
                                    type="tel"
                                    placeholder="Número de celular *"
                                    value={telefono}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 9)
                                        setTelefono(val)
                                    }}
                                    className={`input-field ${
                                        telefono.length > 0 && telefono.length < 9
                                            ? 'border-danger focus:ring-danger focus:border-danger'
                                            : ''
                                    }`}
                                />
                                {telefono.length > 0 && telefono.length < 9 && (
                                    <p className="text-[11px] text-danger mt-1 px-1">
                                        El número debe tener 9 dígitos
                                    </p>
                                )}
                                <select
                                    value={destino}
                                    onChange={(e) => setDestino(e.target.value)}
                                    className="select-field"
                                >
                                    <option value="">Departamento de destino *</option>
                                    {DEPARTAMENTOS_PERU.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Botón WhatsApp */}
                            <button
                                onClick={handleSend}
                                disabled={!nombre.trim() || telefono.length !== 9 || !destino || sending}
                                className="w-full bg-success hover:bg-success/90 disabled:bg-bg-elevated disabled:text-text-muted text-white font-bold py-3.5 rounded-card flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                {sending ? 'Preparando mensaje...' : 'Confirmar y Enviar por WhatsApp'}
                            </button>

                            <p className="text-[10px] text-center text-text-muted mt-3">
                                Serás redirigido a WhatsApp para coordinar el pago y el envío.
                            </p>
                        </div>
                    </>
                )}
            </aside>
        </>
    )
}