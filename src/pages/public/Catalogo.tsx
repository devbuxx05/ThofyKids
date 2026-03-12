import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCategorias, useModelosPublicos } from '../../hooks/useSupabase'
import CategoryFilter from '../../components/public/CategoryFilter'
import ProductCard, { ProductCardSkeleton } from '../../components/public/ProductCard'
import { FiSearch } from 'react-icons/fi'

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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [selectedCat])

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="section-title">Catálogo</h1>
                <p className="section-subtitle">Encuentra la prenda perfecta para tu pequeño</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-9"
                    />
                </div>
            </div>

            {!loading && (
                <p className="text-sm text-text-muted mb-6">
                    {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'} encontrados
                </p>
            )}

            {error ? (
                <div className="text-center py-20">
                    <p className="text-danger text-sm">
                        Error al cargar productos. Verifica tu conexión con Supabase.
                    </p>
                    <p className="text-text-muted text-xs mt-2">{error}</p>
                </div>
            ) : loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-text-muted text-base">No se encontraron productos.</p>
                    <button
                        className="btn-secondary mt-4 text-sm"
                        onClick={() => { setSelectedCat(null); setSearch('') }}
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {filtered.map((m) => (
                        <div key={m.id_modelo} className="transition-transform duration-hover hover:scale-[1.02]">
                            <ProductCard modelo={m} />
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
