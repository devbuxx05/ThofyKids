// ============================================================
// THOFY KIDS — TypeScript Interfaces
// ============================================================

export interface Categoria {
    id_categoria: number
    nombre: string
    descripcion?: string
    created_at?: string
}

export interface Modelo {
    id_modelo: number
    nombre_modelo: string
    id_categoria: number
    descripcion: string
    precio_referencia: number
    destacado: boolean
    activo: boolean
    created_at?: string
    updated_at?: string
    // Joined
    categoria?: Categoria
    colores?: ModeloColor[]
    tallas?: ModeloTalla[]
}

export interface Talla {
    id_talla: number
    nombre: string
}

export interface Color {
    id_color: number
    nombre: string
}

export interface ModeloColor {
    id_modelo_color: number
    id_modelo: number
    id_color: number
    foto_url: string
    color?: Color
}

export interface ModeloTalla {
    id_modelo_talla: number
    id_modelo: number
    id_talla: number
    talla?: Talla
}

export interface Costurero {
    id_costurero: number
    nombre: string
    dni: string
    direccion?: string
    telefono: string
    numero_cuenta: string
    activo: boolean
    created_at?: string
}

export interface Produccion {
    id_produccion: number
    id_modelo: number
    id_costurero: number
    fecha_inicio: string
    fecha_termino?: string
    cantidad_prendas: number
    precio_costura: number
    cantidad_entregada?: number
    cantidad_falladas?: number
    foto_referencial?: string
    estado: 'PENDIENTE' | 'EN_PRODUCCION' | 'TERMINADO' | 'PAGADO'
    observacion?: string
    created_at?: string
    // Joined
    modelo?: Modelo
    costurero?: Costurero
    pagos?: PagoProduccion[]
}

export interface PagoProduccion {
    id_pago: number
    id_produccion: number
    tipo_pago: 'EFECTIVO' | 'YAPE' | 'TRANSFERENCIA' | 'DEPOSITO'
    monto: number
    fecha_pago: string
    detalle?: string
    created_at?: string
}

export interface Usuario {
    id_usuario: string
    email: string
    rol: 'admin'
    created_at?: string
}

export interface CartItem {
    id_modelo: number
    nombre: string
    talla: string
    color: string
    foto_url: string
    precio: number
    cantidad: number
}

// Computed
export interface ProduccionConDeuda extends Produccion {
    total_produccion: number
    total_pagado: number
    deuda: number
}

export type EstadoProduccion = 'PENDIENTE' | 'EN_PRODUCCION' | 'TERMINADO' | 'PAGADO'
export type TipoPago = 'EFECTIVO' | 'YAPE' | 'TRANSFERENCIA' | 'DEPOSITO'
