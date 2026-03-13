import { useState } from 'react'
import { FiPlus, FiEdit2, FiToggleLeft, FiToggleRight, FiX } from 'react-icons/fi'
import { AdminModal } from '../../components/admin/AdminModal'
import { useCostureros } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'
import type { Costurero } from '../../types'

const emptyForm: Omit<Costurero, 'id_costurero' | 'created_at'> = {
    nombre: '',
    dni: '',
    direccion: '',
    telefono: '',
    numero_cuenta: '',
    activo: true,
}

export default function Costureros() {
    const { data, loading, error, refetch } = useCostureros()
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

    const openEdit = (c: Costurero) => {
        setForm({
            nombre: c.nombre,
            dni: c.dni,
            direccion: c.direccion ?? '',
            telefono: c.telefono,
            numero_cuenta: c.numero_cuenta,
            activo: c.activo,
        })
        setEditId(c.id_costurero)
        setFormError('')
        setShowModal(true)
    }

    const handleToggle = async (c: Costurero) => {
        await supabase
            .from('costurero')
            .update({ activo: !c.activo })
            .eq('id_costurero', c.id_costurero)
        refetch()
    }

    const handleSave = async () => {
        if (!form.nombre || !form.dni || !form.numero_cuenta) {
            setFormError('Nombre, DNI y número de cuenta son obligatorios.')
            return
        }
        if (form.telefono.length !== 9) {
            setFormError('El teléfono debe tener exactamente 9 dígitos.')
            return
        }
        setSaving(true)
        setFormError('')

        try {
            if (editId) {
                const { error } = await supabase
                    .from('costurero')
                    .update(form)
                    .eq('id_costurero', editId)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('costurero')
                    .insert(form)
                if (error) throw error
            }
            setShowModal(false)
            refetch()
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Error al guardar el costurero')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">Costureros</h1>
                    <p className="text-text-muted text-sm mt-1">Gestión del equipo de producción</p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <FiPlus className="w-4 h-4" /> Nuevo Costurero
                </button>
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            {/* Tabla */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-bg text-xs text-text-muted uppercase tracking-wider">
                                <th className="px-6 py-3 text-left">Nombre</th>
                                <th className="px-6 py-3 text-left">DNI</th>
                                <th className="px-6 py-3 text-left">Teléfono</th>
                                <th className="px-6 py-3 text-left">Cuenta Bancaria</th>
                                <th className="px-6 py-3 text-center">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="skeleton h-4 w-20 rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                                        No hay costureros registrados
                                    </td>
                                </tr>
                            ) : data.map((c) => (
                                <tr key={c.id_costurero} className="hover:bg-bg-elevated transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium text-text-primary">{c.nombre}</td>
                                    <td className="px-6 py-4 text-text-muted">{c.dni}</td>
                                    <td className="px-6 py-4 text-text-muted">{c.telefono}</td>
                                    <td className="px-6 py-4 text-text-muted font-mono text-xs">{c.numero_cuenta}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`badge ${c.activo ? 'bg-green-500/20 text-green-400' : 'bg-border text-text-muted'}`}>
                                            {c.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(c)}
                                                className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-[6px] transition-colors duration-200"
                                                title="Editar"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggle(c)}
                                                className={`p-1.5 rounded-[6px] transition-colors duration-200 ${
                                                    c.activo
                                                        ? 'text-green-400 hover:text-danger hover:bg-danger/10'
                                                        : 'text-text-muted hover:text-success hover:bg-success/10'
                                                }`}
                                                title={c.activo ? 'Desactivar' : 'Activar'}
                                            >
                                                {c.activo
                                                    ? <FiToggleRight className="w-4 h-4" />
                                                    : <FiToggleLeft className="w-4 h-4" />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AdminModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editId ? 'Editar Costurero' : 'Nuevo Costurero'}
                maxWidth="sm"
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
                                : editId ? 'Guardar Cambios' : 'Crear Costurero'
                            }
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    {formError && (
                        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-[6px] px-4 py-3 flex items-start gap-2">
                            <FiX className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>{formError}</p>
                        </div>
                    )}

                    {/* Nombre */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            placeholder="María García"
                            value={form.nombre}
                            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                            className="input-field"
                        />
                    </div>

                    {/* DNI */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            DNI / RUC *
                        </label>
                        <input
                            type="text"
                            placeholder="12345678"
                            value={form.dni}
                            onChange={(e) => setForm((f) => ({ ...f, dni: e.target.value }))}
                            className="input-field"
                        />
                    </div>

                    {/* Teléfono con validación */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            placeholder="999888777"
                            value={form.telefono}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 9)
                                setForm((f) => ({ ...f, telefono: val }))
                            }}
                            className={`input-field ${
                                form.telefono.length > 0 && form.telefono.length < 9
                                    ? 'border-danger focus:ring-danger focus:border-danger'
                                    : ''
                            }`}
                        />
                        {form.telefono.length > 0 && form.telefono.length < 9 && (
                            <p className="text-[11px] text-danger mt-1 px-1">
                                El número debe tener 9 dígitos
                            </p>
                        )}
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Dirección (opcional)
                        </label>
                        <input
                            type="text"
                            placeholder="Av. Ejemplo 123"
                            value={form.direccion}
                            onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                            className="input-field"
                        />
                    </div>

                    {/* Número de cuenta */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Número de cuenta *
                        </label>
                        <input
                            type="text"
                            placeholder="BCP: 0011-0000-00-00000000 / Yape: 999888777"
                            value={form.numero_cuenta}
                            onChange={(e) => setForm((f) => ({ ...f, numero_cuenta: e.target.value }))}
                            className="input-field"
                        />
                    </div>
                </div>
            </AdminModal>
        </div>
    )
}