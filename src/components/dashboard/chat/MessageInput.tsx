import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Interactive, FadeIn } from '@/components/ui/motion-wrappers';
import { transitions } from '@/lib/motion';

interface MessageInputProps {
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageInput,
  onMessageInputChange,
  onSendMessage,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSending) return;
    
    setIsSending(true);
    // Simulate sending delay for animation
    setTimeout(() => {
      onSendMessage();
      setIsSending(false);
    }, 500);
  };

  const inputVariants = {
    rest: { 
      scale: 1,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
    },
    focus: { 
      scale: 1.02,
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
      transition: transitions.fast
    },
  };

  const attachmentButtonVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 20,
      transition: transitions.fast 
    },
    tap: { 
      scale: 0.9,
      transition: transitions.fast 
    }
  };

  const emojiButtonVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: -10,
      transition: transitions.fast 
    },
    tap: { 
      scale: 0.9,
      transition: transitions.fast 
    }
  };

  const typingIndicatorVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.spring 
    },
  };

  return (
    <motion.div 
      className="flex-shrink-0 p-4 border-t border-gray-200 bg-white"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={transitions.spring}
    >
      {/* Typing Indicator */}
      <AnimatePresence>
        {messageInput.length > 0 && !isFocused && (
          <motion.div
            className="mb-2 text-xs text-gray-500 px-2"
            variants={typingIndicatorVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex items-center space-x-1">
              <span>Typing</span>
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-1 h-1 bg-gray-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="flex items-center space-x-3"
        layout
        transition={transitions.spring}
      >
        {/* Attachment Button */}
        <Interactive
          variants={attachmentButtonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Paperclip className="h-5 w-5 text-gray-600" />
          </Button>
        </Interactive>

        {/* Emoji Button */}
        <Interactive
          variants={emojiButtonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Smile className="h-5 w-5 text-gray-600" />
          </Button>
        </Interactive>

        {/* Message Input */}
        <motion.input
          type="text"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => onMessageInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
          variants={inputVariants}
          initial="rest"
          animate={isFocused ? "focus" : "rest"}
          disabled={isSending}
        />

        {/* Send Button */}
        <motion.div
          initial="rest"
          animate={
            isSending ? "sending" : 
            !messageInput.trim() ? "disabled" : "rest"
          }
          whileHover={!isSending && messageInput.trim() ? "hover" : undefined}
          whileTap={!isSending && messageInput.trim() ? "tap" : undefined}
          variants={{
            rest: { 
              scale: 1,
              rotate: 0,
              backgroundColor: "#2563eb"
            },
            hover: { 
              scale: 1.05,
              rotate: 15,
              backgroundColor: "#1d4ed8",
              transition: transitions.fast
            },
            tap: { 
              scale: 0.95,
              rotate: 45,
              transition: transitions.fast
            },
            sending: {
              scale: 1.1,
              rotate: 360,
              backgroundColor: "#10b981",
              transition: { 
                rotate: { duration: 0.5 },
                scale: transitions.fast,
                backgroundColor: transitions.fast
              }
            },
            disabled: {
              scale: 0.9,
              opacity: 0.5,
              transition: transitions.fast
            }
          }}
        >
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isSending ? (
                <motion.div
                  key="sending"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={transitions.fast}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={transitions.fast}
                >
                  <Send className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MessageInput;