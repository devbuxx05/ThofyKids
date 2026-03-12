import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type {
    Categoria,
    Costurero,
    Modelo,
    PagoProduccion,
    Produccion,
    ProduccionConDeuda,
    Talla,
    Color,
} from '../types'

// ── Categorias ──────────────────────────────────────────────
export function useCategorias() {
    const [data, setData] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        supabase
            .from('categoria')
            .select('*')
            .order('nombre')
            .then(({ data, error }) => {
                if (error) setError(error.message)
                else setData(data ?? [])
                setLoading(false)
            })
    }, [])

    return { data, loading, error }
}

// ── Tallas ───────────────────────────────────────────────────
export function useTallas() {
    const [data, setData] = useState<Talla[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase
            .from('talla')
            .select('*')
            .order('nombre')
            .then(({ data }) => {
                setData(data ?? [])
                setLoading(false)
            })
    }, [])

    return { data, loading }
}

// ── Colors ───────────────────────────────────────────────────
export function useColores() {
    const [data, setData] = useState<Color[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase
            .from('color')
            .select('*')
            .order('nombre')
            .then(({ data }) => {
                setData(data ?? [])
                setLoading(false)
            })
    }, [])

    return { data, loading }
}

// ── Modelos públicos (catálogo) ──────────────────────────────
export function useModelosPublicos(categoriaId?: number) {
    const [data, setData] = useState<Modelo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let query = supabase
            .from('modelo')
            .select(`
        *,
        categoria:id_categoria(*),
        colores:modelo_color(*, color:id_color(*)),
        tallas:modelo_talla(*, talla:id_talla(*))
      `)
            .eq('activo', true)
            .order('nombre_modelo')

        if (categoriaId) {
            query = query.eq('id_categoria', categoriaId)
        }

        setLoading(true)
        query.then(({ data, error }) => {
            if (error) setError(error.message)
            else setData((data as Modelo[]) ?? [])
            setLoading(false)
        })
    }, [categoriaId])

    return { data, loading, error }
}

// ── Modelos destacados ───────────────────────────────────────
export function useModelosDestacados() {
    const [data, setData] = useState<Modelo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase
            .from('modelo')
            .select(`
        *,
        categoria:id_categoria(*),
        colores:modelo_color(*, color:id_color(*)),
        tallas:modelo_talla(*, talla:id_talla(*))
      `)
            .eq('activo', true)
            .eq('destacado', true)
            .limit(8)
            .then(({ data }) => {
                setData((data as Modelo[]) ?? [])
                setLoading(false)
            })
    }, [])

    return { data, loading }
}

// ── Modelos admin ────────────────────────────────────────────
export function useModelosAdmin() {
    const [data, setData] = useState<Modelo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAll = useCallback(() => {
        setLoading(true)
        supabase
            .from('modelo')
            .select(`
        *,
        categoria:id_categoria(*),
        colores:modelo_color(*, color:id_color(*)),
        tallas:modelo_talla(*, talla:id_talla(*))
      `)
            .order('nombre_modelo')
            .then(({ data, error }) => {
                if (error) setError(error.message)
                else setData((data as Modelo[]) ?? [])
                setLoading(false)
            })
    }, [])

    useEffect(() => { fetchAll() }, [fetchAll])
    return { data, loading, error, refetch: fetchAll }
}

// ── Costureros ───────────────────────────────────────────────
export function useCostureros(soloActivos = false) {
    const [data, setData] = useState<Costurero[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAll = useCallback(() => {
        setLoading(true)
        let q = supabase.from('costurero').select('*').order('nombre')
        if (soloActivos) q = q.eq('activo', true)
        q.then(({ data, error }) => {
            if (error) setError(error.message)
            else setData(data ?? [])
            setLoading(false)
        })
    }, [soloActivos])

    useEffect(() => { fetchAll() }, [fetchAll])
    return { data, loading, error, refetch: fetchAll }
}

// ── Producciones ─────────────────────────────────────────────
export function useProducciones(filtros?: { estado?: string; id_costurero?: number }) {
    const [data, setData] = useState<ProduccionConDeuda[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAll = useCallback(() => {
        setLoading(true)
        let q = supabase
            .from('produccion')
            .select(`
        *,
        modelo:id_modelo(id_modelo, nombre_modelo),
        costurero:id_costurero(id_costurero, nombre),
        pagos:pago_produccion(*)
      `)
            .order('created_at', { ascending: false })

        if (filtros?.estado) q = q.eq('estado', filtros.estado)
        if (filtros?.id_costurero) q = q.eq('id_costurero', filtros.id_costurero)

        q.then(({ data, error }) => {
            if (error) { setError(error.message); setLoading(false); return }
            const enriched = ((data as Produccion[]) ?? []).map((p) => {
                const total = p.cantidad_prendas * p.precio_costura
                const pagado = (p.pagos ?? []).reduce((a, x) => a + x.monto, 0)
                return { ...p, total_produccion: total, total_pagado: pagado, deuda: total - pagado }
            })
            setData(enriched)
            setLoading(false)
        })
    }, [filtros?.estado, filtros?.id_costurero])

    useEffect(() => { fetchAll() }, [fetchAll])
    return { data, loading, error, refetch: fetchAll }
}

// ── Pagos ────────────────────────────────────────────────────
export function usePagos(filtros?: {
    id_produccion?: number
    id_costurero?: number
    tipo_pago?: string
    desde?: string
    hasta?: string
}) {
    const [data, setData] = useState<(PagoProduccion & { produccion?: Partial<Produccion & { costurero?: Pick<Costurero, 'nombre'> }> })[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAll = useCallback(() => {
        setLoading(true)
        let q = supabase
            .from('pago_produccion')
            .select(`
        *,
        produccion:id_produccion(
          id_produccion,
          id_modelo,
          estado,
          costurero:id_costurero(nombre)
        )
      `)
            .order('fecha_pago', { ascending: false })

        if (filtros?.id_produccion) q = q.eq('id_produccion', filtros.id_produccion)
        if (filtros?.tipo_pago) q = q.eq('tipo_pago', filtros.tipo_pago)
        if (filtros?.desde) q = q.gte('fecha_pago', filtros.desde)
        if (filtros?.hasta) q = q.lte('fecha_pago', filtros.hasta)

        q.then(({ data, error }) => {
            if (error) setError(error.message)
            else setData((data as typeof data) ?? [])
            setLoading(false)
        })
    }, [filtros?.id_produccion, filtros?.tipo_pago, filtros?.desde, filtros?.hasta])

    useEffect(() => { fetchAll() }, [fetchAll])
    return { data, loading, error, refetch: fetchAll }
}

// ── Dashboard stats ──────────────────────────────────────────
export function useDashboardStats() {
    const [stats, setStats] = useState({ produccionesActivas: 0, pagadoEsteMes: 0, deudaTotal: 0, costureroActivos: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.rpc('obtener_estadisticas_dashboard').then(({ data }) => {
            if (data) setStats(data);
            setLoading(false);
        });
    }, [])

    return { stats, loading }
}
