import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, easeOut } from 'framer-motion'
import { FiArrowRight, FiHeart, FiAward, FiUsers, FiTruck, FiCreditCard, FiGrid } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: easeOut },
    }),
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}

const stats = [
    { value: '+30', label: 'Años en el mercado' },
    { value: '+500', label: 'Familias atendidas' },
    { value: '100%', label: 'Producción nacional' },
    { value: '0-18', label: 'Tallas disponibles' },
]

const values = [
    {
        icon: FiHeart,
        title: 'Calidad que se nota',
        desc: 'Telas seleccionadas, costuras reforzadas. Prendas que aguantan el ritmo de los niños.',
    },
    {
        icon: FiUsers,
        title: 'Manos peruanas',
        desc: 'Costureros locales comprometidos. Cada pedido apoya la industria textil nacional.',
    },
    {
        icon: FiAward,
        title: 'Más de 30 años',
        desc: 'Tres décadas en el mercado nos respaldan. Experiencia, confianza y compromiso en cada prenda.',
    },
]

export default function Nosotros() {
    const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER ?? '51XXXXXXXXX'
    const heroRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

    return (
        <main className="overflow-x-hidden">

            {/* ── HERO ── */}
            <section
                ref={heroRef}
                className="relative min-h-[65vh] flex items-center justify-center bg-bg overflow-hidden"
            >
                <motion.div
                    animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, currentColor 30px, currentColor 31px)`,
                        backgroundSize: '60px 60px',
                    }}
                    aria-hidden
                />
                <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <motion.div style={{ y: heroY }} className="relative z-10 text-center px-6 max-w-3xl mx-auto">
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
                        className="inline-flex items-center gap-2 px-4 py-1.5 border border-border rounded-full text-text-muted text-xs uppercase tracking-[0.2em] font-medium mb-6"
                    >
                        🇵🇪 Lima, Perú
                    </motion.div>
                    <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                        className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-text-primary leading-tight mb-5"
                    >
                        Más de <span className="text-accent">30 años</span><br />vistiendo familias
                    </motion.h1>
                    <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                        className="text-text-muted text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto"
                    >
                        Ropa infantil peruana. Desde Lima para todo el país.
                    </motion.p>
                </motion.div>
            </section>

            {/* ── STATS ── */}
            <motion.section
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                className="bg-bg-surface border-y border-border"
            >
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
                    {stats.map(({ value, label }, i) => (
                        <motion.div key={label} variants={fadeUp} custom={i}
                            className="flex flex-col items-center justify-center py-7 px-4 text-center"
                        >
                            <span className="font-display text-3xl md:text-4xl font-extrabold text-accent leading-none">{value}</span>
                            <span className="text-xs text-text-muted mt-2">{label}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ── HISTORIA + MAPA ── */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}
                    className="grid md:grid-cols-2 gap-12 md:gap-16 items-start"
                >
                    {/* Texto */}
                    <div>
                        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
                            <div className="h-px w-8 bg-accent shrink-0" />
                            <span className="text-accent text-xs uppercase tracking-widest font-semibold">Quiénes somos</span>
                        </motion.div>
                        <motion.h2 variants={fadeUp}
                            className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-5 leading-tight"
                        >
                            Una marca construida con dedicación
                        </motion.h2>
                        <motion.div variants={stagger} className="space-y-4 mb-8">
                            {[
                                'Nacimos en Lima con un propósito claro: ofrecer ropa infantil de calidad a precio justo para todas las familias del Perú.',
                                'Tres décadas después, seguimos creciendo. Hoy llegamos a todo el país, con costureros locales que ponen el corazón en cada prenda.',
                            ].map((text, i) => (
                                <motion.p key={i} variants={fadeUp} custom={i}
                                    className="text-text-muted leading-relaxed text-sm md:text-base"
                                >
                                    {text}
                                </motion.p>
                            ))}
                        </motion.div>

                        {/* Por qué elegirnos */}
                        <motion.div variants={fadeUp}
                            className="bg-bg-surface border border-border rounded-card overflow-hidden"
                        >
                            <div className="bg-accent px-5 py-3">
                                <span className="font-display font-bold text-black text-xs uppercase tracking-wider">
                                    Por qué elegirnos
                                </span>
                            </div>
                            <div className="divide-y divide-border">
                                {[
                                    { Icon: FiGrid,       text: 'Venta al por mayor y menor' },
                                    { Icon: FiAward,      text: 'Producción 100% peruana' },
                                    { Icon: FiCreditCard, text: 'Facilidades de pago' },
                                    { Icon: FiTruck,      text: 'Envíos a todo el Perú' },
                                ].map(({ Icon, text }) => (
                                    <div key={text} className="flex items-center gap-3 px-5 py-3">
                                        <Icon className="w-4 h-4 text-accent shrink-0" />
                                        <span className="text-sm text-text-primary">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Mapa del Perú — SVG path real */}
                    {/* Cobertura nacional — mapa real */}
<motion.div variants={fadeUp} className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
        <div className="h-px w-8 bg-accent shrink-0" />
        <span className="text-accent text-xs uppercase tracking-widest font-semibold">
            Cobertura nacional
        </span>
    </div>

    <div className="relative w-full max-w-[280px] md:max-w-[320px] mx-auto">
        {/* SVG del Perú como imagen base */}
        <img
            src="/maps/peru.svg"
            alt="Mapa del Perú"
            className="w-full h-auto"
            style={{ filter: 'brightness(0.45) sepia(1) hue-rotate(10deg) saturate(2)' }}
        />

        {/* Puntos animados superpuestos — posición % relativa al tamaño del mapa */}
        {[
            { nombre: 'Piura',       top: '29.3%', left: '23.9%', main: true  },
            { nombre: 'Lambayeque',  top: '35.2%', left: '26.2%', main: false },
            { nombre: 'La Libertad', top: '44.1%', left: '32.8%', main: true  },
            { nombre: 'Loreto',      top: '23.5%', left: '51%',  main: true  },
            { nombre: 'San Martín',  top: '39.4%', left: '41%',  main: false },
            { nombre: 'Lima',        top: '63.9%', left: '40.9%', main: true  },
            { nombre: 'Áncash',      top: '50.3%', left: '37%',  main: false },
            { nombre: 'Junín',       top: '60.3%', left: '50.4%', main: false },
            { nombre: 'Cusco',       top: '66%',   left: '60.3%', main: true  },
            { nombre: 'Arequipa',    top: '82.6%', left: '63.2%', main: true  },
            { nombre: 'Puno',        top: '79%',   left: '73.6%', main: true  },
            { nombre: 'Tacna',       top: '92.1%', left: '72.7%', main: true  },
        ].map((depto, i) => (
            <div
                key={depto.nombre}
                className="absolute"
                style={{ top: depto.top, left: depto.left, transform: 'translate(-50%, -50%)' }}
            >
                {/* Pulse */}
                <motion.div
                    className="absolute rounded-full border border-accent"
                    style={{ width: 20, height: 20, top: -10, left: -10 }}
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 2.5 }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.25,
                        ease: 'easeOut',
                    }}
                />
                {/* Punto */}
                <motion.div
                    className={`rounded-full bg-accent ${depto.main ? 'w-3 h-3' : 'w-2 h-2'}`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease: 'backOut' }}
                />
                {/* Label */}
                {depto.main && (
                    <motion.span
                        className="absolute left-4 top-0 text-[10px] text-text-muted whitespace-nowrap font-medium"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.08 }}
                    >
                        {depto.nombre}
                    </motion.span>
                )}
            </div>
        ))}
    </div>

    <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
            <span className="text-xs text-text-muted font-medium">Presencia en todo el territorio nacional</span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed pl-4">
            Llevamos nuestras prendas hasta tu tienda, galería o negocio — 
            coordinando cada envío directamente contigo.
        </p>
    </div>
</motion.div>
                </motion.div>
            </section>

            {/* ── VALORES ── */}
            <section className="bg-bg-surface border-t border-border py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}
                        className="mb-10"
                    >
                        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
                            <div className="h-px w-8 bg-accent" />
                            <span className="text-accent text-xs uppercase tracking-widest font-semibold">Lo que nos define</span>
                        </motion.div>
                        <motion.h2 variants={fadeUp} className="font-display text-2xl md:text-3xl font-bold text-text-primary">
                            Nuestros valores
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5"
                    >
                        {values.map(({ icon: Icon, title, desc }, i) => (
                            <motion.div key={title} variants={fadeUp} custom={i}
                                className="card p-4 md:p-5 group hover:border-accent/30 transition-colors duration-200"
                            >
                                <div className="w-9 h-9 rounded-[6px] bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center mb-3 transition-colors duration-200">
                                    <Icon className="w-4 h-4 text-accent" />
                                </div>
                                <h3 className="font-display font-semibold text-text-primary text-sm mb-1">{title}</h3>
                                <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── AGRADECIMIENTO ── */}
            <section className="bg-bg py-16 md:py-20 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)`,
                    }}
                    aria-hidden
                />
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                    className="relative z-10 max-w-xl mx-auto text-center px-6"
                >
                    <motion.div variants={fadeUp} className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                        <FiHeart className="w-6 h-6 text-accent" />
                    </motion.div>
                    <motion.h2 variants={fadeUp}
                        className="font-display text-2xl md:text-3xl text-text-primary font-bold mb-3"
                    >
                        Gracias por confiar en nosotros
                    </motion.h2>
                    <motion.p variants={fadeUp}
                        className="text-text-muted text-sm leading-relaxed mb-8"
                    >
                        Cada familia que elige Thofy Kids nos motiva a seguir. Gracias por ser parte
                        de esta historia que seguimos escribiendo juntos desde Lima para todo el Perú.
                    </motion.p>
                    <motion.div variants={fadeUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        <Link
                            to="/catalogo"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-black font-bold uppercase tracking-wider text-sm rounded-[6px] hover:bg-accent-dark transition-colors active:scale-[0.98] group"
                        >
                            Ver Catálogo
                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                        <a
                            href={`https://wa.me/${whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-success text-white font-bold uppercase tracking-wider text-sm rounded-[6px] hover:bg-success/90 transition-colors active:scale-[0.98]"
                        >
                            <FaWhatsapp className="w-4 h-4" />
                            WhatsApp
                        </a>
                    </motion.div>
                </motion.div>
            </section>
        </main>
    )
}