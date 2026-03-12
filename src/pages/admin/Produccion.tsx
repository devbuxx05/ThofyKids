import { useState } from 'react'
import { FiPlus, FiEye, FiChevronDown, FiX, FiDollarSign } from 'react-icons/fi'
import { useProducciones, useCostureros, useModelosAdmin } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'
import type { EstadoProduccion, TipoPago, ProduccionConDeuda, PagoProduccion } from '../../types'

const ESTADOS: EstadoProduccion[] = ['PENDIENTE', 'EN_PRODUCCION', 'TERMINADO', 'PAGADO']
const TIPOS_PAGO: TipoPago[] = ['EFECTIVO', 'YAPE', 'TRANSFERENCIA', 'DEPOSITO']

const estadoConfig: Record<string, { label: string; color: string }> = {
    PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
    EN_PRODUCCION: { label: 'En Producción', color: 'bg-blue-100 text-blue-700' },
    TERMINADO: { label: 'Terminado', color: 'bg-purple-100 text-purple-700' },
    PAGADO: { label: 'Pagado', color: 'bg-green-100 text-green-700' },
}

const tipoBadge: Record<string, string> = {
    EFECTIVO: 'bg-green-100 text-green-700',
    YAPE: 'bg-purple-100 text-purple-700',
    TRANSFERENCIA: 'bg-blue-100 text-blue-700',
    DEPOSITO: 'bg-orange-100 text-orange-700',
}

type Mode = 'list' | 'detail' | 'create'

const emptyProd = {
    id_modelo: '',
    id_costurero: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_termino: '',
    cantidad_prendas: '',
    precio_costura: '',
    cantidad_entregada: '',
    cantidad_falladas: '',
    foto_referencial: '',
    estado: 'PENDIENTE' as EstadoProduccion,
    observacion: '',
}

