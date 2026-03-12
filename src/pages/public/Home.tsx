import { Link } from 'react-router-dom'
import { FiArrowRight, FiShield, FiHeart, FiTruck } from 'react-icons/fi'
import { useModelosDestacados, useCategorias } from '../../hooks/useSupabase'
import ProductCard, { ProductCardSkeleton } from '../../components/public/ProductCard'

export default function Home() {
    const { data: destacados, loading: loadingDestacados } = useModelosDestacados()
    const { data: categorias, loading: loadingCategorias } = useCategorias()

    return (
        <main>
            {/* ── Hero ─────────────────────────────────────────────── */}
            <section
                className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #3D3535 0%, #6B4848 50%, #C98B8B 100%)',
                }}
            >
                {/* Decorative circles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
                    <div className="absolute bottom-10 -left-20 w-64 h-64 rounded-full bg-accent/30" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fadeIn">
                    <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs uppercase tracking-[0.2em] font-medium mb-6">
                        🇵🇪 Hecho en Perú
                    </span>
                    <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
                        Thofy Kids
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed mb-10 max-w-xl mx-auto">
                        Ropa infantil con estilo y comodidad. Porque cada niño merece sentirse especial.
                    </p>
                    <Link
                        to="/catalogo"
                        id="hero-cta"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-accent font-bold uppercase tracking-widest text-sm rounded-full hover:bg-accent hover:text-white transition-all duration-300 shadow-2xl shadow-accent/30 hover:shadow-accent/50 hover:scale-105 active:scale-95"
                    >
                        Ver Catálogo
                        <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* ── Benefits bar ─────────────────────────────────────── */}
            <section className="bg-white border-b border-cream-dark">
                <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: FiHeart, label: 'Calidad Premium', desc: 'Telas suaves y durables' },
                        { icon: FiShield, label: 'Para tu tranquilidad', desc: 'Prendas certificadas' },
                        { icon: FiTruck, label: 'Envíos a Lima', desc: 'Coordinamos tu entrega' },
                    ].map(({ icon: Icon, label, desc }) => (
                        <div key={label} className="flex items-center gap-3 justify-center text-center sm:text-left sm:justify-start">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-brand">{label}</p>
                                <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Destacados ───────────────────────────────────────── */}
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
                    <div className="text-center py-16 text-gray-400">
                        <p>Los productos destacados aparecerán aquí una vez configurado Supabase.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {destacados.map((m) => <ProductCard key={m.id_modelo} modelo={m} />)}
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

            {/* ── Categorias ───────────────────────────────────────── */}
            {!loadingCategorias && categorias.length > 0 && (
                <section className="bg-cream-dark py-16">
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
                                    className="group card p-6 text-center hover:border-accent/30 border border-transparent transition-all hover:-translate-y-1"
                                >
                                    <div className="w-12 h-12 rounded-full bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mx-auto mb-3 transition-colors">
                                        <span className="text-accent font-display font-bold text-lg">
                                            {cat.nombre.slice(0, 1)}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-semibold text-slate-brand text-sm">
                                        {cat.nombre}
                                    </h3>
                                    {cat.descripcion && (
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.descripcion}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA banner ───────────────────────────────────────── */}
            <section className="bg-accent py-14">
                <div className="max-w-2xl mx-auto text-center px-4">
                    <h2 className="font-display text-3xl md:text-4xl text-white font-bold mb-4">
                        ¿Listo para hacer tu pedido?
                    </h2>
                    <p className="text-white/80 mb-8 text-base">
                        Explora nuestro catálogo y coordina tu pedido directo por WhatsApp. Rápido y sencillo.
                    </p>
                    <Link
                        to="/catalogo"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent font-bold uppercase tracking-wider text-sm rounded-full hover:bg-cream transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Ir al Catálogo <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </main>
    )
}
