import React, { createContext, useContext, useEffect, useState } from 'react'
import { CartItem } from '../types'

interface CartContextType {
    cartItems: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id_modelo: number, talla: string, color: string) => void
    updateQuantity: (id_modelo: number, talla: string, color: string, qty: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
    isCartOpen: boolean
    openCart: () => void
    closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = 'thofy_cart'

function isSameItem(a: CartItem, b: CartItem): boolean {
    return a.id_modelo === b.id_modelo && a.talla === b.talla && a.color === b.color
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const stored = localStorage.getItem(CART_KEY)
            return stored ? (JSON.parse(stored) as CartItem[]) : []
        } catch {
            return []
        }
    })

    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (newItem: CartItem) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => isSameItem(i, newItem))
            if (existing) {
                return prev.map((i) =>
                    isSameItem(i, newItem) ? { ...i, cantidad: i.cantidad + newItem.cantidad } : i
                )
            }
            return [...prev, newItem]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (id_modelo: number, talla: string, color: string) => {
        setCartItems((prev) =>
            prev.filter((i) => !(i.id_modelo === id_modelo && i.talla === talla && i.color === color))
        )
    }

    const updateQuantity = (id_modelo: number, talla: string, color: string, qty: number) => {
        if (qty <= 0) {
            removeFromCart(id_modelo, talla, color)
            return
        }
        setCartItems((prev) =>
            prev.map((i) =>
                i.id_modelo === id_modelo && i.talla === talla && i.color === color
                    ? { ...i, cantidad: qty }
                    : i
            )
        )
    }

    const clearCart = () => setCartItems([])

    const totalItems = cartItems.reduce((acc, i) => acc + i.cantidad, 0)
    const totalPrice = cartItems.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isCartOpen,
                openCart: () => setIsCartOpen(true),
                closeCart: () => setIsCartOpen(false),
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart(): CartContextType {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used inside <CartProvider />')
    return ctx
}