export default function Produccion() {
    const [mode, setMode] = useState<Mode>('list')
    const [selected, setSelected] = useState<ProduccionConDeuda | null>(null)
    const [filtroEstado, setFiltroEstado] = useState('')
    const [filtroCosturero, setFiltroCosturero] = useState<number | undefined>()
    const [form, setForm] = useState(emptyProd)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')

    // Payment modal
    const [showPagoModal, setShowPagoModal] = useState(false)
    const [pagoForm, setPagoForm] = useState({ tipo_pago: 'EFECTIVO' as TipoPago, monto: '', fecha_pago: new Date().toISOString().split('T')[0], detalle: '' })
    const [savingPago, setSavingPago] = useState(false)

    const { data: producciones, loading, error, refetch } = useProducciones({
        estado: filtroEstado || undefined,
        id_costurero: filtroCosturero,
    })
    const { data: costureros } = useCostureros(true)
    const { data: modelos } = useModelosAdmin()

    const handleView = (p: ProduccionConDeuda) => {
        setSelected(p)
        setMode('detail')
    }

    const handleCreate = async () => {
        if (!form.id_modelo || !form.id_costurero || !form.fecha_inicio || !form.cantidad_prendas || !form.precio_costura) {
            setFormError('Modelo, costurero, fecha inicio, cantidad y precio son obligatorios.')
            return
        }
        setSaving(true)
        setFormError('')
        const { error } = await supabase.from('produccion').insert({
            id_modelo: Number(form.id_modelo),
            id_costurero: Number(form.id_costurero),
            fecha_inicio: form.fecha_inicio,
            fecha_termino: form.fecha_termino || null,
            cantidad_prendas: Number(form.cantidad_prendas),
            precio_costura: Number(form.precio_costura),
            cantidad_entregada: form.cantidad_entregada ? Number(form.cantidad_entregada) : null,
            cantidad_falladas: form.cantidad_falladas ? Number(form.cantidad_falladas) : null,
            foto_referencial: form.foto_referencial || null,
            estado: form.estado,
            observacion: form.observacion || null,
        })
        setSaving(false)
        if (error) { setFormError(error.message); return }
        setMode('list')
        setForm(emptyProd)
        refetch()
    }

    const handleChangeEstado = async (p: ProduccionConDeuda, estado: EstadoProduccion) => {
        await supabase.from('produccion').update({ estado }).eq('id_produccion', p.id_produccion)
        refetch()
        if (selected?.id_produccion === p.id_produccion) {
            setSelected({ ...p, estado })
        }
    }

    const handleRegisterPago = async () => {
        if (!pagoForm.monto || Number(pagoForm.monto) <= 0) {
            return
        }
        setSavingPago(true)
        await supabase.from('pago_produccion').insert({
            id_produccion: selected!.id_produccion,
            tipo_pago: pagoForm.tipo_pago,
            monto: Number(pagoForm.monto),
            fecha_pago: pagoForm.fecha_pago,
            detalle: pagoForm.detalle || null,
        })
        setSavingPago(false)
        setShowPagoModal(false)
        setPagoForm({ tipo_pago: 'EFECTIVO', monto: '', fecha_pago: new Date().toISOString().split('T')[0], detalle: '' })
        refetch()
        // Refresh selected
        const updated = producciones.find((p) => p.id_produccion === selected!.id_produccion)
        if (updated) {
            // Re-fetch to get updated pagos
            setTimeout(() => { refetch() }, 300)
        }
    }

    // ── List view ────────────────────────────────────────────
    if (mode === 'list') return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-slate-brand">Producción</h1>
                    <p className="text-gray-400 text-sm mt-1">Seguimiento de órdenes de producción</p>
                </div>
                <button onClick={() => setMode('create')} className="btn-primary"><FiPlus className="w-4 h-4" /> Nueva Producción</button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="input-field w-auto">
                    <option value="">Todos los estados</option>
                    {ESTADOS.map((s) => <option key={s} value={s}>{estadoConfig[s].label}</option>)}
                </select>
                <select value={filtroCosturero ?? ''} onChange={(e) => setFiltroCosturero(e.target.value ? Number(e.target.value) : undefined)} className="input-field w-auto">
                    <option value="">Todos los costureros</option>
                    {costureros.map((c) => <option key={c.id_costurero} value={c.id_costurero}>{c.nombre}</option>)}
                </select>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-3 text-left">Modelo</th>
                                <th className="px-6 py-3 text-left">Costurero</th>
                                <th className="px-6 py-3 text-left">Fecha Inicio</th>
                                <th className="px-6 py-3 text-center">Cant.</th>
                                <th className="px-6 py-3 text-left">Estado</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3 text-right">Deuda</th>
                                <th className="px-6 py-3 text-right">Ver</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="skeleton h-4 w-16 rounded" /></td>)}</tr>)
                            ) : producciones.length === 0 ? (
                                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">No hay producciones registradas</td></tr>
                            ) : producciones.map((p) => {
                                const conf = estadoConfig[p.estado]
                                return (
                                    <tr key={p.id_produccion} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-brand whitespace-nowrap">{p.modelo?.nombre_modelo ?? `#${p.id_modelo}`}</td>
                                        <td className="px-6 py-4 text-gray-600">{p.costurero?.nombre ?? '—'}</td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(p.fecha_inicio).toLocaleDateString('es-PE')}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{p.cantidad_prendas}</td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <select
                                                    value={p.estado}
                                                    onChange={(e) => handleChangeEstado(p, e.target.value as EstadoProduccion)}
                                                    className={`badge pr-6 appearance-none cursor-pointer ${conf.color}`}
                                                    style={{ paddingRight: '1.5rem' }}
                                                >
                                                    {ESTADOS.map((s) => <option key={s} value={s}>{estadoConfig[s].label}</option>)}
                                                </select>
                                                <FiChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">S/. {p.total_produccion.toFixed(2)}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${p.deuda > 0 ? 'text-red-500' : 'text-green-500'}`}>S/. {p.deuda.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleView(p)} className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

    // ── Create view ──────────────────────────────────────────
    if (mode === 'create') return (
        <div className="max-w-2xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setMode('list')} className="text-gray-400 hover:text-gray-600 text-sm">← Volver</button>
                <h1 className="font-display text-2xl font-bold text-slate-brand">Nueva Producción</h1>
            </div>
            <div className="card p-6 space-y-4">
                {formError && <p className="text-red-400 text-sm bg-red-50 rounded-lg px-3 py-2">{formError}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Modelo *</label>
                        <select value={form.id_modelo} onChange={(e) => setForm((f) => ({ ...f, id_modelo: e.target.value }))} className="input-field">
                            <option value="">Seleccionar modelo</option>
                            {modelos.map((m) => <option key={m.id_modelo} value={m.id_modelo}>{m.nombre_modelo}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Costurero *</label>
                        <select value={form.id_costurero} onChange={(e) => setForm((f) => ({ ...f, id_costurero: e.target.value }))} className="input-field">
                            <option value="">Seleccionar costurero</option>
                            {costureros.map((c) => <option key={c.id_costurero} value={c.id_costurero}>{c.nombre}</option>)}
                        </select>
                    </div>
                    {[
                        { field: 'fecha_inicio', label: 'Fecha Inicio *', type: 'date' },
                        { field: 'fecha_termino', label: 'Fecha Término', type: 'date' },
                        { field: 'cantidad_prendas', label: 'Cantidad de Prendas *', type: 'number' },
                        { field: 'precio_costura', label: 'Precio Costura (S/.) *', type: 'number' },
                        { field: 'cantidad_entregada', label: 'Cantidad Entregada', type: 'number' },
                        { field: 'cantidad_falladas', label: 'Cantidad Falladas', type: 'number' },
                    ].map(({ field, label, type }) => (
                        <div key={field}>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                            <input type={type} value={(form as Record<string, unknown>)[field] as string} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} className="input-field" min={type === 'number' ? '0' : undefined} step={field === 'precio_costura' ? '0.01' : undefined} />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Estado</label>
                        <select value={form.estado} onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value as EstadoProduccion }))} className="input-field">
                            {ESTADOS.map((s) => <option key={s} value={s}>{estadoConfig[s].label}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Observación</label>
                        <textarea value={form.observacion} onChange={(e) => setForm((f) => ({ ...f, observacion: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Notas adicionales..." />
                    </div>
                </div>
                {form.cantidad_prendas && form.precio_costura && (
                    <div className="bg-cream rounded-xl p-4 text-sm">
                        <span className="text-gray-500">Total estimado: </span>
                        <span className="font-bold text-slate-brand">S/. {(Number(form.cantidad_prendas) * Number(form.precio_costura)).toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setMode('list')} className="btn-secondary text-sm">Cancelar</button>
                    <button onClick={handleCreate} disabled={saving} className="btn-primary text-sm">
                        {saving ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : 'Crear Producción'}
                    </button>
                </div>
            </div>
        </div>
    )

    // ── Detail view ──────────────────────────────────────────
    if (mode === 'detail' && selected) {
        const conf = estadoConfig[selected.estado]
        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 flex-wrap">
                    <button onClick={() => { setMode('list'); refetch() }} className="text-gray-400 hover:text-gray-600 text-sm">← Volver</button>
                    <h1 className="font-display text-2xl font-bold text-slate-brand">{selected.modelo?.nombre_modelo ?? `Producción #${selected.id_produccion}`}</h1>
                    <span className={`badge ${conf.color}`}>{conf.label}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Info card */}
                    <div className="card p-6 space-y-3">
                        <h2 className="font-display font-semibold text-slate-brand mb-4">Información</h2>
                        {[
                            { label: 'Costurero', value: selected.costurero?.nombre ?? '—' },
                            { label: 'Fecha Inicio', value: new Date(selected.fecha_inicio).toLocaleDateString('es-PE') },
                            { label: 'Fecha Término', value: selected.fecha_termino ? new Date(selected.fecha_termino).toLocaleDateString('es-PE') : '—' },
                            { label: 'Cantidad de Prendas', value: selected.cantidad_prendas.toString() },
                            { label: 'Precio por Prenda', value: `S/. ${selected.precio_costura.toFixed(2)}` },
                            { label: 'Entregadas', value: selected.cantidad_entregada?.toString() ?? '—' },
                            { label: 'Falladas', value: selected.cantidad_falladas?.toString() ?? '—' },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                <span className="text-gray-400">{label}</span>
                                <span className="font-medium text-slate-brand">{value}</span>
                            </div>
                        ))}
                        {selected.observacion && (
                            <div className="bg-cream rounded-lg p-3 text-sm text-gray-600">{selected.observacion}</div>
                        )}
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">Cambiar Estado</label>
                            <select value={selected.estado} onChange={(e) => handleChangeEstado(selected, e.target.value as EstadoProduccion)} className="input-field">
                                {ESTADOS.map((s) => <option key={s} value={s}>{estadoConfig[s].label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Financial card */}
                    <div className="card p-6">
                        <h2 className="font-display font-semibold text-slate-brand mb-4">Resumen Financiero</h2>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm"><span className="text-gray-400">Total producción</span><span className="font-bold">S/. {selected.total_produccion.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-400">Total pagado</span><span className="font-bold text-green-600">S/. {selected.total_pagado.toFixed(2)}</span></div>
                            <div className="h-px bg-gray-100 my-2" />
                            <div className="flex justify-between text-base font-bold">
                                <span>Deuda pendiente</span>
                                <span className={selected.deuda > 0 ? 'text-red-500' : 'text-green-500'}>S/. {selected.deuda.toFixed(2)}</span>
                            </div>
                        </div>
                        {selected.deuda > 0 && (
                            <button onClick={() => setShowPagoModal(true)} className="btn-primary w-full text-sm">
                                <FiDollarSign className="w-4 h-4" /> Registrar Pago
                            </button>
                        )}
                    </div>
                </div>

                {/* Payment history */}
                <div className="card overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-display font-semibold text-slate-brand">Historial de Pagos</h2>
                        {selected.deuda > 0 && (
                            <button onClick={() => setShowPagoModal(true)} className="text-accent text-sm font-medium hover:underline">+ Nuevo Pago</button>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="px-6 py-3 text-left">Fecha</th>
                                    <th className="px-6 py-3 text-left">Tipo</th>
                                    <th className="px-6 py-3 text-right">Monto</th>
                                    <th className="px-6 py-3 text-left">Detalle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {(selected.pagos as PagoProduccion[] | undefined)?.length === 0 || !selected.pagos ? (
                                    <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-400">No hay pagos registrados</td></tr>
                                ) : (selected.pagos as PagoProduccion[]).map((pago) => (
                                    <tr key={pago.id_pago} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-gray-600">{new Date(pago.fecha_pago).toLocaleDateString('es-PE')}</td>
                                        <td className="px-6 py-3"><span className={`badge ${tipoBadge[pago.tipo_pago]}`}>{pago.tipo_pago}</span></td>
                                        <td className="px-6 py-3 text-right font-bold text-green-600">S/. {pago.monto.toFixed(2)}</td>
                                        <td className="px-6 py-3 text-gray-500 text-xs">{pago.detalle ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment modal */}
                {showPagoModal && (
                    <>
                        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setShowPagoModal(false)} />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn">
                                <div className="flex items-center justify-between px-6 py-4 border-b">
                                    <h3 className="font-display font-semibold text-slate-brand">Registrar Pago</h3>
                                    <button onClick={() => setShowPagoModal(false)}><FiX className="w-5 h-5 text-gray-400" /></button>
                                </div>
                                <div className="px-6 py-4 space-y-4">
                                    <div className="bg-cream rounded-xl p-3 text-sm">
                                        <span className="text-gray-400">Deuda actual: </span>
                                        <span className="font-bold text-red-500">S/. {selected.deuda.toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tipo de Pago</label>
                                        <select value={pagoForm.tipo_pago} onChange={(e) => setPagoForm((f) => ({ ...f, tipo_pago: e.target.value as TipoPago }))} className="input-field">
                                            {TIPOS_PAGO.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Monto (S/.) *</label>
                                        <input type="number" min="0.01" step="0.01" value={pagoForm.monto} onChange={(e) => setPagoForm((f) => ({ ...f, monto: e.target.value }))} className="input-field" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fecha Pago</label>
                                        <input type="date" value={pagoForm.fecha_pago} onChange={(e) => setPagoForm((f) => ({ ...f, fecha_pago: e.target.value }))} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Detalle (opcional)</label>
                                        <input type="text" value={pagoForm.detalle} onChange={(e) => setPagoForm((f) => ({ ...f, detalle: e.target.value }))} className="input-field" placeholder="Transferencia BCP..." />
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t flex justify-end gap-3">
                                    <button onClick={() => setShowPagoModal(false)} className="btn-secondary text-sm py-2">Cancelar</button>
                                    <button onClick={handleRegisterPago} disabled={savingPago || !pagoForm.monto} className="btn-primary text-sm py-2">
                                        {savingPago ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : 'Registrar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )
    }

    return null
}
