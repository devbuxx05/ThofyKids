import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiPhone, FiMail } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
    const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER ?? '51XXXXXXXXX'

    return (
        <footer className="bg-[#0A0A0A] text-text-primary border-t-2 border-accent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-display text-xl font-bold tracking-tight">
                                <span className="text-accent">T</span>hofy Kids
                            </span>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Ropa infantil peruana con estilo y comodidad. Porque cada niño merece sentirse especial.
                        </p>
                        <div className="flex gap-3 mt-5">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 border border-border rounded-[6px] flex items-center justify-center text-text-muted hover:border-accent hover:text-accent transition-colors"
                            >
                                <FiInstagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 border border-border rounded-[6px] flex items-center justify-center text-text-muted hover:border-accent hover:text-accent transition-colors"
                            >
                                <FiFacebook className="w-4 h-4" />
                            </a>
                            <a
                                href={`https://wa.me/${whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 border border-border rounded-[6px] flex items-center justify-center text-text-muted hover:border-success hover:text-success transition-colors"
                            >
                                <FaWhatsapp className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-display font-semibold text-sm mb-4 text-text-primary uppercase tracking-wider">
                            Navegación
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { to: '/', label: 'Inicio' },
                                { to: '/catalogo', label: 'Catálogo' },
                                { to: '/nosotros', label: 'Nosotros' },
                            ].map((l) => (
                                <li key={l.to}>
                                    <Link
                                        to={l.to}
                                        className="text-text-muted hover:text-accent text-sm transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display font-semibold text-sm mb-4 text-text-primary uppercase tracking-wider">
                            Contáctanos
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href={`https://wa.me/${whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-text-muted hover:text-success text-sm transition-colors"
                                >
                                    <FaWhatsapp className="w-4 h-4 shrink-0" />
                                    WhatsApp
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:contacto@thofykids.pe"
                                    className="flex items-center gap-2 text-text-muted hover:text-accent text-sm transition-colors"
                                >
                                    <FiMail className="w-4 h-4 shrink-0" />
                                    contacto@thofykids.pe
                                </a>
                            </li>
                            <li>
                                <span className="flex items-center gap-2 text-text-muted text-sm">
                                    <FiPhone className="w-4 h-4 shrink-0" />
                                    Lima, Perú
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-text-muted text-xs">
                        © {new Date().getFullYear()} Thofy Kids. Todos los derechos reservados.
                    </p>
                    <p className="text-text-muted text-xs opacity-80">Hecho con ❤️ en Perú 🇵🇪</p>
                </div>
            </div>
        </footer>
    )
}
