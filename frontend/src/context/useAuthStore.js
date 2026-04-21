import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = 'https://timelineplus.site/api';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            setSocialUser: (user) => set({ isAuthenticated: true, user, isLoading: false }),

            updateUser: (newData) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...newData } });
                }
            },

            login: async (email, password) => {
                set({ isLoading: true })
                try {
                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    })
                    const data = await res.json()
                    if (!res.ok) throw new Error(data.error)

                    set({ isAuthenticated: true, user: data, isLoading: false })
                    return data
                } catch (err) {
                    set({ isLoading: false })
                    throw err
                }
            },

            register: async (userData) => {
                set({ isLoading: true })
                try {
                    const isFormData = userData instanceof FormData;
                    const res = await fetch(`${API_URL}/auth/register`, {
                        method: 'POST',
                        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
                        body: isFormData ? userData : JSON.stringify(userData)
                    })
                    const data = await res.json()
                    if (!res.ok) throw new Error(data.error)

                    set({ isAuthenticated: true, user: data, isLoading: false })
                    return data
                } catch (err) {
                    set({ isLoading: false })
                    throw err
                }
            },

            fetchProfile: async (userId) => {
                try {
                    const res = await fetch(`${API_URL}/users/${userId}?_t=${Date.now()}`)
                    const data = await res.json()
                    if (res.ok) {
                        set({ user: data })
                    }
                } catch (err) {
                    console.error('Failed to fetch profile:', err)
                }
            },

            updateBalance: async (amount, type) => {
                set((state) => {
                    // Optimistic Update
                    const newBalance = type === 'deposit' ? state.user.balance + amount : state.user.balance - amount
                    // API Call in background
                    fetch(`${API_URL}/wallet/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: state.user.id, amount, type })
                    }).then(res => res.json()).then(data => {
                        // Confirm server state
                        set(s => ({
                            user: {
                                ...s.user,
                                balance: data.balance,
                                transactions: [data.transaction, ...(s.user.transactions || [])]
                            }
                        }))
                    }).catch(err => {
                        // Revert on error
                        set(s => ({ user: { ...s.user, balance: state.user.balance } }))
                    })

                    return { user: { ...state.user, balance: newBalance } }
                })
            },

            checkAuth: async () => {
                const currentUser = get().user;
                if (!currentUser || !currentUser.id) return;

                try {
                    const res = await fetch(`https://timelineplus.site/api/auth/me?userId=${currentUser.id}`);
                    const data = await res.json();
                    if (res.ok) {
                        // Merge with existing session to keep token if any (though we stick to localstorage here)
                        set({ user: data, isAuthenticated: true });
                    }
                } catch (err) {
                    console.error("Failed to refresh user", err);
                }
            },

            logout: () => set({ isAuthenticated: false, user: null }),
        }),
        {
            name: 'auth-storage-v2', // localStorage key
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
