import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const requestPasswordReset = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
      return true
    },
    onSuccess: () => {
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for instructions to reset your password.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error sending reset email',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const updatePassword = useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      return true
    },
    onSuccess: () => {
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating password',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  return {
    requestPasswordReset: (email: string) => {
      setLoading(true)
      requestPasswordReset.mutate(email, {
        onSettled: () => setLoading(false),
      })
    },
    updatePassword: (newPassword: string) => {
      setLoading(true)
      updatePassword.mutate(newPassword, {
        onSettled: () => setLoading(false),
      })
    },
    loading: loading || requestPasswordReset.isPending || updatePassword.isPending,
  }
}

export const useEmailVerification = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const resendVerification = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (error) throw error
      return true
    },
    onSuccess: () => {
      toast({
        title: 'Verification email sent',
        description: 'Check your email for the verification link.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error sending verification email',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const verifyEmail = useMutation({
    mutationFn: async (token: string) => {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      })

      if (error) throw error
      return true
    },
    onSuccess: () => {
      toast({
        title: 'Email verified',
        description: 'Your email has been successfully verified.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error verifying email',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  return {
    resendVerification: (email: string) => {
      setLoading(true)
      resendVerification.mutate(email, {
        onSettled: () => setLoading(false),
      })
    },
    verifyEmail: (token: string) => {
      setLoading(true)
      verifyEmail.mutate(token, {
        onSettled: () => setLoading(false),
      })
    },
    loading: loading || resendVerification.isPending || verifyEmail.isPending,
  }
}