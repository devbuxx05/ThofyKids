import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCategorias, useModelosPublicos } from '../../hooks/useSupabase'
import CategoryFilter from '../../components/public/CategoryFilter'
import ProductCard, { ProductCardSkeleton } from '../../components/public/ProductCard'
import { FiSearch, FiX } from 'react-icons/fi'

export default function Catalogo() {
    const [searchParams] = useSearchParams()
    const [selectedCat, setSelectedCat] = useState<number | null>(
        searchParams.get('categoria') ? Number(searchParams.get('categoria')) : null
    )
    const [search, setSearch] = useState('')

    const { data: categorias } = useCategorias()
    const { data: modelos, loading, error } = useModelosPublicos(selectedCat ?? undefined)

    const filtered = modelos.filter((m) =>
        m.nombre_modelo.toLowerCase().includes(search.toLowerCase())
    )

    const hayFiltros = selectedCat !== null || search.trim() !== ''

    const limpiarFiltros = () => {
        setSelectedCat(null)
        setSearch('')
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [selectedCat])

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-text-primary">Catálogo</h1>
                <p className="text-text-muted text-sm mt-1">
                    Encuentra la prenda perfecta para tu pequeño
                </p>
            </div>

            {/* Filtros + Búsqueda */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 overflow-x-auto">
                    <CategoryFilter
                        categorias={categorias}
                        selected={selectedCat}
                        onSelect={setSelectedCat}
                    />
                </div>
                <div className="relative w-full sm:w-56 shrink-0">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-9 pr-8"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                        >
                            <FiX className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Contador + limpiar filtros */}
            <div className="flex items-center justify-between mb-6 min-h-[24px]">
                {!loading && (
                    <p className="text-xs text-text-muted">
                        {filtered.length}{' '}
                        {filtered.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </p>
                )}
                {hayFiltros && !loading && (
                    <button
                        onClick={limpiarFiltros}
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                        <FiX className="w-3 h-3" /> Limpiar filtros
                    </button>
                )}
            </div>

            {/* Contenido */}
            {error ? (
                <div className="text-center py-20 space-y-2">
                    <p className="text-danger text-sm">
                        Error al cargar productos. Verifica tu conexión.
                    </p>
                    <p className="text-text-muted text-xs">{error}</p>
                </div>

            ) : loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>

            ) : filtered.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-bg-elevated border border-border flex items-center justify-center mx-auto">
                        <FiSearch className="w-7 h-7 text-text-muted" />
                    </div>
                    <div>
                        <p className="text-text-primary font-medium">
                            No se encontraron productos
                        </p>
                        <p className="text-text-muted text-sm mt-1">
                            Intenta con otro nombre o categoría
                        </p>
                    </div>
                    <button
                        onClick={limpiarFiltros}
                        className="btn-secondary text-sm"
                    >
                        Limpiar filtros
                    </button>
                </div>

            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fadeIn">
                    {filtered.map((m) => (
                        <ProductCard key={m.id_modelo} modelo={m} />
                    ))}
                </div>
            )}
        </main>
    )
}