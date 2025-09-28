import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Image as ImageIcon,
  File
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useDropzone } from 'react-dropzone'
import {
  useChatMessages,
  useSendMessage,
  useChatParticipants,
  useMarkMessagesAsRead,
  useChatSubscription,
  useUploadChatFile,
  Chat
} from '@/hooks/use-realtime-chat'
import { useAuth } from '@/hooks/use-auth'
import { formatDistanceToNow } from 'date-fns'

interface ChatWindowProps {
  chat: Chat
  onClose?: () => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onClose }) => {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: messages = [] } = useChatMessages(chat.id)
  const { data: participants = [] } = useChatParticipants(chat.id)
  const sendMessageMutation = useSendMessage()
  const markAsReadMutation = useMarkMessagesAsRead()
  const uploadFileMutation = useUploadChatFile()

  // Set up real-time subscription
  useChatSubscription(chat.id)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (messages.length > 0) {
      markAsReadMutation.mutate(chat.id)
    }
  }, [chat.id, messages.length])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    try {
      await sendMessageMutation.mutateAsync({
        chatId: chat.id,
        content: message.trim(),
        replyToId: replyTo || undefined
      })

      setMessage('')
      setReplyTo(null)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      const uploadResult = await uploadFileMutation.mutateAsync(file)

      await sendMessageMutation.mutateAsync({
        chatId: chat.id,
        content: `Shared a file: ${uploadResult.name}`,
        messageType: 'file',
        fileUrl: uploadResult.url,
        fileName: uploadResult.name,
        fileSize: uploadResult.size
      })
    } catch (error) {
      console.error('Failed to upload file:', error)
    }
  }

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(handleFileUpload)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // We'll handle clicks manually
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  })

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  const getOtherParticipant = () => {
    if (chat.type === 'direct' && participants.length >= 2) {
      return participants.find(p => p.user_id !== user?.id)
    }
    return null
  }

  const otherParticipant = getOtherParticipant()

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                {otherParticipant?.user_id?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {chat.title || `User ${otherParticipant?.user_id}` || 'Chat'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Search Messages</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Leave Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4" {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
              <p className="text-lg font-medium">Drop files here to share</p>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${msg.sender_id === user?.id ? 'order-2' : 'order-1'}`}
                >
                  {msg.reply_to_id && (
                    <div className="mb-2 p-2 bg-muted rounded text-sm">
                      Replying to message
                    </div>
                  )}

                  <div
                    className={`rounded-lg p-3 ${
                      msg.sender_id === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.message_type === 'file' && msg.file_url ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <File className="h-4 w-4" />
                          <span className="font-medium">{msg.file_name}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(msg.file_url, '_blank')}
                        >
                          Download
                        </Button>
                      </div>
                    ) : msg.message_type === 'image' && msg.file_url ? (
                      <div className="space-y-2">
                        <img
                          src={msg.file_url}
                          alt="Shared image"
                          className="max-w-full rounded"
                        />
                        {msg.content && (
                          <p>{msg.content}</p>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}

                    {msg.is_edited && (
                      <span className="text-xs opacity-70 ml-2">(edited)</span>
                    )}
                  </div>

                  <div
                    className={`text-xs text-muted-foreground mt-1 ${
                      msg.sender_id === user?.id ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatMessageTime(msg.created_at)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Reply Preview */}
        {replyTo && (
          <div className="px-4 py-2 bg-muted/50 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Replying to message</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyTo(null)}
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex-shrink-0 p-4 border-t">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="min-h-[40px]"
              />
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {/* Emoji picker */}}
              >
                <Smile className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
              e.target.value = ''
            }}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>
      </div>
    </Card>
  )
}