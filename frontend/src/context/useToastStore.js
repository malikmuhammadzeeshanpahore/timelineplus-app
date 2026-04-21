import { create } from 'zustand'

export const useToastStore = create((set) => ({
    toasts: [],
    addToast: (type, message) => {
        const id = Date.now()
        set((state) => ({ toasts: [...state.toasts, { id, type, message }] }))
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
        }, 4000)
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
