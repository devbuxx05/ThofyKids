import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

        if (authError) {
            setError('Credenciales incorrectas. Verifica tu email y contraseña.')
            setLoading(false)
        } else {
            navigate('/admin/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="font-display text-2xl font-bold text-text-primary">
                        <span className="text-accent">T</span>hofy Kids
                    </span>
                    <h1 className="font-display text-xl font-bold text-text-primary mt-4">Panel Admin</h1>
                    <p className="text-text-muted text-sm mt-1">Acceso Interno</p>
                </div>

                <div className="bg-bg-surface border border-border rounded-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-field pl-10"
                                    placeholder="admin@thofykids.pe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                                Contraseña
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                                <input
                                    id="login-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 bg-danger/10 border border-danger/30 text-danger text-sm rounded-[6px] px-3 py-2.5">
                                <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                {error}
                            </div>
                        )}

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                'Ingresar'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-text-muted text-xs mt-6">
                    Solo para personal autorizado de Thofy Kids
                </p>
            </div>
        </div>
    )
}
