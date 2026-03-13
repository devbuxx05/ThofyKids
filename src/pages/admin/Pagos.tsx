import { useState } from 'react'
import { FiSearch, FiX, FiEye, FiTrash2 } from 'react-icons/fi'
import { usePagos, useCostureros } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'

export default function Pagos() {
    // Estados para los filtros
    const [filtroCosturero, setFiltroCosturero] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('')
    const [filtroDesde, setFiltroDesde] = useState('')
    const [filtroHasta, setFiltroHasta] = useState('')

    // Estado para el visor de imágenes (Lightbox)
    const [voucherAmpliado, setVoucherAmpliado] = useState<string | null>(null)

    // Hooks de datos
    const { data: costureros } = useCostureros()
    const { data: pagos, loading, refetch } = usePagos({
        id_costurero: filtroCosturero ? Number(filtroCosturero) : undefined,
        tipo_pago: filtroTipo || undefined,
        desde: filtroDesde || undefined,
        hasta: filtroHasta || undefined
    })

    const limpiarFiltros = () => {
        setFiltroCosturero('')
        setFiltroTipo('')
        setFiltroDesde('')
        setFiltroHasta('')
    }

    const handleDelete = async (pago: any) => {
        const confirmar = window.confirm(
            `¿Estás seguro de eliminar este pago de S/. ${pago.monto.toFixed(2)}?\n\n` +
            `Al hacerlo, la deuda de la producción volverá a aumentar automáticamente.`
        );

        if (!confirmar) return;

        const { error } = await supabase.from('pago_produccion').delete().eq('id_pago', pago.id_pago);
        
        if (error) {
            alert('Error al eliminar el pago: ' + error.message);
        } else {
            // Refresca la tabla para que desaparezca el pago eliminado
            refetch();
        }
    }

    return (
        <div className="space-y-6 animate-fadeIn relative">
            <div>
                <h1 className="font-display text-2xl font-bold text-text-primary">Historial de Pagos</h1>
                <p className="text-text-muted text-sm mt-1">Consulta, verificación y eliminación de comprobantes</p>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="card p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Costurero</label>
                        <select value={filtroCosturero} onChange={(e) => setFiltroCosturero(e.target.value)} className="input-field py-2 text-sm">
                            <option value="">Todos los costureros</option>
                            {costureros.map(c => (
                                <option key={c.id_costurero} value={c.id_costurero}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Método</label>
                        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="input-field py-2 text-sm">
                            <option value="">Todos los métodos</option>
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="YAPE">Yape / Plin</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                            <option value="DEPOSITO">Depósito</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Desde</label>
                        <input type="date" value={filtroDesde} onChange={(e) => setFiltroDesde(e.target.value)} className="input-field py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase mb-2">Hasta</label>
                        <input type="date" value={filtroHasta} onChange={(e) => setFiltroHasta(e.target.value)} className="input-field py-2 text-sm" />
                    </div>
                    <div>
                        <button onClick={limpiarFiltros} className="w-full btn-secondary py-2 flex items-center justify-center gap-2">
                            <FiX className="w-4 h-4" /> Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLA DE PAGOS */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-bg text-xs text-text-muted uppercase tracking-wider">
                                <th className="px-6 py-3 text-left">Fecha</th>
                                <th className="px-6 py-3 text-left">Costurero</th>
                                <th className="px-6 py-3 text-center">Método</th>
                                <th className="px-6 py-3 text-left">Detalle / Ref.</th>
                                <th className="px-6 py-3 text-right">Monto</th>
                                <th className="px-6 py-3 text-center">Comprobante y Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-text-muted">Buscando pagos...</td></tr>
                            ) : pagos?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-text-muted flex flex-col items-center gap-3">
                                        <FiSearch className="w-8 h-8 opacity-50" />
                                        No se encontraron pagos con estos filtros
                                    </td>
                                </tr>
                            ) : pagos?.map((p: any) => (
                                <tr key={p.id_pago} className="hover:bg-[#1F1F1F] transition-colors">
                                    <td className="px-6 py-4 text-text-primary font-mono">{new Date(p.fecha_pago).toLocaleDateString('es-PE')}</td>
                                    <td className="px-6 py-4 font-bold text-text-primary">{p.produccion?.costurero?.nombre || 'Desconocido'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="badge bg-border/50 text-text-muted text-[10px] uppercase">
                                            {p.tipo_pago}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-muted text-xs truncate max-w-[150px]" title={p.detalle}>
                                        {p.detalle || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-success font-mono">
                                        S/. {p.monto.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            {p.comprobante_url ? (
                                                <button 
                                                    onClick={() => setVoucherAmpliado(p.comprobante_url)}
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
                                                <span className="text-text-muted/50 text-xs italic w-10 text-center">N/A</span>
                                            )}
                                            
                                            {/* BOTÓN DE ELIMINAR */}
                                            <button 
                                                onClick={() => handleDelete(p)} 
                                                className="p-2 text-text-muted hover:bg-danger/10 hover:text-danger rounded transition-colors"
                                                title="Eliminar Pago"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL VISOR DE IMAGEN (LIGHTBOX) */}
            {voucherAmpliado && (
                <div 
                    className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-pointer animate-fadeIn"
                    onClick={() => setVoucherAmpliado(null)}
                >
                    <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center">
                        <button 
                            className="absolute top-4 right-4 sm:-top-12 sm:-right-12 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all"
                            onClick={(e) => { e.stopPropagation(); setVoucherAmpliado(null); }}
                            title="Cerrar"
                        >
                            <FiX className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                        
                        <img 
                            src={voucherAmpliado} 
                            alt="Voucher Ampliado" 
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic directo en la foto
                        />
                        <p className="text-white/70 mt-4 text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur">
                            Puedes tomar captura de pantalla. Toca el fondo para cerrar.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}