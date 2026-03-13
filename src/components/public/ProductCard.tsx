import { useState } from 'react'
import { FiShoppingBag, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { Modelo } from '../../types'
import { useCart } from '../../context/CartContext'

interface Props {
    modelo: Modelo
}

function ProductCardSkeleton() {
    return (
        <div className="card overflow-hidden bg-bg-surface border border-border rounded-card">
            <div className="skeleton aspect-square w-full" />
            <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-3 w-2/3 rounded" />
                <div className="skeleton h-9 w-full mt-3 rounded" />
            </div>
        </div>
    )
}

export { ProductCardSkeleton }

export default function ProductCard({ modelo }: Props) {
    const { addToCart } = useCart()

    // Todas las fotos del carrusel — una por color
    const fotos = (modelo.fotos ?? [])
        .sort((a, b) => a.orden - b.orden)
        .map((f) => f.foto_url)
        .filter(Boolean) as string[]

    const tallas = (modelo.tallas ?? [])
        .map((t) => t.talla?.nombre)
        .filter(Boolean) as string[]

    const colores = (modelo.colores ?? [])
        .map((c) => c.color?.nombre)
        .filter(Boolean) as string[]

    const [currentIndex, setCurrentIndex] = useState(0)
    const [added, setAdded] = useState(false)

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex((i) => (i === 0 ? fotos.length - 1 : i - 1))
    }

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex((i) => (i === fotos.length - 1 ? 0 : i + 1))
    }

    const handleAddToCart = () => {
        addToCart({
            id_modelo: modelo.id_modelo,
            nombre: modelo.nombre_modelo,
            foto_url: fotos[0] ?? '',
            precio: modelo.precio_referencia,
            cantidad: 1,
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <article className="card overflow-hidden group bg-bg-surface border border-border rounded-card transition-transform duration-200 hover:scale-[1.02]">

            {/* CARRUSEL */}
            <div className="relative aspect-square overflow-hidden bg-bg-elevated">

                {fotos.length > 0 ? (
                    <>
                        <img
                            key={currentIndex}
                            src={fotos[currentIndex]}
                            alt={`${modelo.nombre_modelo} — foto ${currentIndex + 1}`}
                            className="w-full h-full object-cover transition-opacity duration-300 animate-fadeIn"
                            loading="lazy"
                        />

                        {/* Controles — solo si hay más de 1 foto */}
                        {fotos.length > 1 && (
                            <>
                                <button
                                    onClick={prevPhoto}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80"
                                    aria-label="Foto anterior"
                                >
                                    <FiChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={nextPhoto}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80"
                                    aria-label="Foto siguiente"
                                >
                                    <FiChevronRight className="w-4 h-4" />
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {fotos.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i) }}
                                            className={`rounded-full transition-all duration-200 ${
                                                i === currentIndex
                                                    ? 'w-4 h-1.5 bg-accent'
                                                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                                            }`}
                                            aria-label={`Ir a foto ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <FiShoppingBag className="w-16 h-16" />
                    </div>
                )}

                {/* Badge categoría */}
                {(modelo.categoria?.nombre || modelo.destacado) && (
                    <span className="absolute top-2 left-2 badge bg-accent text-black text-[10px] uppercase tracking-widest font-semibold">
                        {modelo.categoria?.nombre ?? 'Destacado'}
                    </span>
                )}
            </div>

            {/* INFO */}
            <div className="p-4 space-y-3">

                {/* Nombre */}
                <h3 className="font-display font-semibold text-text-primary text-base leading-tight line-clamp-2">
                    {modelo.nombre_modelo}
                </h3>

                {/* Precio */}
                <p className="font-mono text-accent font-bold text-lg">
                    Desde S/. {modelo.precio_referencia.toFixed(2)}
                </p>

                {/* Tallas disponibles */}
                {tallas.length > 0 && (
                    <p className="text-xs text-text-muted leading-relaxed">
                        <span className="text-text-primary font-medium">Tallas: </span>
                        {tallas.join(' · ')}
                    </p>
                )}

                {/* Colores disponibles */}
                {colores.length > 0 && (
                    <p className="text-xs text-text-muted leading-relaxed">
                        <span className="text-text-primary font-medium">Colores: </span>
                        {colores.join(' · ')}
                    </p>
                )}

                {/* Botón agregar */}
                <button
                    onClick={handleAddToCart}
                    className={`w-full flex items-center justify-center gap-2 h-9 rounded-[6px] text-sm font-semibold uppercase tracking-wide transition-all duration-200 active:scale-[0.98] ${
                        added
                            ? 'bg-success text-white'
                            : 'bg-accent text-black hover:bg-accent-dark'
                    }`}
                >
                    <FiShoppingBag className="w-4 h-4" />
                    {added ? '¡Agregado!' : 'Agregar'}
                </button>
            </div>
        </article>
    )
}