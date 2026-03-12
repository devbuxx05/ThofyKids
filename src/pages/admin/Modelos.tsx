import { useState } from 'react'
import { FiPlus, FiEdit2, FiToggleLeft, FiToggleRight, FiX, FiStar, FiUpload } from 'react-icons/fi'
import AdminModal from '../../components/admin/AdminModal'
import { useModelosAdmin, useCategorias, useTallas, useColores } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'
import type { Modelo } from '../../types'

const emptyForm = {
    nombre_modelo: '',
    id_categoria: '',
    descripcion: '',
    precio_referencia: '',
    destacado: false,
    activo: true,
    tallas: [] as number[],
    colores: [] as { id_color: number; nombre: string; foto_url: string }[],
}

export default function Modelos() {
    const { data, loading, error, refetch } = useModelosAdmin()
    const { data: categorias } = useCategorias()
    const { data: tallas } = useTallas()
    const { data: colores } = useColores()

    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')

    const openCreate = () => {
        setForm(emptyForm)
        setEditId(null)
        setFormError('')
        setShowModal(true)
    }

    const openEdit = (m: Modelo) => {
        setForm({
            nombre_modelo: m.nombre_modelo,
            id_categoria: String(m.id_categoria),
            descripcion: m.descripcion,
            precio_referencia: String(m.precio_referencia),
            destacado: m.destacado,
            activo: m.activo,
            tallas: (m.tallas ?? []).map((t) => t.id_talla),
            colores: (m.colores ?? []).map((c) => ({ id_color: c.id_color, nombre: c.color?.nombre ?? '', foto_url: c.foto_url })),
        })
        setEditId(m.id_modelo)
        setFormError('')
        setShowModal(true)
    }

    const toggleTalla = (id: number) => {
        setForm((f) => ({
            ...f,
            tallas: f.tallas.includes(id) ? f.tallas.filter((t) => t !== id) : [...f.tallas, id],
        }))
    }

    const handleColorPhotoUrl = (id_color: number, nombre: string, foto_url: string) => {
        setForm((f) => {
            const exists = f.colores.find((c) => c.id_color === id_color)
            if (exists) return { ...f, colores: f.colores.map((c) => c.id_color === id_color ? { ...c, foto_url } : c) }
            return { ...f, colores: [...f.colores, { id_color, nombre, foto_url }] }
        })
    }

    const handleUploadFoto = async (id_color: number, nombre: string, file: File) => {
        const ext = file.name.split('.').pop()
        const path = `modelos/${Date.now()}_${id_color}.${ext}`
        const { error: upErr } = await supabase.storage.from('fotos').upload(path, file, { upsert: true })
        if (upErr) { setFormError(`Error subiendo foto: ${upErr.message}`); return }
        const { data } = supabase.storage.from('fotos').getPublicUrl(path)
        handleColorPhotoUrl(id_color, nombre, data.publicUrl)
    }

    const handleSave = async () => {
        if (!form.nombre_modelo || !form.id_categoria || !form.precio_referencia) {
            setFormError('Nombre, categoría y precio son obligatorios.')
            return
        }
        setSaving(true)
        setFormError('')

        const payload = {
            nombre_modelo: form.nombre_modelo,
            id_categoria: Number(form.id_categoria),
            descripcion: form.descripcion,
            precio_referencia: Number(form.precio_referencia),
            destacado: form.destacado,
            activo: form.activo,
        }

        let modeloId = editId

        if (editId) {
            const { error } = await supabase.from('modelo').update(payload).eq('id_modelo', editId)
            if (error) { setFormError(error.message); setSaving(false); return }
            // Delete old tallas + colors
            await supabase.from('modelo_talla').delete().eq('id_modelo', editId)
            await supabase.from('modelo_color').delete().eq('id_modelo', editId)
        } else {
            const { data: ins, error } = await supabase.from('modelo').insert(payload).select('id_modelo').single()
            if (error || !ins) { setFormError(error?.message ?? 'Error al crear modelo'); setSaving(false); return }
            modeloId = ins.id_modelo
        }

        // Insert tallas
        if (form.tallas.length > 0) {
            await supabase.from('modelo_talla').insert(form.tallas.map((id_talla) => ({ id_modelo: modeloId, id_talla })))
        }

        // Insert colors
        const coloresConFoto = form.colores.filter((c) => c.foto_url)
        if (coloresConFoto.length > 0) {
            await supabase.from('modelo_color').insert(coloresConFoto.map((c) => ({ id_modelo: modeloId, id_color: c.id_color, foto_url: c.foto_url })))
        }

        setSaving(false)
        setShowModal(false)
        refetch()
    }

    const handleToggle = async (m: Modelo) => {
        await supabase.from('modelo').update({ activo: !m.activo }).eq('id_modelo', m.id_modelo)
        refetch()
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">Modelos</h1>
                    <p className="text-text-muted text-sm mt-1">Gestión del catálogo de productos</p>
                </div>
                <button id="create-modelo-btn" onClick={openCreate} className="btn-primary">
                    <FiPlus className="w-4 h-4" /> Nuevo Modelo
                </button>
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-bg text-xs text-text-muted uppercase tracking-wider">
                                <th className="px-6 py-3 text-left">Nombre</th>
                                <th className="px-6 py-3 text-left">Categoría</th>
                                <th className="px-6 py-3 text-right">Precio</th>
                                <th className="px-6 py-3 text-center">Destacado</th>
                                <th className="px-6 py-3 text-center">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="skeleton h-4 w-20 rounded" /></td>)}</tr>)
                            ) : data.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-text-muted">No hay modelos registrados</td></tr>
                            ) : data.map((m) => (
                                <tr key={m.id_modelo} className="hover:bg-[#1F1F1F] transition-colors">
                                    <td className="px-6 py-4 font-medium text-text-primary">{m.nombre_modelo}</td>
                                    <td className="px-6 py-4 text-text-muted">{m.categoria?.nombre ?? '—'}</td>
                                    <td className="px-6 py-4 text-right font-medium font-mono text-accent">S/. {m.precio_referencia.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        {m.destacado && <FiStar className="w-4 h-4 text-accent inline" />}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`badge ${m.activo ? 'bg-green-500/20 text-green-400' : 'bg-text-muted/20 text-text-muted'}`}>
                                            {m.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(m)} className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleToggle(m)} className={`p-1.5 rounded-lg transition-colors ${m.activo ? 'text-green-400 hover:text-danger hover:bg-danger/10' : 'text-text-muted hover:text-success hover:bg-success/10'}`}>
                                                {m.activo ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editId ? 'Editar Modelo' : 'Nuevo Modelo'}
                maxWidth="sm"
                footer={
                    <>
                        <button onClick={() => setShowModal(false)} className="btn-secondary text-sm py-2">
                            Cancelar
                        </button>
                        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 flex items-center gap-2">
                            {saving ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : (editId ? 'Guardar Cambios' : 'Crear Modelo')}
                        </button>
                    </>
                }
            >
                                {formError && (
                                    <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-[6px] px-4 py-3 flex items-start gap-3">
                                        <FiX className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>{formError}</p>
                                    </div>
                                )}

                                {/* Basic fields */}
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Nombre del Modelo *</label>
                                    <input type="text" value={form.nombre_modelo} onChange={(e) => setForm((f) => ({ ...f, nombre_modelo: e.target.value }))} className="input-field" placeholder="Pantalón Jeans" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Categoría *</label>
                                    <select value={form.id_categoria} onChange={(e) => setForm((f) => ({ ...f, id_categoria: e.target.value }))} className="input-field">
                                        <option value="">Seleccionar categoría</option>
                                        {categorias.map((c) => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Precio Ref. (S/.) *</label>
                                    <input type="number" min="0" step="0.01" value={form.precio_referencia} onChange={(e) => setForm((f) => ({ ...f, precio_referencia: e.target.value }))} className="input-field" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Descripción</label>
                                    <textarea value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} rows={2} className="input-field resize-none" />
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-text-muted">
                                        <input type="checkbox" checked={form.destacado} onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))} className="w-4 h-4 rounded accent-accent" />
                                        Destacado
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-text-muted">
                                        <input type="checkbox" checked={form.activo} onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))} className="w-4 h-4 rounded accent-accent" />
                                        Activo
                                    </label>
                                </div>

                                {/* Tallas */}
                                <div className="pt-2">
                                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Tallas Disponibles</label>
                                    <div className="flex flex-wrap gap-2">
                                        {tallas.map((t) => (
                                            <button
                                                key={t.id_talla}
                                                type="button"
                                                onClick={() => toggleTalla(t.id_talla)}
                                                className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold border transition-all ${form.tallas.includes(t.id_talla)
                                                    ? 'bg-accent border-accent text-black'
                                                    : 'border-border text-text-muted hover:border-accent hover:text-accent'
                                                }`}
                                            >
                                                {t.nombre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors + photos */}
                                <div className="pt-2">
                                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Colores y Fotos</label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {colores.map((c) => {
                                            const existing = form.colores.find((fc) => fc.id_color === c.id_color)
                                            return (
                                                <div key={c.id_color} className="flex items-center gap-2 p-2 border border-border rounded-[6px] hover:border-accent/30 transition-colors">
                                                    <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-xs font-bold text-text-muted shrink-0">
                                                        {c.nombre.slice(0, 1).toUpperCase()}
                                                    </div>
                                                    <span className="text-xs text-text-primary w-16 shrink-0">{c.nombre}</span>
                                                    <div className="flex-1 flex items-center gap-1 min-w-0">
                                                        <input
                                                            type="text"
                                                            placeholder="URL foto"
                                                            value={existing?.foto_url ?? ''}
                                                            onChange={(e) => handleColorPhotoUrl(c.id_color, c.nombre, e.target.value)}
                                                            className="input-field py-1.5 text-xs"
                                                        />
                                                        <label className="cursor-pointer text-accent hover:opacity-90 p-1 rounded hover:bg-accent/10 transition-colors shrink-0" title="Subir foto">
                                                            <FiUpload className="w-3.5 h-3.5" />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (file) handleUploadFoto(c.id_color, c.nombre, file)
                                                                }}
                                                            />
                                                        </label>
                                                        {existing?.foto_url && (
                                                            <img src={existing.foto_url} alt={c.nombre} className="w-6 h-6 rounded object-cover shrink-0" />
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
            </AdminModal>
        </div>
    )
}
