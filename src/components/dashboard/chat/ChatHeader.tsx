import React from 'react';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '../../ui/button';
import type { Conversation } from '../../../types/chat.types';
import { getFallbackAvatarUrl } from '../../../utils/chatUtils';

interface ChatHeaderProps {
  conversation: Conversation;
  isMobileView: boolean;
  onBackClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  isMobileView,
  onBackClick,
}) => {
  return (
    <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isMobileView && (
            <Button variant="ghost"
              onClick={onBackClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
          )}
          
          <div className="relative">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="h-12 w-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = getFallbackAvatarUrl(conversation.name, 48);
              }}
            />
            {conversation.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{conversation.name}</h3>
            <p className="text-sm text-blue-600 font-medium">{conversation.role}</p>
            <p className="text-xs text-gray-500">{conversation.isOnline ? 'Active now' : 'Last seen recently'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-mono font-semibold">
            {conversation.bookingId}
          </span>
          <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;