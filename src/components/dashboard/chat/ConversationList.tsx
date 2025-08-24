import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import type { Conversation } from '../../../types/chat.types';
import { getFallbackAvatarUrl } from '../../../utils/chatUtils';
import { StaggerContainer, StaggerItem, FadeIn, SlideIn, Interactive } from '@/components/ui/motion-wrappers';
import { transitions, staggerVariants, interactionVariants } from '@/lib/motion';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
}) => {
  return (
    <motion.div 
      className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={transitions.spring}
    >
      {/* Fixed Header */}
      <motion.div 
        className="flex-shrink-0 p-4 border-b border-gray-200 bg-white"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...transitions.spring, delay: 0.1 }}
      >
        <FadeIn>
          <h2 className="text-xl font-bold mb-3 text-gray-900">Messages</h2>
        </FadeIn>
        <SlideIn direction="down">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={transitions.fast}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </motion.div>
            <motion.input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
              whileFocus={{ scale: 1.02 }}
              transition={transitions.fast}
            />
          </div>
        </SlideIn>
      </motion.div>

      {/* Scrollable Conversations List */}
      <motion.div 
        className="overflow-y-auto h-[82vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transitions.default, delay: 0.2 }}
      >
        <StaggerContainer className="p-2 space-y-1">
          <AnimatePresence>
            {conversations.map((conversation, index) => (
              <StaggerItem key={conversation.id}>
                <Interactive
                  whileHover={{ 
                    scale: 1.02,
                    y: -2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedConversationId === conversation.id 
                        ? "bg-blue-50 border border-blue-200 shadow-sm" 
                        : "hover:bg-gray-50"
                    }`}
                    layout
                    layoutId={`conversation-${conversation.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                      ...transitions.spring,
                      delay: index * 0.05
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <motion.div 
                        className="relative flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        transition={transitions.fast}
                      >
                        <motion.img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = getFallbackAvatarUrl(conversation.name, 40);
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ ...transitions.spring, delay: index * 0.05 + 0.1 }}
                        />
                        {conversation.isOnline && (
                          <motion.div 
                            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ ...transitions.bounce, delay: index * 0.05 + 0.3 }}
                          />
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <motion.div 
                          className="flex items-center justify-between mb-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...transitions.default, delay: index * 0.05 + 0.2 }}
                        >
                          <h4 className="font-semibold truncate text-gray-900 text-sm">{conversation.name}</h4>
                          <span className="text-xs text-gray-500 flex-shrink-0">{conversation.timestamp}</span>
                        </motion.div>
                        
                        <motion.p 
                          className="text-xs text-blue-600 mb-1 font-medium"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...transitions.default, delay: index * 0.05 + 0.25 }}
                        >
                          {conversation.role}
                        </motion.p>
                        
                        <motion.p 
                          className="text-sm text-gray-600 truncate mb-2 leading-tight"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...transitions.default, delay: index * 0.05 + 0.3 }}
                        >
                          {conversation.lastMessage}
                        </motion.p>
                        
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...transitions.default, delay: index * 0.05 + 0.35 }}
                        >
                          <motion.span 
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-mono"
                            whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
                            transition={transitions.fast}
                          >
                            {conversation.bookingId}
                          </motion.span>
                          {conversation.unreadCount > 0 && (
                            <motion.span 
                              className="h-5 w-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.2 }}
                              transition={{
                                ...transitions.bounce,
                                delay: index * 0.05 + 0.4
                              }}
                            >
                              {conversation.unreadCount}
                            </motion.span>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Interactive>
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerContainer>
      </motion.div>
    </motion.div>
  );
};

export default ConversationList;