import { CartItem } from '../types'

interface CustomerInfo {
    nombre: string
    telefono: string
    distrito: string
}

export function generateWhatsAppMessage(items: CartItem[], customer: CustomerInfo): string {
    const lines = items.map((item) => {
        const subtotal = (item.precio * item.cantidad).toFixed(2)
        return `- ${item.nombre} | Talla: ${item.talla} | Color: ${item.color} | x${item.cantidad} - S/. ${subtotal}`
    })

    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)

    const message = `Hola Thofy Kids! 👋

Quiero hacer el siguiente pedido:

🛒 PRODUCTOS:
${lines.join('\n')}

💰 TOTAL: S/. ${total}

📝 Nombre: ${customer.nombre}
📱 Teléfono: ${customer.telefono}
📍 Distrito: ${customer.distrito}`

    return message
}

export function openWhatsApp(message: string): void {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER ?? '51986170583'
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${number}?text=${encoded}`, '_blank')
}
