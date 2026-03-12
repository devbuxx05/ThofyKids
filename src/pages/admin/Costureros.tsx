import { useState } from 'react'
import { FiPlus, FiEdit2, FiToggleLeft, FiToggleRight, FiX } from 'react-icons/fi'
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
                    <h1 className="font-display text-2xl font-bold text-slate-brand">Costureros</h1>
                    <p className="text-gray-400 text-sm mt-1">Gestión del equipo de producción</p>
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
                            <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-3 text-left">Nombre</th>
                                <th className="px-6 py-3 text-left">DNI</th>
                                <th className="px-6 py-3 text-left">Teléfono</th>
                                <th className="px-6 py-3 text-left">Cuenta Bancaria</th>
                                <th className="px-6 py-3 text-center">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j} className="px-6 py-4"><div className="skeleton h-4 w-20 rounded" /></td>)}</tr>
                                ))
                            ) : data.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No hay costureros registrados</td></tr>
                            ) : data.map((c) => (
                                <tr key={c.id_costurero} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-brand">{c.nombre}</td>
                                    <td className="px-6 py-4 text-gray-600">{c.dni}</td>
                                    <td className="px-6 py-4 text-gray-600">{c.telefono}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{c.numero_cuenta}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`badge ${c.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {c.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors" title="Editar">
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleToggle(c)} className={`p-1.5 rounded-lg transition-colors ${c.activo ? 'text-green-400 hover:text-red-400 hover:bg-red-50' : 'text-gray-300 hover:text-green-500 hover:bg-green-50'}`} title={c.activo ? 'Desactivar' : 'Activar'}>
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

            {/* Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[calc(100vh-2rem)] flex flex-col animate-fadeIn">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                                <h2 className="font-display font-semibold text-slate-brand">
                                    {editId ? 'Editar Costurero' : 'Nuevo Costurero'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content with scroll */}
                            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
                                {formError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 flex items-start gap-3">
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
                                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">{label}</label>
                                        <input
                                            type={type}
                                            placeholder={placeholder}
                                            value={(form as Record<string, unknown>)[field] as string}
                                            onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2">
                                    {saving ? <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : (editId ? 'Guardar Cambios' : 'Crear Costurero')}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
