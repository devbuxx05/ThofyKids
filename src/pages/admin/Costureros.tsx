import { useState } from 'react'
import { FiPlus, FiEdit2, FiToggleLeft, FiToggleRight, FiX } from 'react-icons/fi'
import AdminModal from '../../components/admin/AdminModal'
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
        setForm({ nombre: c.nombre, dni: c.dni, direccion: c.direccion ?? '', telefono: c.telefono, numero_cuenta: c.numero_cuenta, activo: c.activo })
        setEditId(c.id_costurero)
        setFormError('')
        setShowModal(true)
    }

    const handleToggle = async (c: Costurero) => {
        await supabase.from('costurero').update({ activo: !c.activo }).eq('id_costurero', c.id_costurero)
        refetch()
    }

    const handleSave = async () => {
        if (!form.nombre || !form.dni || !form.telefono || !form.numero_cuenta) {
            setFormError('Nombre, DNI, teléfono y número de cuenta son obligatorios.')
            return
        }
        setSaving(true)
        setFormError('')
        if (editId) {
            const { error } = await supabase.from('costurero').update(form).eq('id_costurero', editId)
            if (error) { setFormError(error.message); setSaving(false); return }
        } else {
            const { error } = await supabase.from('costurero').insert(form)
            if (error) { setFormError(error.message); setSaving(false); return }
        }
        setSaving(false)
        setShowModal(false)
        refetch()
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary">Costureros</h1>
                    <p className="text-text-muted text-sm mt-1">Gestión del equipo de producción</p>
                </div>
                <button id="create-costurero-btn" onClick={openCreate} className="btn-primary">
                    <FiPlus className="w-4 h-4" /> Nuevo Costurero
                </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-text-muted uppercase tracking-wider">
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
                                    <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="skeleton h-4 w-20 rounded" /></td>)}</tr>
                                ))
                            ) : data.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-text-muted">No hay costureros registrados</td></tr>
                            ) : data.map((c) => (
                                <tr key={c.id_costurero} className="hover:bg-[#1F1F1F] transition-colors">
                                    <td className="px-6 py-4 font-medium text-text-primary">{c.nombre}</td>
                                    <td className="px-6 py-4 text-text-muted">{c.dni}</td>
                                    <td className="px-6 py-4 text-text-muted">{c.telefono}</td>
                                    <td className="px-6 py-4 text-text-muted font-mono text-xs">{c.numero_cuenta}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`badge ${c.activo ? 'bg-green-500/20 text-green-400' : 'bg-text-muted/20 text-text-muted'}`}>
                                            {c.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(c)} className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors" title="Editar">
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleToggle(c)} className={`p-1.5 rounded-lg transition-colors ${c.activo ? 'text-green-400 hover:text-danger hover:bg-danger/10' : 'text-text-muted hover:text-success hover:bg-success/10'}`} title={c.activo ? 'Desactivar' : 'Activar'}>
                                                {c.activo ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
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
                title={editId ? 'Editar Costurero' : 'Nuevo Costurero'}
                footer={
                    <>
                        <button onClick={() => setShowModal(false)} className="btn-secondary text-sm py-2">
                            Cancelar
                        </button>
                        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 flex items-center gap-2">
                            {saving ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : (editId ? 'Guardar Cambios' : 'Crear Costurero')}
                        </button>
                    </>
                }
            >
                                {formError && (
                                    <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-lg px-4 py-3 flex items-start gap-3">
                                        <FiX className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>{formError}</p>
                                    </div>
                                )}
                                {[
                                    { field: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'María García' },
                                    { field: 'dni', label: 'DNI/RUC', type: 'text', placeholder: '12345678' },
                                    { field: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '999 888 777' },
                                    { field: 'direccion', label: 'Dirección (opcional)', type: 'text', placeholder: 'Av. Ejemplo 123' },
                                    { field: 'numero_cuenta', label: 'Número de cuenta', type: 'text', placeholder: '0011-0000-00-00000000' },
                                ].map(({ field, label, type, placeholder }) => (
                                    <div key={field}>
                                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{label}</label>
                                        <input
                                            type={type}
                                            placeholder={placeholder}
                                            value={(form as Record<string, unknown>)[field] as string}
                                            onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                            className="input-field"
                                        />
                                    </div>
                                ))}
            </AdminModal>
        </div>
    )
}
