import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export interface ChatMessage {
  id: string
  chat_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'system'
  file_url?: string
  file_name?: string
  file_size?: number
  is_edited: boolean
  edited_at?: string
  reply_to_id?: string
  created_at: string
  updated_at: string
  sender?: {
    id: string
    name: string
    email?: string
  }
}

export interface Chat {
  id: string
  type: 'direct' | 'group'
  title?: string
  description?: string
  created_by: string
  created_at: string
  updated_at: string
  participants?: Array<{
    id: string
    user_id: string
    role: 'admin' | 'member'
    joined_at: string
    last_read_at: string
    is_active: boolean
    user?: {
      id: string
      name: string
      email?: string
    }
  }>
  last_message?: ChatMessage
  unread_count?: number
}

export interface ChatParticipant {
  id: string
  chat_id: string
  user_id: string
  role: 'admin' | 'member'
  joined_at: string
  last_read_at: string
  is_active: boolean
}

// Get all chats for the current user
export const useChats = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['chats', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          participants:chat_participants!inner(
            id,
            user_id,
            role,
            joined_at,
            last_read_at,
            is_active,
            user:event_users!chat_participants_user_id_fkey(
              id,
              name,
              email
            )
          ),
          last_message:chat_messages(
            id,
            content,
            message_type,
            created_at,
            sender:event_users!chat_messages_sender_id_fkey(
              id,
              name,
              email
            )
          )
        `)
        .eq('chat_participants.user_id', user.id)
        .eq('chat_participants.is_active', true)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })
}

// Get messages for a specific chat
export const useChatMessages = (chatId: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: async () => {
      if (!chatId) return []

      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:event_users!chat_messages_sender_id_fkey(
            id,
            name,
            email
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data as ChatMessage[]
    },
    enabled: !!chatId,
  })
}

// Send a message
export const useSendMessage = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      chatId,
      content,
      messageType = 'text',
      fileUrl,
      fileName,
      fileSize,
      replyToId
    }: {
      chatId: string
      content: string
      messageType?: 'text' | 'image' | 'file' | 'system'
      fileUrl?: string
      fileName?: string
      fileSize?: number
      replyToId?: string
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content,
          message_type: messageType,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          reply_to_id: replyToId
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', data.chat_id] })
      queryClient.invalidateQueries({ queryKey: ['chats'] })

      // Update last read timestamp
      supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('chat_id', data.chat_id)
        .eq('user_id', user?.id)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['chats'] })
        })
    },
    onError: (error) => {
      toast({
        title: 'Failed to send message',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      })
    },
  })
}

// Create or get existing direct chat between two users
export const useCreateDirectChat = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (otherUserId: string) => {
      if (!user?.id) throw new Error('User must be authenticated')

      // Create direct chat manually since RPC function doesn't exist
      // First check if chat already exists
      const { data: existingChat, error: existingError } = await supabase
        .from('chats')
        .select(`
          *,
          participants:chat_participants!inner(
            id,
            user_id,
            role,
            joined_at,
            last_read_at,
            is_active
          )
        `)
        .eq('chat_participants.user_id', user.id)
        .eq('chat_participants.is_active', true)
        .eq('type', 'direct')
        .single()

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError
      }

      if (existingChat) {
        return existingChat.id
      }

      // Create new chat
      const { data: newChat, error: newChatError } = await supabase
        .from('chats')
        .insert({
          type: 'direct',
          created_by: user.id
        })
        .select()
        .single()

      if (newChatError) throw newChatError

      // Add participants
      const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert([
          {
            chat_id: newChat.id,
            user_id: user.id
          },
          {
            chat_id: newChat.id,
            user_id: otherUserId
          }
        ])

      if (participantsError) throw participantsError

      return newChat.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

// Mark messages as read
export const useMarkMessagesAsRead = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (chatId: string) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const { error } = await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

// Real-time subscription for chat messages
export const useChatSubscription = (chatId: string) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!chatId || !user?.id) return

    const channel = supabase
      .channel(`chat-messages-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] })
          queryClient.invalidateQueries({ queryKey: ['chats'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId, user?.id, queryClient])
}

