import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiPhone, FiMail } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
    const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER ?? '51XXXXXXXXX'

    return (
        <footer className="bg-slate-brand text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand col */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                <span className="text-white font-display font-bold text-sm">TK</span>
                            </div>
                            <span className="font-display text-xl font-bold tracking-tight">Thofy Kids</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Ropa infantil peruana con estilo y comodidad. Porque cada niño merece sentirse especial.
                        </p>
                        <div className="flex gap-3 mt-5">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors">
                                <FiInstagram className="w-4 h-4" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors">
                                <FiFacebook className="w-4 h-4" />
                            </a>
                            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 bg-white/10 hover:bg-[#25D366] rounded-full flex items-center justify-center transition-colors">
                                <FaWhatsapp className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links col */}
                    <div>
                        <h4 className="font-display font-semibold text-base mb-4 text-accent-light">
                            Navegación
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { to: '/', label: 'Inicio' },
                                { to: '/catalogo', label: 'Catálogo' },
                                { to: '/nosotros', label: 'Nosotros' },
                            ].map((l) => (
                                <li key={l.to}>
                                    <Link to={l.to}
                                        className="text-gray-300 hover:text-accent-light text-sm transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact col */}
                    <div>
                        <h4 className="font-display font-semibold text-base mb-4 text-accent-light">
                            Contáctanos
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[#25D366] text-sm transition-colors">
                                    <FaWhatsapp className="w-4 h-4 shrink-0" />
                                    WhatsApp
                                </a>
                            </li>
                            <li>
                                <a href="mailto:contacto@thofykids.pe"
                                    className="flex items-center gap-2 text-gray-300 hover:text-accent-light text-sm transition-colors">
                                    <FiMail className="w-4 h-4 shrink-0" />
                                    contacto@thofykids.pe
                                </a>
                            </li>
                            <li>
                                <span className="flex items-center gap-2 text-gray-300 text-sm">
                                    <FiPhone className="w-4 h-4 shrink-0" />
                                    Lima, Perú
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-gray-400 text-xs">
                        © {new Date().getFullYear()} Thofy Kids. Todos los derechos reservados.
                    </p>
                    <p className="text-gray-500 text-xs">Hecho con ❤️ en Perú 🇵🇪</p>
                </div>
            </div>
        </footer>
    )
}
