import { useState } from 'react'
import { FiPlus, FiDollarSign, FiEye, FiUpload, FiX, FiCheck, FiTrash2 } from 'react-icons/fi'
import { AdminModal } from '../../components/admin/AdminModal'
import { useProducciones, useModelosAdmin, useCostureros } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'
import type { ProduccionConDeuda } from '../../types'

const emptyForm = {
    id_modelo: '',
    id_costurero: '',
    cantidad_prendas: '',
    precio_costura: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
}

const emptyPago = {
    tipo_pago: 'TRANSFERENCIA',
    monto: '',
    detalle: '',
    fecha_pago: new Date().toISOString().split('T')[0],
}

const emptyDetalles = {
    estado: 'EN_PRODUCCION',
    cantidad_falladas: '',
    fecha_termino: '',
    observacion: '',
}

export default function Produccion() {
    const { data: producciones, loading, refetch } = useProducciones()
    const { data: cortes } = useModelosAdmin()
    const { data: costureros } = useCostureros()

    const [showCreate, setShowCreate] = useState(false)
    const [showPago, setShowPago] = useState(false)
    const [showDetalles, setShowDetalles] = useState(false)

    const [form, setForm] = useState(emptyForm)
    const [pagoForm, setPagoForm] = useState(emptyPago)
    const [detallesForm, setDetallesForm] = useState(emptyDetalles)
    const [comprobanteFile, setComprobanteFile] = useState<File | null>(null)

    const [selectedProd, setSelectedProd] = useState<ProduccionConDeuda | null>(null)
    const [saving, setSaving] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // --- CREAR ---
    const handleCreate = async () => {
        if (!form.id_modelo || !form.id_costurero || !form.cantidad_prendas || !form.precio_costura) {
            setErrorMsg('Por favor completa todos los campos obligatorios.')
            return
        }

        // Verificar que el corte no esté ocupado
        const { data: existe } = await supabase
            .from('produccion')
            .select('id_produccion')
            .eq('id_modelo', Number(form.id_modelo))
            .in('estado', ['PENDIENTE', 'EN_PRODUCCION'])
            .maybeSingle()

        if (existe) {
            setErrorMsg('Este corte ya tiene una producción activa (Pendiente o En Producción). Espera a que termine antes de asignarlo de nuevo.')
            return
        }

        setSaving(true)
        setErrorMsg('')
        try {
            const { error } = await supabase.from('produccion').insert([{
                id_modelo: Number(form.id_modelo),
                id_costurero: Number(form.id_costurero),
                cantidad_prendas: Number(form.cantidad_prendas),
                precio_costura: Number(form.precio_costura),
                fecha_inicio: form.fecha_inicio,
                estado: 'EN_PRODUCCION',
            }])
            if (error) throw error
            setShowCreate(false)
            setForm(emptyForm)
            refetch()
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Error al crear la producción')
        } finally {
            setSaving(false)
        }
    }

    //ELIMINAR
    const handleDelete = async (p: ProduccionConDeuda) => {
    if (!window.confirm(`¿Eliminar la producción de "${p.modelo?.nombre_modelo}"? Esta acción no se puede deshacer.`)) return

    // Verificar si tiene pagos
        const { data: pagos } = await supabase
            .from('pago_produccion')
            .select('id_pago')
            .eq('id_produccion', p.id_produccion)
            .limit(1)

        if (pagos && pagos.length > 0) {
            alert('No puedes eliminar esta producción porque ya tiene pagos registrados.')
            return
        }

        const { error } = await supabase
            .from('produccion')
            .delete()
            .eq('id_produccion', p.id_produccion)

        if (error) {
            alert('Error al eliminar: ' + error.message)
        } else {
            refetch()
        }
    }

    // --- PAGO ---
    const handleSavePago = async () => {
        if (!pagoForm.monto || Number(pagoForm.monto) <= 0) {
            setErrorMsg('El monto debe ser mayor a 0.')
            return
        }
        if (!selectedProd) return
        setSaving(true)
        setErrorMsg('')
        try {
            let comprobante_url = null
            if (comprobanteFile) {
                const ext = comprobanteFile.name.split('.').pop()
                const fileName = `comprobantes/pago_${Date.now()}.${ext}`
                const { error: upErr } = await supabase.storage
                    .from('fotos')
                    .upload(fileName, comprobanteFile)
                if (upErr) throw new Error(`Error subiendo comprobante: ${upErr.message}`)
                const { data } = supabase.storage.from('fotos').getPublicUrl(fileName)
                comprobante_url = data.publicUrl
            }

            const { error } = await supabase.from('pago_produccion').insert([{
                id_produccion: selectedProd.id_produccion,
                tipo_pago: pagoForm.tipo_pago,
                monto: Number(pagoForm.monto),
                fecha_pago: pagoForm.fecha_pago,
                detalle: pagoForm.detalle,
                comprobante_url,
            }])
            if (error) throw error

            setShowPago(false)
            setPagoForm(emptyPago)
            setComprobanteFile(null)
            refetch()
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Error al procesar el pago')
        } finally {
            setSaving(false)
        }
    }

    // --- DETALLES ---
    const handleSaveDetalles = async () => {
        if (!selectedProd) return
        setSaving(true)
        setErrorMsg('')
        try {
            const { error } = await supabase
                .from('produccion')
                .update({
                    estado: detallesForm.estado,
                    cantidad_falladas: Number(detallesForm.cantidad_falladas) || 0,
                    observacion: detallesForm.observacion,
                    fecha_termino: detallesForm.fecha_termino || null,
                })
                .eq('id_produccion', selectedProd.id_produccion)
            if (error) throw error
            setShowDetalles(false)
            refetch()
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Error al guardar los detalles')
        } finally {
            setSaving(false)
        }
    }

    // --- ABRIR MODALES ---
    const openPagoModal = (prod: ProduccionConDeuda) => {
        setSelectedProd(prod)
        setPagoForm(emptyPago)
        setComprobanteFile(null)
        setErrorMsg('')
        setShowPago(true)
    }

    const openDetallesModal = (prod: ProduccionConDeuda) => {
        setSelectedProd(prod)
        setDetallesForm({
            estado: prod.estado,
            cantidad_falladas: String(prod.cantidad_falladas ?? ''),
            fecha_termino: prod.fecha_termino ?? '',
            observacion: prod.observacion ?? '',
        })
        setErrorMsg('')
        setShowDetalles(true)
    }

    const estadoBadge = (estado: string) => {
        const map: Record<string, string> = {
            PENDIENTE:      'bg-border text-text-muted',
            EN_PRODUCCION:  'bg-blue-500/20 text-blue-400',
            TERMINADO:      'bg-accent/20 text-accent',
            PAGADO:         'bg-green-500/20 text-green-400',
        }
        const labels: Record<string, string> = {
            PENDIENTE:     'Pendiente',
            EN_PRODUCCION: 'En Producción',
            TERMINADO:     'Terminado',
            PAGADO:        'Pagado',
        }
        return { color: map[estado] ?? 'bg-border text-text-muted', label: labels[estado] ?? estado }
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">Producción</h1>
                    <p className="text-text-muted text-sm mt-1">Gestión de cortes, costureros y estados</p>
                </div>
                <button
                    onClick={() => { setForm(emptyForm); setErrorMsg(''); setShowCreate(true) }}
                    className="btn-primary"
                >
                    <FiPlus className="w-4 h-4" /> Nueva Producción
                </button>
            </div>

            {/* TABLA */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-bg text-xs text-text-muted uppercase tracking-wider">
                                <th className="px-6 py-3 text-left">Corte / Modelo</th>
                                <th className="px-6 py-3 text-left">Costurero</th>
                                <th className="px-6 py-3 text-center">Cant.</th>
                                <th className="px-6 py-3 text-right">Costo Total</th>
                                <th className="px-6 py-3 text-right">Deuda</th>
                                <th className="px-6 py-3 text-center">Estado</th>
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
                            ) : producciones.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                                        No hay producciones registradas
                                    </td>
                                </tr>
                            ) : producciones.map((p) => {
                                const { color, label } = estadoBadge(p.estado)
                                return (
                                    <tr key={p.id_produccion} className="hover:bg-bg-elevated transition-colors duration-200">
                                        <td className="px-6 py-4 font-medium text-text-primary">
                                            {p.modelo?.nombre_modelo ?? `#${p.id_modelo}`}
                                        </td>
                                        <td className="px-6 py-4 text-text-muted">
                                            {p.costurero?.nombre ?? `#${p.id_costurero}`}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-text-primary">
                                            {p.cantidad_prendas}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-text-primary">
                                            S/. {p.total_produccion.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-bold">
                                            {p.deuda > 0
                                                ? <span className="text-danger">S/. {p.deuda.toFixed(2)}</span>
                                                : <span className="text-success">Pagado</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`badge ${color}`}>{label}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openDetallesModal(p)}
                                                    className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-[6px] transition-colors duration-200"
                                                    title="Ver y editar detalles"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                {p.deuda > 0 && (
                                                    <button
                                                        onClick={() => openPagoModal(p)}
                                                        className="p-1.5 text-text-muted hover:text-success hover:bg-success/10 rounded-[6px] transition-colors duration-200"
                                                        title="Registrar pago"
                                                    >
                                                        <FiDollarSign className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(p)}
                                                    className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-[6px] transition-colors duration-200"
                                                    title="Eliminar producción"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: NUEVA PRODUCCIÓN */}
            <AdminModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                title="Nueva Producción"
                maxWidth="md"
                footer={
                    <>
                        <button onClick={() => setShowCreate(false)} className="btn-secondary text-sm">Cancelar</button>
                        <button onClick={handleCreate} disabled={saving} className="btn-primary text-sm">
                            {saving ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Crear Producción'}
                        </button>
                    </>
                }
            >
                {errorMsg && <div className="text-danger text-sm mb-4 bg-danger/10 p-3 rounded-[6px]">{errorMsg}</div>}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Corte *</label>
                        <select value={form.id_modelo} onChange={e => setForm({ ...form, id_modelo: e.target.value })} className="input-field">
                            <option value="">Seleccionar corte...</option>
                            {cortes.filter(c => c.activo).map(c => (
                                <option key={c.id_modelo} value={c.id_modelo}>{c.nombre_modelo}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Costurero *</label>
                        <select value={form.id_costurero} onChange={e => setForm({ ...form, id_costurero: e.target.value })} className="input-field">
                            <option value="">Seleccionar costurero...</option>
                            {costureros.filter(c => c.activo).map(c => (
                                <option key={c.id_costurero} value={c.id_costurero}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Cantidad *</label>
                            <input type="number" value={form.cantidad_prendas} onChange={e => setForm({ ...form, cantidad_prendas: e.target.value })} className="input-field" placeholder="100" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Precio costura c/u *</label>
                            <input type="number" step="0.10" value={form.precio_costura} onChange={e => setForm({ ...form, precio_costura: e.target.value })} className="input-field" placeholder="4.50" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Fecha inicio</label>
                        <input type="date" value={form.fecha_inicio} onChange={e => setForm({ ...form, fecha_inicio: e.target.value })} className="input-field" />
                    </div>
                </div>
            </AdminModal>

            {/* MODAL 2: REGISTRAR PAGO */}
            <AdminModal
                isOpen={showPago}
                onClose={() => setShowPago(false)}
                title={`Registrar Pago — ${selectedProd?.costurero?.nombre}`}
                maxWidth="sm"
                footer={
                    <>
                        <button onClick={() => setShowPago(false)} className="btn-secondary text-sm">Cancelar</button>
                        <button onClick={handleSavePago} disabled={saving} className="w-full bg-success hover:bg-success/90 text-white font-bold px-4 py-2 rounded-[6px] text-sm transition-colors">
                            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto block" /> : 'Confirmar Pago'}
                        </button>
                    </>
                }
            >
                {errorMsg && <div className="text-danger text-sm mb-4 bg-danger/10 p-3 rounded-[6px]">{errorMsg}</div>}

                <div className="bg-bg border border-border rounded-[6px] p-4 mb-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-text-muted uppercase tracking-wide">Deuda actual</p>
                        <p className="text-2xl font-bold text-danger font-mono">
                            S/. {selectedProd?.deuda.toFixed(2)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-text-muted uppercase tracking-wide">Prendas</p>
                        <p className="font-bold text-text-primary font-mono">{selectedProd?.cantidad_prendas}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Fecha del pago *</label>
                        <input type="date" value={pagoForm.fecha_pago} onChange={e => setPagoForm({ ...pagoForm, fecha_pago: e.target.value })} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Monto (S/.) *</label>
                        <input type="number" step="0.10" value={pagoForm.monto} onChange={e => setPagoForm({ ...pagoForm, monto: e.target.value })} className="input-field text-lg font-bold" autoFocus />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Método de pago</label>
                        <select value={pagoForm.tipo_pago} onChange={e => setPagoForm({ ...pagoForm, tipo_pago: e.target.value })} className="input-field">
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="YAPE">Yape / Plin</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                            <option value="DEPOSITO">Depósito</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Detalle (opcional)</label>
                        <textarea value={pagoForm.detalle} onChange={e => setPagoForm({ ...pagoForm, detalle: e.target.value })} rows={2} className="input-field resize-none" placeholder="Adelanto, Nro. de operación..." />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Comprobante (opcional)</label>
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-[6px] p-4 hover:border-accent hover:bg-accent/5 cursor-pointer transition-colors group">
                            {comprobanteFile ? (
                                <><FiCheck className="text-success w-5 h-5" /><span className="text-sm text-text-primary truncate">{comprobanteFile.name}</span></>
                            ) : (
                                <><FiUpload className="text-text-muted group-hover:text-accent w-5 h-5" /><span className="text-sm text-text-muted group-hover:text-accent">Subir imagen</span></>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setComprobanteFile(e.target.files?.[0] || null)} />
                        </label>
                        {comprobanteFile && (
                            <button onClick={() => setComprobanteFile(null)} className="mt-2 text-xs text-danger hover:underline flex items-center gap-1">
                                <FiX className="w-3 h-3" /> Quitar archivo
                            </button>
                        )}
                    </div>
                </div>
            </AdminModal>

            {/* MODAL 3: DETALLES */}
            <AdminModal
                isOpen={showDetalles}
                onClose={() => setShowDetalles(false)}
                title={`Detalles — ${selectedProd?.modelo?.nombre_modelo}`}
                maxWidth="sm"
                footer={
                    <>
                        <button onClick={() => setShowDetalles(false)} className="btn-secondary text-sm">Cerrar</button>
                        <button onClick={handleSaveDetalles} disabled={saving} className="btn-primary text-sm">
                            {saving ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Guardar Cambios'}
                        </button>
                    </>
                }
            >
                {errorMsg && <div className="text-danger text-sm mb-4 bg-danger/10 p-3 rounded-[6px]">{errorMsg}</div>}

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 bg-bg border border-border rounded-[6px] p-3">
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wide">Costurero</p>
                            <p className="text-sm font-bold text-text-primary">{selectedProd?.costurero?.nombre}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wide">Prendas</p>
                            <p className="text-sm font-bold text-text-primary font-mono">{selectedProd?.cantidad_prendas}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wide">Costo total</p>
                            <p className="text-sm font-bold text-accent font-mono">S/. {selectedProd?.total_produccion.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-wide">Fecha inicio</p>
                            <p className="text-sm font-bold text-text-primary">
                                {selectedProd?.fecha_inicio
                                    ? new Date(selectedProd.fecha_inicio + 'T00:00:00').toLocaleDateString('es-PE')
                                    : '—'
                                }
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Estado</label>
                        <select value={detallesForm.estado} onChange={e => setDetallesForm({ ...detallesForm, estado: e.target.value })} className="input-field">
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="EN_PRODUCCION">En Producción</option>
                            <option value="TERMINADO">Terminado</option>
                            <option value="PAGADO">Pagado</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Prendas falladas</label>
                            <input type="number" min="0" value={detallesForm.cantidad_falladas} onChange={e => setDetallesForm({ ...detallesForm, cantidad_falladas: e.target.value })} className="input-field" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Fecha entrega</label>
                            <input type="date" value={detallesForm.fecha_termino} onChange={e => setDetallesForm({ ...detallesForm, fecha_termino: e.target.value })} className="input-field" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Observaciones</label>
                        <textarea value={detallesForm.observacion} onChange={e => setDetallesForm({ ...detallesForm, observacion: e.target.value })} rows={3} className="input-field resize-none" placeholder="Faltan botones, tela manchada..." />
                    </div>
                </div>
            </AdminModal>
        </div>
    )
}