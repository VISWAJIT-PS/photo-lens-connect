import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'

type UserRole = Tables<'user_roles'>
type UserProfile = Tables<'user_profiles'>
type UserOnboarding = Tables<'user_onboarding'>
type NotificationPreferences = Tables<'notification_preferences'>

export const useUserRoles = (userId: string) => {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('granted_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
      return data || null
    },
    enabled: !!userId,
  })
}

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profile: {
      user_id: string
      bio?: string
      website?: string
      experience_years?: number
      specializations?: string[]
      languages?: string[]
      timezone?: string
    }) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', data.user_id] })
      queryClient.invalidateQueries({ queryKey: ['user-roles'] })
    },
  })
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, updates }: {
      userId: string
      updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>
    }) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', data.user_id] })
    },
  })
}

export const useNotificationPreferences = (userId: string) => {
  return useQuery({
    queryKey: ['notification-preferences', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data || null
    },
    enabled: !!userId,
  })
}

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, preferences }: {
      userId: string
      preferences: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at'>>
    }) => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({ user_id: userId, ...preferences })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences', data.user_id] })
    },
  })
}

export const useUserOnboarding = (userId: string) => {
  return useQuery({
    queryKey: ['user-onboarding', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

export const useUpdateOnboardingStep = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, step, data, isCompleted }: {
      userId: string
      step: string
      data?: Record<string, any>
      isCompleted?: boolean
    }) => {
      const { data: result, error } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: userId,
          step,
          data: data || {},
          is_completed: isCompleted || false,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .select()
        .single()

      if (error) throw error
      return result
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-onboarding', data.user_id] })
    },
  })
}

// Role-based access control utilities
export const useHasRole = (userId: string, role: string) => {
  const { data: roles } = useUserRoles(userId)

  return {
    hasRole: roles?.some(r => r.role === role && r.is_active) || false,
    roles: roles || []
  }
}

export const useIsAdmin = (userId: string) => {
  const { hasRole } = useHasRole(userId, 'admin')
  return hasRole
}

export const useIsPhotographer = (userId: string) => {
  const { hasRole } = useHasRole(userId, 'photographer')
  return hasRole
}

export const useIsCustomer = (userId: string) => {
  const { hasRole } = useHasRole(userId, 'customer')
  return hasRole
}

// Grant role (admin only)
export const useGrantRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, role, grantedBy, permissions }: {
      userId: string
      role: string
      grantedBy: string
      permissions?: Record<string, any>
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role,
          granted_by: grantedBy,
          permissions: permissions || {},
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', data.user_id] })
      queryClient.invalidateQueries({ queryKey: ['user-roles'] })
    },
  })
}

// Revoke role (admin only)
export const useRevokeRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, role }: {
      userId: string
      role: string
    }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false, expires_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('role', role)

      if (error) throw error
      return true
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['user-roles'] })
    },
  })
}