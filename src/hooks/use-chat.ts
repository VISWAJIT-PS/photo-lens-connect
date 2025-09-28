import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables, TablesInsert } from '@/integrations/supabase/types'
import { useEffect, useState } from 'react'

type Chat = Tables<'chats'> & {
  participants: string[]
  last_message?: {
    content: string
    sender_id: string
    created_at: string
  }
}

type Message = Tables<'chat_messages'>

export const useChats = (userId: string) => {
  return useQuery({
    queryKey: ['chats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_participants')
        .select(`
          chat_id,
          role,
          joined_at,
          last_read_at,
          chats!inner (
            id,
            type,
            title,
            description,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)

      if (error) throw error

      // Get last messages for each chat
      const chatsWithMessages = await Promise.all(
        (data || []).map(async (participant) => {
          const chat = participant.chats as any

          // Get last message
          const { data: lastMessage } = await supabase
            .from('chat_messages')
            .select('content, sender_id, created_at')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          return {
            ...chat,
            participants: [userId], // Will be expanded by getChatParticipants
            last_message: lastMessage || undefined
          }
        })
      )

      return chatsWithMessages
    },
    enabled: !!userId,
  })
}

export const useMessages = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!chatId) return

    // Initial fetch
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
        return
      }

      setMessages(data || [])
    }

    fetchMessages()

    // Set up real-time subscription
    const subscription = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === payload.new.id ? payload.new as Message : msg
            )
          )
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [chatId])

  return { messages, setMessages }
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (message: {
      chat_id: string
      sender_id: string
      content: string
      message_type?: 'text' | 'image' | 'file'
      file_url?: string
      file_name?: string
      file_size?: number
    }) => {
      const newMessage = {
        chat_id: message.chat_id,
        sender_id: message.sender_id,
        content: message.content,
        message_type: message.message_type || 'text',
        file_url: message.file_url || null,
        file_name: message.file_name || null,
        file_size: message.file_size || null,
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert(newMessage)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ queryKey: ['messages', newMessage.chat_id] })
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ chatId, userId }: { chatId: string; userId: string }) => {
      // Update last_read_at for the chat participant
      const { error } = await supabase
        .from('chat_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('chat_id', chatId)
        .eq('user_id', userId)

      if (error) throw error
      return true
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] })
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}

export const useCreateChat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (participants: string[]) => {
      // Create chat
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert({
          type: 'direct',
          created_by: participants[0]
        })
        .select()
        .single()

      if (chatError) throw chatError

      // Add participants
      const { error: participantsError } = await supabase
        .from('chat_participants')
        .insert(
          participants.map(userId => ({
            chat_id: chat.id,
            user_id: userId,
            role: 'member'
          }))
        )

      if (participantsError) throw participantsError

      return chat
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}