import { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

interface AdminModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    footer?: ReactNode
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
}

export function AdminModal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = 'lg',
}: AdminModalProps) {
    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className={`bg-bg-surface border border-border rounded-card shadow-2xl w-full ${maxWidthClass[maxWidth]} max-h-[90vh] flex flex-col overflow-hidden`}>

                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                    <h3 className="font-display text-base font-bold text-text-primary">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-[6px] transition-colors duration-200"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>

                {/* Footer opcional */}
                {footer && (
                    <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}