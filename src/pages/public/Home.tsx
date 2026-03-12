import { Link } from 'react-router-dom'
import { FiArrowRight, FiShield, FiHeart, FiTruck } from 'react-icons/fi'
import { useModelosDestacados, useCategorias } from '../../hooks/useSupabase'
import ProductCard, { ProductCardSkeleton } from '../../components/public/ProductCard'

export default function Home() {
    const { data: destacados, loading: loadingDestacados } = useModelosDestacados()
    const { data: categorias, loading: loadingCategorias } = useCategorias()

    return (
        <main>
            {/* Hero — negro limpio, diseño tipográfico */}
            <section className="relative min-h-[85vh] flex items-center justify-center bg-bg overflow-hidden">
                {/* Patrón geométrico sutil */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 20px,
                            currentColor 20px,
                            currentColor 21px
                        )`,
                    }}
                    aria-hidden
                />
                <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fadeIn">
                    <span className="inline-block px-4 py-1.5 border border-border rounded-[6px] text-text-muted text-xs uppercase tracking-[0.2em] font-medium mb-6">
                        🇵🇪 Hecho en Perú
                    </span>
                    <h1 className="font-display text-5xl md:text-7xl font-extrabold text-text-primary leading-tight mb-6">
                        Thofy Kids
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted font-body font-light leading-relaxed mb-10 max-w-xl mx-auto">
                        Ropa infantil con estilo y comodidad. Porque cada niño merece sentirse especial.
                    </p>
                    <Link
                        to="/catalogo"
                        id="hero-cta"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-black font-body font-bold uppercase tracking-widest text-sm rounded-[6px] hover:bg-accent-hover transition-all duration-hover active:scale-[0.98]"
                    >
                        Ver Catálogo
                        <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Benefits bar */}
            <section className="bg-surface border-y border-border">
                <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: FiHeart, label: 'Calidad Premium', desc: 'Telas suaves y durables' },
                        { icon: FiShield, label: 'Para tu tranquilidad', desc: 'Prendas certificadas' },
                        { icon: FiTruck, label: 'Envíos a Lima', desc: 'Coordinamos tu entrega' },
                    ].map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="flex items-center gap-3 justify-center text-center sm:text-left sm:justify-start">
                            <div className="w-10 h-10 rounded-[6px] bg-accent/10 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-primary">{label}</p>
                                <p className="text-xs text-text-muted">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Destacados */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-10">
                    <h2 className="section-title">Productos Destacados</h2>
                    <p className="section-subtitle">Lo más amado de nuestra colección</p>
                </div>

                {loadingDestacados ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : destacados.length === 0 ? (
                    <div className="text-center py-16 text-text-muted">
                        <p>Los productos destacados aparecerán aquí una vez configurado Supabase.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {destacados.map((m) => (
                            <div key={m.id_modelo} className="transition-transform duration-hover hover:scale-[1.02]">
                                <ProductCard modelo={m} />
                            </div>
                        ))}
                    </div>
                )}

                {destacados.length > 0 && (
                    <div className="text-center mt-10">
                        <Link to="/catalogo" className="btn-secondary">
                            Ver catálogo completo <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </section>

            {/* Categorias */}
            {!loadingCategorias && categorias.length > 0 && (
                <section className="bg-surface border-t border-border py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="section-title">Explora por Categoría</h2>
                            <p className="section-subtitle">Encuentra exactamente lo que buscas</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {categorias.map((cat) => (
                                <Link
                                    key={cat.id_categoria}
                                    to={`/catalogo?categoria=${cat.id_categoria}`}
                                    className="group card p-6 text-center border-border hover:border-accent/50 transition-all duration-hover hover:-translate-y-0.5"
                                >
                                    <div className="w-12 h-12 rounded-[6px] bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mx-auto mb-3 transition-colors">
                                        <span className="text-accent font-display font-bold text-lg">
                                            {cat.nombre.slice(0, 1)}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-semibold text-text-primary text-sm">
                                        {cat.nombre}
                                    </h3>
                                    {cat.descripcion && (
                                        <p className="text-xs text-text-muted mt-1 line-clamp-2">{cat.descripcion}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA banner */}
            <section className="bg-accent py-14">
                <div className="max-w-2xl mx-auto text-center px-4">
                    <h2 className="font-display text-3xl md:text-4xl text-black font-bold mb-4">
                        ¿Listo para hacer tu pedido?
                    </h2>
                    <p className="text-black/80 mb-8 text-base font-body">
                        Explora nuestro catálogo y coordina tu pedido directo por WhatsApp. Rápido y sencillo.
                    </p>
                    <Link
                        to="/catalogo"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-black text-accent font-body font-bold uppercase tracking-wider text-sm rounded-[6px] hover:bg-black/90 transition-colors active:scale-[0.98]"
                    >
                        Ir al Catálogo <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </main>
    )
}