// Real-time subscription for chat list updates
export const useChatsSubscription = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel('chats-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_participants',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['chats'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chats'
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['chats'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, queryClient])
}

// Get chat participants
export const useChatParticipants = (chatId: string) => {
  return useQuery({
    queryKey: ['chat-participants', chatId],
    queryFn: async () => {
      if (!chatId) return []

      const { data, error } = await supabase
        .from('chat_participants')
        .select(`
          *,
          user:event_users!chat_participants_user_id_fkey(
            id,
            name,
            email
          )
        `)
        .eq('chat_id', chatId)
        .eq('is_active', true)

      if (error) throw error
      return data as ChatParticipant[]
    },
    enabled: !!chatId,
  })
}

// Add participant to chat (for group chats)
export const useAddChatParticipant = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      chatId,
      userId,
      role = 'member'
    }: {
      chatId: string
      userId: string
      role?: 'admin' | 'member'
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const { data, error } = await supabase
        .from('chat_participants')
        .insert({
          chat_id: chatId,
          user_id: userId,
          role
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-participants'] })
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

// Remove participant from chat
export const useRemoveChatParticipant = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      chatId,
      userId
    }: {
      chatId: string
      userId: string
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const { error } = await supabase
        .from('chat_participants')
        .update({ is_active: false })
        .eq('chat_id', chatId)
        .eq('user_id', userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-participants'] })
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

// Edit message
export const useEditMessage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      messageId,
      content
    }: {
      messageId: string
      content: string
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const { data, error } = await supabase
        .from('chat_messages')
        .update({
          content,
          is_edited: true,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', user.id) // Only allow editing own messages
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', data.chat_id] })
    },
  })
}

// Delete message
export const useDeleteMessage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!user?.id) throw new Error('User must be authenticated')

      // Soft delete by updating content
      const { data, error } = await supabase
        .from('chat_messages')
        .update({
          content: '[Message deleted]',
          message_type: 'system',
          is_edited: true,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', user.id) // Only allow deleting own messages
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', data.chat_id] })
    },
  })
}

// Search messages in a chat
export const useSearchChatMessages = (chatId: string, searchQuery: string) => {
  return useQuery({
    queryKey: ['chat-messages-search', chatId, searchQuery],
    queryFn: async () => {
      if (!chatId || !searchQuery.trim()) return []

      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:event_users!chat_messages_sender_id_fkey(
            id,
            name,
            email
          )
        `)
        .eq('chat_id', chatId)
        .ilike('content', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as ChatMessage[]
    },
    enabled: !!chatId && !!searchQuery.trim(),
  })
}

// Get unread message count for all chats
export const useUnreadMessageCount = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['unread-message-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0

      // This would require a more complex query or database function
      // For now, return 0 as a placeholder
      return 0
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// Upload file for chat message
export const useUploadChatFile = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `chat-files/${user.id}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('CHAT_FILES')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('CHAT_FILES')
        .getPublicUrl(filePath)

      return {
        url: urlData.publicUrl,
        name: file.name,
        size: file.size,
        type: file.type
      }
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive'
      })
    },
  })
}

// Typing indicators
export const useTypingIndicator = (chatId: string) => {
  const { user } = useAuth()
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const startTyping = useCallback(() => {
    if (!user?.id || !chatId) return

    setIsTyping(true)
    // In a real implementation, you would emit typing events to other users
    // This is a placeholder for the typing indicator functionality
  }, [user?.id, chatId])

  const stopTyping = useCallback(() => {
    if (!user?.id || !chatId) return

    setIsTyping(false)
    // In a real implementation, you would stop emitting typing events
  }, [user?.id, chatId])

  return {
    isTyping,
    typingUsers,
    startTyping,
    stopTyping
  }
}