import { useState } from 'react'
import { FiShoppingBag, FiPlus, FiMinus } from 'react-icons/fi'
import type { Modelo, ModeloColor } from '../../types'
import { useCart } from '../../context/CartContext'

interface Props {
    modelo: Modelo
}

function ProductCardSkeleton() {
    return (
        <div className="card overflow-hidden bg-surface border border-border rounded-card">
            <div className="skeleton aspect-square w-full" />
            <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-8 w-full mt-3 rounded" />
            </div>
        </div>
    )
}

export { ProductCardSkeleton }

export default function ProductCard({ modelo }: Props) {
    const { addToCart } = useCart()
    const colores = modelo.colores ?? []
    const tallas = modelo.tallas ?? []

    const [selectedColor, setSelectedColor] = useState<ModeloColor | null>(colores.length > 0 ? colores[0] : null)
    const [selectedTalla, setSelectedTalla] = useState<string>(tallas.length > 0 ? (tallas[0]?.talla?.nombre ?? '') : 'Única')
    const [qty, setQty] = useState(1)
    const [added, setAdded] = useState(false)

    const handleAddToCart = () => {
        if (!selectedColor || !selectedTalla) return
        addToCart({
            id_modelo: modelo.id_modelo,
            nombre: modelo.nombre_modelo,
            talla: selectedTalla,
            color: selectedColor.color?.nombre ?? '',
            foto_url: selectedColor.foto_url,
            precio: modelo.precio_referencia,
            cantidad: qty,
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const fotoActual = selectedColor?.foto_url ?? ''

    return (
        <article className="card overflow-hidden group bg-surface border border-border rounded-card transition-transform duration-hover hover:scale-[1.02]">
            {/* Image — aspect-ratio 1:1 */}
            <div className="relative aspect-square overflow-hidden bg-surface">
                {fotoActual ? (
                    <img
                        src={fotoActual}
                        alt={`${modelo.nombre_modelo} — color ${selectedColor?.color?.nombre}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <FiShoppingBag className="w-16 h-16" />
                    </div>
                )}
                {/* Badge categoría esquina superior izquierda */}
                {modelo.categoria?.nombre && (
                    <span className="absolute top-2 left-2 badge bg-accent text-black text-[10px] uppercase tracking-widest font-semibold">
                        {modelo.categoria.nombre}
                    </span>
                )}
                {modelo.destacado && !modelo.categoria?.nombre && (
                    <span className="absolute top-2 left-2 badge bg-accent text-black text-[10px] uppercase tracking-widest font-semibold">
                        Destacado
                    </span>
                )}
            </div>

            <div className="p-4 space-y-3">
                {/* Nombre + Precio */}
                <div>
                    <h3 className="font-display font-semibold text-text-primary text-base leading-tight line-clamp-2">
                        {modelo.nombre_modelo}
                    </h3>
                    <p className="font-mono text-accent font-bold text-lg mt-1">
                        S/. {modelo.precio_referencia.toFixed(2)}
                    </p>
                </div>

                {/* Talla: pills */}
                {tallas.length > 0 && (
                    <div>
                        <p className="text-xs text-text-muted mb-1.5">Talla</p>
                        <div className="flex gap-1.5 flex-wrap">
                            {tallas.map((t) => {
                                const nombre = t.talla?.nombre ?? ''
                                return (
                                    <button
                                        key={t.id_modelo_talla}
                                        onClick={() => setSelectedTalla(nombre)}
                                        className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold border transition-all duration-hover ${
                                            selectedTalla === nombre
                                                ? 'bg-accent border-accent text-black'
                                                : 'border-border text-text-muted hover:border-accent/50 hover:text-accent'
                                        }`}
                                    >
                                        {nombre}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Color: círculos, activo con ring amarillo */}
                {colores.length > 0 && (
                    <div>
                        <p className="text-xs text-text-muted mb-1.5">
                            Color: <span className="text-text-primary font-medium">{selectedColor?.color?.nombre}</span>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {colores.map((c) => (
                                <button
                                    key={c.id_modelo_color}
                                    title={c.color?.nombre}
                                    onClick={() => setSelectedColor(c)}
                                    className={`relative w-7 h-7 rounded-full border-2 overflow-hidden transition-all duration-hover ${
                                        selectedColor?.id_modelo_color === c.id_modelo_color
                                            ? 'border-accent ring-2 ring-accent ring-offset-2 ring-offset-surface scale-110'
                                            : 'border-border hover:border-accent/50'
                                    }`}
                                >
                                    {c.foto_url ? (
                                        <img src={c.foto_url} alt={c.color?.nombre ?? ''} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[8px] font-bold text-text-muted flex items-center justify-center h-full w-full">
                                            {c.color?.nombre?.slice(0, 1) ?? '?'}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cantidad + Add to cart */}
                <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center border border-border rounded-[6px] overflow-hidden bg-surface">
                        <button
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-border transition-colors"
                        >
                            <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium text-text-primary">{qty}</span>
                        <button
                            onClick={() => setQty((q) => q + 1)}
                            className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-border transition-colors"
                        >
                            <FiPlus className="w-3 h-3" />
                        </button>
                    </div>
                    <button
                        id={`add-to-cart-${modelo.id_modelo}`}
                        onClick={handleAddToCart}
                        disabled={(tallas.length > 0 && !selectedTalla) || (colores.length > 0 && !selectedColor)}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-[6px] text-sm font-semibold uppercase tracking-wide transition-all duration-hover ${
                            added
                                ? 'bg-success text-white'
                                : 'bg-accent text-black hover:bg-accent-hover active:scale-[0.98]'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                        <FiShoppingBag className="w-4 h-4" />
                        {added ? '¡Agregado!' : 'Agregar al carrito'}
                    </button>
                </div>
            </div>
        </article>
    )
}
