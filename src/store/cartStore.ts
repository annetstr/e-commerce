import { create } from 'zustand'

interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
}

interface CartStore {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    addItem: (newItem) =>
        set((state) => {
            const existingItem = state.items.find(item => item.id === newItem.id)

            if (existingItem) {
                return {
                    items: state.items.map(item =>
                        item.id === newItem.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                }
            }

            return {
                items: [...state.items, { ...newItem, quantity: 1 }]
            }
        }),

    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter(item => item.id !== id)
        })),

    updateQuantity: (id, quantity) =>
        set((state) => ({
            items: state.items.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        })),

    clearCart: () => set({ items: [] }),

    getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
    }
}))