import { FiHeart, FiAward, FiUsers } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const values = [
    {
        icon: FiHeart,
        title: 'Con amor por los niños',
        desc: 'Cada prenda está diseñada pensando en la comodidad y bienestar de los más pequeños de la familia.',
    },
    {
        icon: FiAward,
        title: 'Calidad garantizada',
        desc: 'Usamos telas de primera calidad que son suaves, duraderas y seguras para pieles sensibles.',
    },
    {
        icon: FiUsers,
        title: 'Producción nacional',
        desc: 'Trabajamos con costureros peruanos, apoyando el trabajo local y garantizando trazabilidad.',
    },
]

export default function Nosotros() {
    return (
        <main>
            {/* Hero */}
            <section
                className="relative py-24 text-white text-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #3D3535 0%, #C98B8B 100%)' }}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
                </div>
                <div className="relative max-w-2xl mx-auto px-4">
                    <h1 className="font-display text-5xl font-bold mb-4">Nuestra Historia</h1>
                    <p className="text-white/80 text-lg">
                        Nacimos de la pasión por vestir a los niños peruanos con ropa que combine estilo, comodidad y calidad.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="max-w-4xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="section-title mb-4">¿Quiénes somos?</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            <strong className="text-slate-brand">Thofy Kids</strong> es una marca de ropa infantil peruana
                            que nació con el propósito de ofrecer prendas de alta calidad para niños de 2 a 16 años.
                            Creemos que los niños merecen ropa cómoda, bonita y duradera, a un precio justo.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Trabajamos directamente con costureros locales, garantizando que cada prenda sea confeccionada
                            con cuidado y dedicación. Nuestra cadena de producción es transparente y comprometida con el
                            trabajo justo.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Desde Lima, llevamos nuestras prendas a familias de todo el Perú a través de pedidos coordinados
                            por WhatsApp, con una atención personalizada y cercana.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-accent/10 to-cream-dark rounded-3xl p-8 text-center">
                        <div className="font-display text-6xl font-bold text-accent mb-2">+500</div>
                        <p className="text-gray-500">familias satisfechas</p>
                        <div className="h-px bg-accent/20 my-6" />
                        <div className="font-display text-6xl font-bold text-accent mb-2">100%</div>
                        <p className="text-gray-500">producción nacional</p>
                        <div className="h-px bg-accent/20 my-6" />
                        <div className="font-display text-6xl font-bold text-accent mb-2">2-16</div>
                        <p className="text-gray-500">rango de tallas</p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-cream-dark py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="section-title">Nuestros Valores</h2>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="card p-6 text-center">
                                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                                    <Icon className="w-7 h-7 text-accent" />
                                </div>
                                <h3 className="font-display font-semibold text-slate-brand mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 text-center px-4">
                <h2 className="section-title mb-4">¿Lista para vestir a tu pequeño?</h2>
                <p className="text-gray-500 mb-8">Explora nuestro catálogo y haz tu pedido fácilmente por WhatsApp.</p>
                <Link to="/catalogo" className="btn-primary">
                    Ver Catálogo <FiArrowRight className="w-4 h-4" />
                </Link>
            </section>
        </main>
    )
}
