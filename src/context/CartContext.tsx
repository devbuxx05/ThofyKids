import React, { createContext, useContext, useEffect, useState } from 'react'
import { CartItem } from '../types'

interface CartContextType {
    cartItems: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id_modelo: number) => void
    updateQuantity: (id_modelo: number, qty: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
    isCartOpen: boolean
    openCart: () => void
    closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = 'thofy_cart'

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
            const existing = prev.find((i) => i.id_modelo === newItem.id_modelo)
            if (existing) {
                return prev.map((i) =>
                    i.id_modelo === newItem.id_modelo
                        ? { ...i, cantidad: i.cantidad + newItem.cantidad }
                        : i
                )
            }
            return [...prev, newItem]
        })
    }

    const removeFromCart = (id_modelo: number) => {
        setCartItems((prev) => prev.filter((i) => i.id_modelo !== id_modelo))
    }

    const updateQuantity = (id_modelo: number, qty: number) => {
        if (qty <= 0) {
            removeFromCart(id_modelo)
            return
        }
        setCartItems((prev) =>
            prev.map((i) =>
                i.id_modelo === id_modelo ? { ...i, cantidad: qty } : i
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