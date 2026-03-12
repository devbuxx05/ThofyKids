import { useState } from 'react'
import { usePagos, useCostureros } from '../../hooks/useSupabase'
import { FiFilter } from 'react-icons/fi'

const TIPOS_PAGO = ['EFECTIVO', 'YAPE', 'TRANSFERENCIA', 'DEPOSITO']

const tipoBadge: Record<string, string> = {
    EFECTIVO: 'bg-green-100 text-green-700',
    YAPE: 'bg-purple-100 text-purple-700',
    TRANSFERENCIA: 'bg-blue-100 text-blue-700',
    DEPOSITO: 'bg-orange-100 text-orange-700',
}

export default function Pagos() {
    const [tipoPago, setTipoPago] = useState('')
    const [desde, setDesde] = useState('')
    const [hasta, setHasta] = useState('')
    const [idCosturero, setIdCosturero] = useState<number | undefined>()

    const { data: costureros } = useCostureros()
    const { data: pagos, loading, error } = usePagos({
        tipo_pago: tipoPago || undefined,
        desde: desde || undefined,
        hasta: hasta || undefined,
        id_costurero: idCosturero,
    })

    const totalFiltrado = pagos.reduce((a, p) => a + p.monto, 0)

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="font-display text-2xl font-bold text-slate-brand">Pagos</h1>
                <p className="text-gray-400 text-sm mt-1">Historial de todos los pagos realizados</p>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                    <FiFilter className="w-4 h-4" /> Filtros
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <select
                        value={idCosturero ?? ''}
                        onChange={(e) => setIdCosturero(e.target.value ? Number(e.target.value) : undefined)}
                        className="input-field"
                    >
                        <option value="">Todos los costureros</option>
                        {costureros.map((c) => (
                            <option key={c.id_costurero} value={c.id_costurero}>{c.nombre}</option>
                        ))}
                    </select>
                    <select
                        value={tipoPago}
                        onChange={(e) => setTipoPago(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Todos los tipos</option>
                        {TIPOS_PAGO.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="flex items-center gap-2">
                        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="input-field" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="input-field" />
                    </div>
                </div>
            </div>

            {/* Summary */}
            {!loading && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{pagos.length} pagos encontrados</span>
                    <span className="font-bold text-slate-brand">Total: S/. {totalFiltrado.toFixed(2)}</span>
                </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-3 text-left">Fecha</th>
                                <th className="px-6 py-3 text-left">Costurero</th>
                                <th className="px-6 py-3 text-left">Producción</th>
                                <th className="px-6 py-3 text-left">Tipo</th>
                                <th className="px-6 py-3 text-right">Monto</th>
                                <th className="px-6 py-3 text-left">Detalle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="skeleton h-4 w-20 rounded" /></td>)}</tr>
                                ))
                            ) : pagos.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No hay pagos registrados con estos filtros</td></tr>
                            ) : pagos.map((p) => (
                                <tr key={p.id_pago} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{new Date(p.fecha_pago).toLocaleDateString('es-PE')}</td>
                                    <td className="px-6 py-4 font-medium text-slate-brand">
                                        {(p.produccion as { costurero?: { nombre?: string } } | undefined)?.costurero?.nombre ?? '—'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">#{p.id_produccion}</td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${tipoBadge[p.tipo_pago] ?? 'bg-gray-100 text-gray-600'}`}>{p.tipo_pago}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-green-600">S/. {p.monto.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">{p.detalle ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
