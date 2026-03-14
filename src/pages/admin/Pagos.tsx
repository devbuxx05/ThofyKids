import { useState } from 'react'
import { FiSearch, FiX, FiEye, FiTrash2 } from 'react-icons/fi'
import { usePagos, useCostureros } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'
import type { PagoProduccion } from '../../types'

interface PagoConProduccion extends PagoProduccion {
    produccion: {
        id_produccion: number
        id_modelo: number
        estado: string
        id_costurero: number
        costurero: { nombre: string }
    }
}

export default function Pagos() {
    const [filtroCosturero, setFiltroCosturero] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('')
    const [filtroDesde, setFiltroDesde] = useState('')
    const [filtroHasta, setFiltroHasta] = useState('')
    const [voucherAmpliado, setVoucherAmpliado] = useState<string | null>(null)

    const { data: costureros } = useCostureros()
    const { data: pagos, loading, refetch } = usePagos({
        id_costurero: filtroCosturero ? Number(filtroCosturero) : undefined,
        tipo_pago: filtroTipo || undefined,
        desde: filtroDesde || undefined,
        hasta: filtroHasta || undefined,
    })

    const limpiarFiltros = () => {
        setFiltroCosturero('')
        setFiltroTipo('')
        setFiltroDesde('')
        setFiltroHasta('')
    }

    const handleDelete = async (pago: PagoConProduccion) => {
        if (!window.confirm(
            `¿Eliminar este pago de S/. ${pago.monto.toFixed(2)}?\n\nLa deuda de la producción volverá a aumentar automáticamente.`
        )) return

        const { error } = await supabase
            .from('pago_produccion')
            .delete()
            .eq('id_pago', pago.id_pago)

        if (error) {
            alert('Error al eliminar el pago: ' + error.message)
        } else {
            refetch()
        }
    }

    const tipoBadgeColor: Record<string, string> = {
        EFECTIVO:      'bg-border text-text-muted',
        YAPE:          'bg-green-500/10 text-green-400',
        TRANSFERENCIA: 'bg-blue-500/10 text-blue-400',
        DEPOSITO:      'bg-accent/10 text-accent',
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="font-display text-2xl font-bold text-text-primary">Historial de Pagos</h1>
                <p className="text-text-muted text-sm mt-1">Consulta, verificación y eliminación de comprobantes</p>
            </div>

            {/* FILTROS */}
            <div className="card p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Costurero</label>
                        <select
                            value={filtroCosturero}
                            onChange={(e) => setFiltroCosturero(e.target.value)}
                            className="input-field py-2 text-sm"
                        >
                            <option value="">Todos</option>
                            {costureros.map(c => (
                                <option key={c.id_costurero} value={c.id_costurero}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Método</label>
                        <select
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="input-field py-2 text-sm"
                        >
                            <option value="">Todos</option>
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="YAPE">Yape / Plin</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                            <option value="DEPOSITO">Depósito</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Desde</label>
                        <input
                            type="date"
                            value={filtroDesde}
                            onChange={(e) => setFiltroDesde(e.target.value)}
                            className="input-field py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Hasta</label>
                        <input
                            type="date"
                            value={filtroHasta}
                            onChange={(e) => setFiltroHasta(e.target.value)}
                            className="input-field py-2 text-sm"
                        />
                    </div>
                    <div>
                        <button
                            onClick={limpiarFiltros}
                            className="w-full btn-secondary py-2 flex items-center justify-center gap-2"
                        >
                            <FiX className="w-4 h-4" /> Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-bg text-xs text-text-muted uppercase tracking-wider">
                                <th className="px-6 py-3 text-left">Fecha</th>
                                <th className="px-6 py-3 text-left">Costurero</th>
                                <th className="px-6 py-3 text-center">Método</th>
                                <th className="px-6 py-3 text-left">Detalle</th>
                                <th className="px-6 py-3 text-right">Monto</th>
                                <th className="px-6 py-3 text-center">Comprobante</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="skeleton h-4 w-20 rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : pagos.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                                        <FiSearch className="w-8 h-8 opacity-40 mx-auto mb-2" />
                                        No se encontraron pagos con estos filtros
                                    </td>
                                </tr>
                            ) : (pagos as PagoConProduccion[]).map((p) => (
                                <tr key={p.id_pago} className="hover:bg-bg-elevated transition-colors duration-200">
                                    <td className="px-6 py-4 font-mono text-text-primary">
                                        {new Date(p.fecha_pago + 'T00:00:00').toLocaleDateString('es-PE')}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-text-primary">
                                        {p.produccion?.costurero?.nombre ?? '—'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`badge text-[10px] uppercase ${tipoBadgeColor[p.tipo_pago] ?? 'bg-border text-text-muted'}`}>
                                            {p.tipo_pago}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted text-xs truncate max-w-[150px]" title={p.detalle}>
                                        {p.detalle || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold font-mono text-success">
                                        S/. {p.monto.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {p.comprobante_url ? (
                                            <button
                                                onClick={() => setVoucherAmpliado(p.comprobante_url!)}
                                                className="relative inline-block w-10 h-10 rounded overflow-hidden border border-border hover:border-accent transition-all group"
                                                title="Ver comprobante"
                                            >
                                                <img
                                                    src={p.comprobante_url}
                                                    alt="Voucher"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FiEye className="w-4 h-4 text-white" />
                                                </div>
                                            </button>
                                        ) : (
                                            <span className="text-text-muted/50 text-xs italic">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(p)}
                                            className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-[6px] transition-colors duration-200"
                                            title="Eliminar pago"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* LIGHTBOX */}
            {voucherAmpliado && (
                <div
                    className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-pointer animate-fadeIn"
                    onClick={() => setVoucherAmpliado(null)}
                >
                    <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center">
                        <button
                            className="absolute top-4 right-4 sm:-top-12 sm:-right-12 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all"
                            onClick={(e) => { e.stopPropagation(); setVoucherAmpliado(null) }}
                        >
                            <FiX className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                        <img
                            src={voucherAmpliado}
                            alt="Voucher ampliado"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <p className="text-white/70 mt-4 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur">
                            Toca el fondo para cerrar
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}