import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Auth store — persisted to localStorage.
 * Handles user session for all three roles: admin | employee | candidate
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,       // { id, name, email, role }
      token: null,
      isAuthenticated: false,

      // Called after a successful login API response
      setAuth: (user, token) => {
        localStorage.setItem('hrcrm_token', token)
        set({ user, token, isAuthenticated: true })
      },

      // Logout — clear everything
      logout: () => {
        localStorage.removeItem('hrcrm_token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      // Convenience getters
      getRole: () => get().user?.role ?? null,
      isAdmin: () => get().user?.role === 'admin',
      isEmployee: () => get().user?.role === 'employee',
      isCandidate: () => get().user?.role === 'candidate',
    }),
    {
      name: 'hrcrm_auth',       // localStorage key
      partialize: (state) => ({  // only persist these fields
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
