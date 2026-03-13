import { useState } from 'react'
import { FiPlus, FiEdit2, FiToggleLeft, FiToggleRight, FiX, FiStar, FiUpload, FiTrash2 } from 'react-icons/fi'
import { AdminModal } from '../../components/admin/AdminModal'
import { useModelosAdmin, useCategorias, useTallas, useColores } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'
import type { Modelo } from '../../types'

interface FormFoto {
    foto_url: string
    orden: number
}

const emptyForm = {
    nombre_modelo: '',
    id_categoria: '',
    precio_referencia: '',
    destacado: false,
    activo: true,
    tallas: [] as number[],
    colores: [] as number[],
    fotos: [] as FormFoto[],
}

export default function Modelos() {
    const { data, loading, error, refetch } = useModelosAdmin()
    const { data: categorias } = useCategorias()
    const { data: tallas } = useTallas()
    const { data: dbColores } = useColores()

    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

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
            precio_referencia: String(m.precio_referencia),
            destacado: m.destacado,
            activo: m.activo,
            tallas: (m.tallas ?? []).map((t) => t.id_talla),
            colores: (m.colores ?? []).map((c) => c.id_color),
            fotos: (m.fotos ?? [])
                .sort((a, b) => a.orden - b.orden)
                .map((f) => ({ foto_url: f.foto_url, orden: f.orden })),
        })
        setEditId(m.id_modelo)
        setFormError('')
        setShowModal(true)
    }

    const toggleTalla = (id: number) => {
        setForm((f) => ({
            ...f,
            tallas: f.tallas.includes(id)
                ? f.tallas.filter((t) => t !== id)
                : [...f.tallas, id],
        }))
    }

    const toggleColor = (id: number) => {
        setForm((f) => ({
            ...f,
            colores: f.colores.includes(id)
                ? f.colores.filter((c) => c !== id)
                : [...f.colores, id],
        }))
    }

    const handleUploadFoto = async (file: File, index: number) => {
        setUploadingIndex(index)
        const ext = file.name.split('.').pop()
        const path = `modelos/${Date.now()}_${index}.${ext}`

        const { error: upErr } = await supabase.storage
            .from('fotos')
            .upload(path, file, { upsert: true })

        if (upErr) {
            setFormError(`Error subiendo foto: ${upErr.message}`)
            setUploadingIndex(null)
            return
        }

        const { data } = supabase.storage.from('fotos').getPublicUrl(path)

        setForm((f) => {
            const fotos = [...f.fotos]
            fotos[index] = { foto_url: data.publicUrl, orden: index }
            return { ...f, fotos }
        })
        setUploadingIndex(null)
    }

    const handleAddFoto = () => {
        setForm((f) => ({
            ...f,
            fotos: [...f.fotos, { foto_url: '', orden: f.fotos.length }],
        }))
    }

    const handleRemoveFoto = (index: number) => {
        setForm((f) => ({
            ...f,
            fotos: f.fotos
                .filter((_, i) => i !== index)
                .map((foto, i) => ({ ...foto, orden: i })),
        }))
    }

    const handleSave = async () => {
        if (!form.nombre_modelo || !form.id_categoria || !form.precio_referencia) {
            setFormError('Nombre, categoría y precio son obligatorios.')
            return
        }
        if (form.tallas.length === 0) {
            setFormError('Debes seleccionar al menos una talla.')
            return
        }
        if (form.colores.length === 0) {
            setFormError('Debes seleccionar al menos un color.')
            return
        }

        setSaving(true)
        setFormError('')

        try {
            const payload = {
                nombre_modelo: form.nombre_modelo,
                id_categoria: Number(form.id_categoria),
                precio_referencia: Number(form.precio_referencia),
                destacado: form.destacado,
                activo: form.activo,
            }

            let modeloId = editId

            if (editId) {
                const { error } = await supabase
                    .from('modelo')
                    .update(payload)
                    .eq('id_modelo', editId)
                if (error) throw error

                await supabase.from('modelo_talla').delete().eq('id_modelo', editId)
                await supabase.from('modelo_color').delete().eq('id_modelo', editId)
                await supabase.from('modelo_foto').delete().eq('id_modelo', editId)
            } else {
                const { data: ins, error } = await supabase
                    .from('modelo')
                    .insert(payload)
                    .select('id_modelo')
                    .single()
                if (error || !ins) throw error
                modeloId = ins.id_modelo
            }

            // Insertar tallas
            if (form.tallas.length > 0) {
                await supabase.from('modelo_talla').insert(
                    form.tallas.map((id_talla) => ({ id_modelo: modeloId, id_talla }))
                )
            }

            // Insertar colores
            if (form.colores.length > 0) {
                await supabase.from('modelo_color').insert(
                    form.colores.map((id_color) => ({ id_modelo: modeloId, id_color }))
                )
            }

            // Insertar fotos
            const fotosValidas = form.fotos.filter((f) => f.foto_url.trim() !== '')
            if (fotosValidas.length > 0) {
                await supabase.from('modelo_foto').insert(
                    fotosValidas.map((f, i) => ({
                        id_modelo: modeloId,
                        foto_url: f.foto_url,
                        orden: i,
                    }))
                )
            }

            setSaving(false)
            setShowModal(false)
            refetch()
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error guardando el modelo'
            setFormError(msg)
            setSaving(false)
        }
    }

    const handleToggle = async (m: Modelo) => {
        await supabase
            .from('modelo')
            .update({ activo: !m.activo })
            .eq('id_modelo', m.id_modelo)
        refetch()
    }

    const handleDelete = async (m: Modelo) => {
        if (!window.confirm(`¿Eliminar "${m.nombre_modelo}"? Esta acción no se puede deshacer.`)) return

        const { error: errDelete } = await supabase
            .from('modelo')
            .delete()
            .eq('id_modelo', m.id_modelo)

        if (errDelete) {
            if (errDelete.code === '23503') {
                alert('No puedes eliminar este corte porque tiene producciones asociadas. Desactívalo en su lugar.')
            } else {
                alert('Error al eliminar: ' + errDelete.message)
            }
        } else {
            refetch()
        }
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">Cortes (Modelos)</h1>
                    <p className="text-text-muted text-sm mt-1">Gestión del catálogo y lotes</p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <FiPlus className="w-4 h-4" /> Nuevo Corte
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
                                <th className="px-6 py-3 text-left">Tallas</th>
                                <th className="px-6 py-3 text-right">Precio</th>
                                <th className="px-6 py-3 text-center">Destacado</th>
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
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                                        No hay cortes registrados
                                    </td>
                                </tr>
                            ) : data.map((m) => (
                                <tr key={m.id_modelo} className="hover:bg-bg-elevated transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium text-text-primary">
                                        {m.nombre_modelo}
                                    </td>
                                    <td className="px-6 py-4 text-text-muted">
                                        {m.categoria?.nombre ?? '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {m.tallas && m.tallas.length > 0 ? (
                                                m.tallas.map((t) => (
                                                    <span
                                                        key={t.id_talla}
                                                        className="px-2 py-0.5 bg-bg-elevated text-text-muted rounded text-xs border border-border"
                                                    >
                                                        {t.talla?.nombre}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-text-muted italic text-xs">Sin tallas</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-accent">
                                        S/. {m.precio_referencia.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {m.destacado && <FiStar className="w-4 h-4 text-accent inline" />}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`badge ${m.activo ? 'bg-green-500/20 text-green-400' : 'bg-border text-text-muted'}`}>
                                            {m.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(m)}
                                                className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-[6px] transition-colors duration-200"
                                                title="Editar"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggle(m)}
                                                className={`p-1.5 rounded-[6px] transition-colors duration-200 ${
                                                    m.activo
                                                        ? 'text-green-400 hover:text-danger hover:bg-danger/10'
                                                        : 'text-text-muted hover:text-success hover:bg-success/10'
                                                }`}
                                                title={m.activo ? 'Desactivar' : 'Activar'}
                                            >
                                                {m.activo
                                                    ? <FiToggleRight className="w-4 h-4" />
                                                    : <FiToggleLeft className="w-4 h-4" />
                                                }
                                            </button>
                                            <button
                                                onClick={() => handleDelete(m)}
                                                className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-[6px] transition-colors duration-200"
                                                title="Eliminar"
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

            <AdminModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editId ? 'Editar Corte' : 'Nuevo Corte'}
                maxWidth="md"
                footer={
                    <>
                        <button
                            onClick={() => setShowModal(false)}
                            className="btn-secondary text-sm py-2"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary text-sm py-2 flex items-center gap-2"
                        >
                            {saving
                                ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                : editId ? 'Guardar Cambios' : 'Crear Corte'
                            }
                        </button>
                    </>
                }
            >
                {formError && (
                    <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-[6px] px-4 py-3 mb-4 flex items-start gap-2">
                        <FiX className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>{formError}</p>
                    </div>
                )}

                <div className="space-y-5">

                    {/* Nombre */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Nombre del Corte *
                        </label>
                        <input
                            type="text"
                            value={form.nombre_modelo}
                            onChange={(e) => setForm((f) => ({ ...f, nombre_modelo: e.target.value }))}
                            className="input-field"
                            placeholder="Pantalón Cargo Drill"
                        />
                    </div>

                    {/* Categoría + Precio */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                Categoría *
                            </label>
                            <select
                                value={form.id_categoria}
                                onChange={(e) => setForm((f) => ({ ...f, id_categoria: e.target.value }))}
                                className="input-field"
                            >
                                <option value="">Seleccionar...</option>
                                {categorias.map((c) => (
                                    <option key={c.id_categoria} value={c.id_categoria}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                Precio Ref. (S/.) *
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.precio_referencia}
                                onChange={(e) => setForm((f) => ({ ...f, precio_referencia: e.target.value }))}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Destacado + Activo */}
                    <div className="flex items-center gap-6 py-2 border-y border-border">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-text-muted">
                            <input
                                type="checkbox"
                                checked={form.destacado}
                                onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))}
                                className="w-4 h-4 rounded accent-accent"
                            />
                            Destacado en catálogo
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-text-muted">
                            <input
                                type="checkbox"
                                checked={form.activo}
                                onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
                                className="w-4 h-4 rounded accent-accent"
                            />
                            Activo
                        </label>
                    </div>

                    {/* Tallas */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Tallas *
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {tallas.map((t) => (
                                <button
                                    key={t.id_talla}
                                    type="button"
                                    onClick={() => toggleTalla(t.id_talla)}
                                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold border transition-all duration-200 ${
                                        form.tallas.includes(t.id_talla)
                                            ? 'bg-accent border-accent text-black'
                                            : 'border-border text-text-muted hover:border-accent hover:text-accent'
                                    }`}
                                >
                                    {t.nombre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colores */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Colores *
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {dbColores.map((c) => (
                                <button
                                    key={c.id_color}
                                    type="button"
                                    onClick={() => toggleColor(c.id_color)}
                                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold border transition-all duration-200 ${
                                        form.colores.includes(c.id_color)
                                            ? 'bg-accent border-accent text-black'
                                            : 'border-border text-text-muted hover:border-accent hover:text-accent'
                                    }`}
                                >
                                    {c.nombre}
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] text-text-muted mt-2">
                            ¿No encuentras un color?{' '}
                            <span className="text-accent cursor-pointer hover:underline" onClick={() => alert('Agrega el color desde Supabase → tabla color')}>
                                Agrégalo desde la BD
                            </span>
                        </p>
                    </div>

                    {/* Fotos del carrusel */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Fotos del carrusel
                            </label>
                            <button
                                type="button"
                                onClick={handleAddFoto}
                                className="text-xs text-accent hover:underline flex items-center gap-1"
                            >
                                <FiPlus className="w-3 h-3" /> Agregar foto
                            </button>
                        </div>

                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                            {form.fotos.length === 0 && (
                                <p className="text-xs text-text-muted italic">
                                    Sin fotos. Agrega al menos una para mostrar en el catálogo.
                                </p>
                            )}
                            {form.fotos.map((foto, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 border border-border rounded-[6px] bg-bg"
                                >
                                    <span className="text-xs text-text-muted w-5 shrink-0 text-center">
                                        {index + 1}
                                    </span>

                                    {foto.foto_url ? (
                                        <img
                                            src={foto.foto_url}
                                            alt={`Foto ${index + 1}`}
                                            className="w-10 h-10 rounded object-cover border border-border shrink-0"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded border border-dashed border-border flex items-center justify-center shrink-0">
                                            <FiUpload className="w-4 h-4 text-text-muted" />
                                        </div>
                                    )}

                                    <label className="flex-1 cursor-pointer">
                                        <div className={`input-field py-1.5 text-xs text-center cursor-pointer ${
                                            uploadingIndex === index ? 'opacity-50' : ''
                                        }`}>
                                            {uploadingIndex === index
                                                ? 'Subiendo...'
                                                : foto.foto_url ? 'Cambiar foto' : 'Subir foto'
                                            }
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingIndex !== null}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) handleUploadFoto(file, index)
                                            }}
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFoto(index)}
                                        className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-[6px] transition-colors shrink-0"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AdminModal>
        </div>
    )
}