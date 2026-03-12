import { FiTool, FiCreditCard, FiAlertTriangle, FiUsers } from 'react-icons/fi'
import { useDashboardStats, useProducciones } from '../../hooks/useSupabase'

const estadoConfig: Record<string, { label: string; color: string }> = {
    PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
    EN_PRODUCCION: { label: 'En Producción', color: 'bg-blue-100 text-blue-700' },
    TERMINADO: { label: 'Terminado', color: 'bg-purple-100 text-purple-700' },
    PAGADO: { label: 'Pagado', color: 'bg-green-100 text-green-700' },
}

export default function Dashboard() {
    const { stats, loading: loadingStats } = useDashboardStats()
    const { data: producciones, loading: loadingProd } = useProducciones()

    const ultimas5 = producciones.slice(0, 5)

    const cards = [
        {
            icon: FiTool,
            label: 'Producciones Activas',
            value: loadingStats ? '...' : stats.produccionesActivas.toString(),
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            icon: FiCreditCard,
            label: 'Pagado Este Mes',
            value: loadingStats ? '...' : `S/. ${stats.pagadoEsteMes.toFixed(2)}`,
            color: 'text-green-500',
            bg: 'bg-green-50',
        },
        {
            icon: FiAlertTriangle,
            label: 'Deuda Total Pendiente',
            value: loadingStats ? '...' : `S/. ${stats.deudaTotal.toFixed(2)}`,
            color: 'text-red-500',
            bg: 'bg-red-50',
        },
        {
            icon: FiUsers,
            label: 'Costureros Activos',
            value: loadingStats ? '...' : stats.costureroActivos.toString(),
            color: 'text-accent',
            bg: 'bg-accent/5',
        },
    ]

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="font-display text-2xl font-bold text-slate-brand">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">Resumen general del negocio</p>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map(({ icon: Icon, label, value, color, bg }) => (
                    <div key={label} className="card p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                            <p className="font-display text-xl font-bold text-slate-brand mt-0.5">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent productions table */}
            <div className="card overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-display font-semibold text-slate-brand">Últimas Producciones</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-3 text-left">Modelo</th>
                                <th className="px-6 py-3 text-left">Costurero</th>
                                <th className="px-6 py-3 text-left">Estado</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3 text-right">Deuda</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loadingProd ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="skeleton h-4 w-20 rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : ultimas5.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        No hay producciones registradas
                                    </td>
                                </tr>
                            ) : (
                                ultimas5.map((p) => {
                                    const conf = estadoConfig[p.estado] ?? { label: p.estado, color: 'bg-gray-100 text-gray-600' }
                                    return (
                                        <tr key={p.id_produccion} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-brand">
                                                {p.modelo?.nombre_modelo ?? `#${p.id_modelo}`}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {p.costurero?.nombre ?? `#${p.id_costurero}`}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`badge ${conf.color}`}>{conf.label}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium">
                                                S/. {p.total_produccion.toFixed(2)}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${p.deuda > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                S/. {p.deuda.toFixed(2)}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
