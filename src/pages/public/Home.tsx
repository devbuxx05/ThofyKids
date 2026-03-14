import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, easeOut } from 'framer-motion'
import { FiArrowRight, FiShield, FiHeart, FiTruck, FiPackage, FiStar } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useModelosDestacados, useCategorias } from '../../hooks/useSupabase'
import ProductCard, { ProductCardSkeleton } from '../../components/public/ProductCard'

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: easeOut },
    }),
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
}

const letterVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: easeOut },
    },
}

const catIconos: Record<string, string> = {
    'Pantalón': '👖',
    'Bermuda': '🩳',
    'Polo': '👕',
    'Casaca': '🧥',
    'Conjunto': '🎽',
}

export default function Home() {
    const { data: destacados, loading: loadingDestacados } = useModelosDestacados()
    const { data: categorias, loading: loadingCategorias } = useCategorias()

    const heroRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

    const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER ?? '51XXXXXXXXX'

    return (
        <main className="overflow-x-hidden">

            {/* ── HERO ── */}
            <section
                ref={heroRef}
                className="relative min-h-[90vh] flex items-center justify-center bg-bg overflow-hidden"
            >
                {/* Fondo animado */}
                <motion.div
                    animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            45deg, transparent, transparent 30px,
                            currentColor 30px, currentColor 31px
                        )`,
                        backgroundSize: '60px 60px',
                    }}
                    aria-hidden
                />

                {/* Círculos decorativos */}
                <div className="absolute top-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/4 w-48 md:w-64 h-48 md:h-64 bg-accent/3 rounded-full blur-2xl pointer-events-none" />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full"
                >
                    {/* Badge */}
                    <motion.span
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className="inline-flex items-center gap-2 px-4 py-1.5 border border-border rounded-full text-text-muted text-xs uppercase tracking-[0.2em] font-medium mb-6 md:mb-8"
                    >
                        🇵🇪 Hecho en Perú
                    </motion.span>

                    {/* Título — una sola línea en desktop, sin flex-wrap */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="mb-4 md:mb-6"
                    >
                        <motion.h1
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="font-display font-extrabold leading-none select-none text-[13vw] sm:text-6xl md:text-8xl lg:text-9xl"
                        >
                            {["T", "h", "o", "f", "y", " ", "K", "i", "d", "s"].map((letter, i) => (
                                <motion.span
                                    key={i}
                                    variants={letterVariant}
                                    className={letter === "T" ? "text-accent" : "text-text-primary"}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.h1>
                    </motion.div>

                    {/* Línea decorativa */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        className="flex items-center justify-center gap-4 mb-6 md:mb-8"
                    >
                        <div className="h-px w-12 md:w-16 bg-border" />
                        <FiStar className="w-3 h-3 text-accent" />
                        <div className="h-px w-12 md:w-16 bg-border" />
                    </motion.div>

                    {/* Subtítulo */}
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                        className="text-base md:text-xl text-text-muted font-body font-light leading-relaxed mb-8 md:mb-10 max-w-md md:max-w-xl mx-auto"
                    >
                        Ropa infantil con estilo y comodidad.{' '}
                        <span className="text-text-primary">Porque cada niño merece sentirse especial.</span>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={4}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        <Link
                            to="/catalogo"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-black font-body font-bold uppercase tracking-widest text-sm rounded-[6px] hover:bg-accent-dark transition-all duration-200 active:scale-[0.98] group"
                        >
                            Ver Catálogo
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <Link
                            to="/nosotros"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-text-muted font-body font-medium text-sm rounded-[6px] hover:border-accent/50 hover:text-text-primary transition-all duration-200"
                        >
                            Conoce la marca
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Mouse scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Scroll</span>
                    <div className="w-6 h-9 rounded-full border-2 border-text-muted/40 flex items-start justify-center pt-1.5">
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                            className="w-1 h-2 bg-accent rounded-full"
                        />
                    </div>
                </motion.div>
            </section>

            {/* ── BENEFITS BAR ── */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={stagger}
                className="bg-bg-surface border-y border-border"
            >
                <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                    {[
                        { icon: FiHeart,  label: 'Calidad Premium',    desc: 'Telas suaves y durables en todas las prendas' },
                        { icon: FiShield, label: 'Venta al por mayor', desc: 'Precios especiales para compradores mayoristas' },
                        { icon: FiTruck,  label: 'Envíos a todo Perú', desc: 'Coordinamos tu entrega por agencia' },
                    ].map(({ icon: Icon, label, desc }, i) => (
                        <motion.div
                            key={label}
                            variants={fadeUp}
                            custom={i}
                            className="flex items-center gap-3 justify-start sm:justify-center py-4 px-6"
                        >
                            <div className="w-9 h-9 rounded-[6px] bg-accent/10 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-primary">{label}</p>
                                <p className="text-xs text-text-muted">{desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ── DESTACADOS ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    variants={stagger}
                    className="mb-10 md:mb-12"
                >
                    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
                        <div className="h-px w-8 bg-accent" />
                        <span className="text-accent text-xs uppercase tracking-widest font-semibold">Colección</span>
                    </motion.div>
                    <motion.h2 variants={fadeUp} className="font-display text-2xl md:text-4xl font-bold text-text-primary">
                        Productos Destacados
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-text-muted text-sm md:text-base mt-1">
                        Lo más amado de nuestra colección
                    </motion.p>
                </motion.div>

                {loadingDestacados ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : destacados.length === 0 ? (
                    <div className="text-center py-16 text-text-muted border border-dashed border-border rounded-card">
                        <FiPackage className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">Los productos destacados aparecerán aquí.</p>
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={stagger}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
                    >
                        {destacados.map((m, i) => (
                            <motion.div key={m.id_modelo} variants={fadeUp} custom={i}>
                                <ProductCard modelo={m} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {destacados.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="text-center mt-10 md:mt-12"
                    >
                        <Link
                            to="/catalogo"
                            className="inline-flex items-center gap-2 btn-secondary group"
                        >
                            Ver catálogo completo
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                    </motion.div>
                )}
            </section>

            {/* ── CATEGORÍAS ── */}
            {!loadingCategorias && categorias.length > 0 && (
                <section className="bg-bg-surface border-t border-border py-16 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            variants={stagger}
                            className="mb-10 md:mb-12"
                        >
                            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
                                <div className="h-px w-8 bg-accent" />
                                <span className="text-accent text-xs uppercase tracking-widest font-semibold">Categorías</span>
                            </motion.div>
                            <motion.h2 variants={fadeUp} className="font-display text-2xl md:text-4xl font-bold text-text-primary">
                                Explora por Categoría
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-text-muted text-sm md:text-base mt-1">
                                Encuentra exactamente lo que buscas
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={stagger}
                            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
                        >
                            {categorias.map((cat, i) => (
                                <motion.div key={cat.id_categoria} variants={fadeUp} custom={i}>
                                    <Link
                                        to={`/catalogo?categoria=${cat.id_categoria}`}
                                        className="group flex flex-col items-center gap-2 md:gap-3 p-3 md:p-5 card border-border hover:border-accent/40 hover:-translate-y-1 transition-all duration-200 text-center"
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-[6px] bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors duration-200">
                                            <span className="text-xl md:text-2xl">
                                                {catIconos[cat.nombre] ?? '👗'}
                                            </span>
                                        </div>
                                        <span className="font-display font-semibold text-text-primary text-xs md:text-sm group-hover:text-accent transition-colors duration-200 leading-tight">
                                            {cat.nombre}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── CTA BANNER ── */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-accent py-14 md:py-16 relative overflow-hidden"
            >
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage: `repeating-linear-gradient(
                            -45deg, transparent, transparent 20px,
                            black 20px, black 21px
                        )`,
                    }}
                    aria-hidden
                />
                <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="font-display text-2xl md:text-4xl text-black font-bold mb-3 md:mb-4"
                    >
                        ¿Listo para hacer tu pedido?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-black/70 mb-8 text-sm md:text-base font-body"
                    >
                        Explora nuestro catálogo y coordina tu pedido directo por WhatsApp. Rápido y sencillo.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        <Link
                            to="/catalogo"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-accent font-body font-bold uppercase tracking-wider text-sm rounded-[6px] hover:bg-black/90 transition-colors active:scale-[0.98] group"
                        >
                            Ir al Catálogo
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <a
                            href={`https://wa.me/${whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-body font-bold uppercase tracking-wider text-sm rounded-[6px] hover:bg-[#1EBE5A] transition-colors active:scale-[0.98] group"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                            Escribir por WhatsApp
                        </a>
                    </motion.div>
                </div>
            </motion.section>
        </main>
    )
}