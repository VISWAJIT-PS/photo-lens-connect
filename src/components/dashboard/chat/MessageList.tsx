import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from '../../../types/chat.types';
import { getMessageStatusIcon, getMessageStatusColor } from '../../../utils/chatUtils';
import { StaggerContainer, StaggerItem, FadeIn, SlideIn } from '@/components/ui/motion-wrappers';
import { transitions, staggerVariants } from '@/lib/motion';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  messagesEndRef,
}) => {
  // Animation variants for message bubbles
  const messageVariants = {
    hidden: (isOwn: boolean) => ({
      opacity: 0,
      x: isOwn ? 30 : -30,
      scale: 0.8,
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: transitions.spring,
    },
    exit: (isOwn: boolean) => ({
      opacity: 0,
      x: isOwn ? 30 : -30,
      scale: 0.8,
      transition: transitions.fast,
    }),
    hover: {
      scale: 1.02,
      y: -2,
      transition: transitions.fast,
    },
  };

  const statusIconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { ...transitions.bounce, delay: 0.3 }
    },
  };

  return (
    <motion.div 
      className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitions.spring}
    >
      <StaggerContainer className="space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isOwn = message.senderId === currentUserId;
            return (
              <StaggerItem key={message.id}>
                <motion.div
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={isOwn}
                  whileHover="hover"
                  layout
                >
                  <motion.div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isOwn
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                    }`}
                    whileHover={{ 
                      boxShadow: isOwn 
                        ? "0 8px 25px rgba(37, 99, 235, 0.3)" 
                        : "0 8px 25px rgba(0, 0, 0, 0.1)"
                    }}
                    transition={transitions.fast}
                  >
                    <motion.p 
                      className="text-sm leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ ...transitions.default, delay: index * 0.05 + 0.1 }}
                    >
                      {message.content}
                    </motion.p>
                    <motion.div 
                      className="flex items-center justify-between mt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...transitions.default, delay: index * 0.05 + 0.2 }}
                    >
                      <p className={`text-xs ${
                        isOwn ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {message.timestamp}
                      </p>
                      {isOwn && (
                        <motion.span 
                          className={`text-xs ml-2 ${getMessageStatusColor(message.status)}`}
                          variants={statusIconVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {getMessageStatusIcon(message.status)}
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </AnimatePresence>
        <motion.div 
          ref={messagesEndRef} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </StaggerContainer>
    </motion.div>
  );
};

export default MessageList;