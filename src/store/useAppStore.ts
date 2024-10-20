import { create } from "zustand";
import { OrderItem } from "../types";
import { Product } from "@prisma/client";

type Store = {
    order: OrderItem[]
    addToCart: (product: Product) => void,
    increaseQuantity: (id: Product['id']) => void,
    decreaseQuantity: (id: Product['id']) => void,
    removeItem: (id: Product['id']) => void,
    clearOrder: () => void
}

export const useAppStore = create<Store>((set, get) => ({
    order: [],

    addToCart: (product) => {

        const {...data} = product
        let items: OrderItem[] = []

        if(get().order.find(item => item.id === product.id)){
            items = get().order.map(item => item.id === product.id ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: item.price * (item.quantity + 1)
            } : item)
        } else{
            items = [...get().order, {
                ...data,
                quantity: 1,
                subtotal: 1 * product.price
            }]
        }

        set(() => ({
            order: items
        }))
    },

    increaseQuantity: (id) => {
        set((state) => ({
            order: state.order.map(item => item.id === id ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: item.price * (item.quantity + 1)
            } : item)
        }))
    },

    decreaseQuantity: (id) => {
        const order = get().order.map(item => item.id === id ? {
            ...item,
            quantity: item.quantity -1,
            subtotal: item.price * (item.quantity - 1)
        } : item)

        set(() => ({
            order
        }))
    },

    removeItem: (id) => {
        set((state) => ({
            order: state.order.filter(item => item.id !== id)
        }))
    },

    clearOrder: () => {
        set(() => ({
            order: []
        }))
    }
}))