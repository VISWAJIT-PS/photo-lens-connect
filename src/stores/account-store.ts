import { create } from 'zustand'
import { supabase } from '@/integrations/supabase/client'

export type Profile = {
  id: string
  full_name?: string | null
  gender?: string | null
  address?: string | null
  orders?: unknown[] | null
}

interface AccountState {
  profile: Profile | null
  loading: boolean
  error: string | null
  loadProfile: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  clearError: () => void
}

export const useAccountStore = create<AccountState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadProfile: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await supabase.auth.getSession()
      const sessionObj = data as unknown
      function isSessionLike(x: unknown): x is { session: { user?: { id: string; user_metadata?: Record<string, unknown> } } } {
        return typeof x === 'object' && x !== null && 'session' in x
      }

      const user = isSessionLike(sessionObj) ? sessionObj.session?.user : undefined
      if (!user) {
        set({ profile: null, loading: false })
        return
      }

      const metadata = user.user_metadata ?? {}
      const profile: Profile = {
        id: user.id,
        full_name: typeof metadata.full_name === 'string' ? (metadata.full_name as string) : null,
        gender: typeof metadata.gender === 'string' ? (metadata.gender as string) : null,
        address: typeof metadata.address === 'string' ? (metadata.address as string) : null,
        orders: Array.isArray(metadata.orders) ? (metadata.orders as unknown[]) : null,
      }

      set({ profile, loading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      set({ error: message, loading: false })
    }
  },

  updateProfile: async (data: Partial<Profile>) => {
    set({ loading: true, error: null })
    try {
      const metadata: Record<string, unknown> = {}
      if (data.full_name !== undefined) metadata.full_name = data.full_name
      if (data.gender !== undefined) metadata.gender = data.gender
      if (data.address !== undefined) metadata.address = data.address
      if (data.orders !== undefined) metadata.orders = data.orders

      if (Object.keys(metadata).length === 0) {
        set({ loading: false })
        return
      }

      const { data: updateData, error } = await supabase.auth.updateUser({ data: metadata })
      if (error) throw error

      // updateData may include updated user object
      const upd = updateData as unknown
      function isUpdateLike(x: unknown): x is { user?: { user_metadata?: Record<string, unknown>; id?: string } } {
        return typeof x === 'object' && x !== null && 'user' in x
      }

      const newUser = isUpdateLike(upd) ? upd.user : undefined
      const newMeta = newUser?.user_metadata ?? {}

      set((s) => ({
        profile: {
          id: s.profile?.id ?? newUser?.id ?? '',
          full_name: (newMeta.full_name as string) ?? s.profile?.full_name ?? null,
          gender: (newMeta.gender as string) ?? s.profile?.gender ?? null,
          address: (newMeta.address as string) ?? s.profile?.address ?? null,
          orders: Array.isArray(newMeta.orders) ? (newMeta.orders as unknown[]) : s.profile?.orders ?? null,
        },
        loading: false,
      }))
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      set({ error: message, loading: false })
    }
  },

  changePassword: async (newPassword: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      set({ loading: false })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      set({ error: message, loading: false })
    }
  },
}))

export default useAccountStore

