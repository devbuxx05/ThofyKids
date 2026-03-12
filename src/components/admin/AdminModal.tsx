import { ReactNode } from 'react'
import { FiX } from 'react-icons/fi'

interface AdminModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    footer?: ReactNode
    maxWidth?: 'sm' | 'md' | 'lg'
}

const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
}

export default function AdminModal({ isOpen, onClose, title, children, footer, maxWidth = 'sm' }: AdminModalProps) {
    if (!isOpen) return null

    return (
        <>
            {/* Backdrop — z-[100] por encima del navbar (z-30) */}
            <div
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden
            />
            {/* Contenedor — scroll interno, margen para no quedar bajo ningún elemento */}
            <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-6 px-4 sm:py-8 sm:px-6">
                <div
                    className={`bg-surface border border-border rounded-card shadow-2xl w-full ${maxWidthClass[maxWidth]} flex flex-col animate-fadeIn my-auto min-h-0 max-h-[calc(100vh-3rem)]`}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="admin-modal-title"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                        <h2 id="admin-modal-title" className="font-display font-semibold text-text-primary">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-border rounded-[6px] transition-colors"
                            aria-label="Cerrar"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="px-6 py-5 overflow-y-auto flex-1 min-h-0 space-y-4">
                        {children}
                    </div>
                    {footer && (
                        <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-3">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
