import { useState } from 'react'
import { FiShoppingBag, FiPlus, FiMinus } from 'react-icons/fi'
import type { Modelo, ModeloColor } from '../../types'
import { useCart } from '../../context/CartContext'

interface Props {
    modelo: Modelo
}

function ProductCardSkeleton() {
    return (
        <div className="card overflow-hidden">
            <div className="skeleton aspect-[3/4] w-full" />
            <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-8 w-full mt-3" />
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
        <article className="card overflow-hidden group">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
                {fotoActual ? (
                    <img
                        src={fotoActual}
                        alt={`${modelo.nombre_modelo} — color ${selectedColor?.color?.nombre}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FiShoppingBag className="w-16 h-16" />
                    </div>
                )}
                {modelo.destacado && (
                    <span className="absolute top-3 left-3 badge bg-accent text-white text-[10px] uppercase tracking-widest">
                        Destacado
                    </span>
                )}
            </div>

            <div className="p-4 space-y-3">
                {/* Title */}
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                        {modelo.categoria?.nombre}
                    </p>
                    <h3 className="font-display font-semibold text-slate-brand text-base leading-tight line-clamp-2">
                        {modelo.nombre_modelo}
                    </h3>
                    <p className="text-accent font-bold text-lg mt-1">
                        S/. {modelo.precio_referencia.toFixed(2)}
                    </p>
                </div>

                {/* Color selector */}
                {colores.length > 0 && (
                    <div>
                        <p className="text-xs text-gray-400 mb-1.5">
                            Color: <span className="text-gray-600 font-medium">{selectedColor?.color?.nombre}</span>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {colores.map((c) => (
                                <button
                                    key={c.id_modelo_color}
                                    title={c.color?.nombre}
                                    onClick={() => setSelectedColor(c)}
                                    className={`relative w-7 h-7 rounded-full border-2 overflow-hidden transition-all ${selectedColor?.id_modelo_color === c.id_modelo_color
                                            ? 'border-accent shadow-md scale-110'
                                            : 'border-gray-200 hover:border-accent/50'
                                        }`}
                                >
                                    {c.foto_url ? (
                                        <img src={c.foto_url} alt={c.color?.nombre} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[8px] font-bold text-gray-500 flex items-center justify-center h-full">
                                            {c.color?.nombre?.slice(0, 1)}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Size selector */}
                {tallas.length > 0 && (
                    <div>
                        <p className="text-xs text-gray-400 mb-1.5">Talla</p>
                        <div className="flex gap-1.5 flex-wrap">
                            {tallas.map((t) => {
                                const nombre = t.talla?.nombre ?? ''
                                return (
                                    <button
                                        key={t.id_modelo_talla}
                                        onClick={() => setSelectedTalla(nombre)}
                                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${selectedTalla === nombre
                                                ? 'bg-accent border-accent text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-accent hover:text-accent'
                                            }`}
                                    >
                                        {nombre}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Quantity + Add to cart */}
                <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium">{qty}</span>
                        <button
                            onClick={() => setQty((q) => q + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <FiPlus className="w-3 h-3" />
                        </button>
                    </div>
                    <button
                        id={`add-to-cart-${modelo.id_modelo}`}
                        onClick={handleAddToCart}
                        // Solo bloqueamos si HAY tallas/colores disponibles pero el usuario no ha seleccionado ninguno
                        disabled={(tallas.length > 0 && !selectedTalla) || (colores.length > 0 && !selectedColor)}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-full text-sm font-semibold uppercase tracking-wide transition-all ${added
                                ? 'bg-green-500 text-white'
                                : 'bg-accent text-white hover:bg-accent-dark active:scale-95'
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                        <FiShoppingBag className="w-4 h-4" />
                        {added ? '¡Agregado!' : 'Agregar'}
                    </button>
                </div>
            </div>
        </article>
    )
}
