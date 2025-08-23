import React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import ConversationList from './chat/ConversationList';
import ChatHeader from './chat/ChatHeader';
import TabNavigation from './chat/TabNavigation';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import GalleryView from './chat/GalleryView';
import InvoiceView from './chat/InvoiceView';
import EmptyChatState from './chat/EmptyChatState';
import { FadeIn, SlideIn, PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrappers';
import { transitions, pageVariants, slideVariants } from '@/lib/motion';

const ChatTab: React.FC = () => {
  const {
    // State
    chatData,
    selectedConversationId,
    searchQuery,
    messageInput,
    isMobileView,
    activeView,
    selectedConversation,
    messagesEndRef,
    
    // Actions
    setSelectedConversationId,
    setSearchQuery,
    setMessageInput,
    setActiveView,
    sendMessage,
    selectConversation,
    getFilteredConversations,
  } = useChat();

  const renderChatArea = () => {
    if (!selectedConversation) {
      return (
        <motion.div
          key="empty-state"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="flex-1"
        >
          <EmptyChatState />
        </motion.div>
      );
    }

    return (
      <motion.div 
        key={`chat-${selectedConversation.id}`}
        className="flex-1 flex flex-col bg-white"
        variants={slideVariants.right}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transitions.spring}
      >
        <FadeIn>
          <ChatHeader
            conversation={selectedConversation}
            isMobileView={isMobileView}
            onBackClick={() => setSelectedConversationId(null)}
          />
        </FadeIn>
        
        <SlideIn direction="down">
          <TabNavigation
            activeView={activeView}
            conversation={selectedConversation}
            onViewChange={setActiveView}
          />
        </SlideIn>
        
        <motion.div 
          className="flex-1 overflow-hidden"
          layout
          transition={transitions.spring}
        >
          <AnimatePresence mode="wait">
            {activeView === 'messages' && (
              <motion.div 
                key="messages-view"
                className="flex-1 flex flex-col h-full"
                variants={slideVariants.up}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transitions.spring}
              >
                <motion.div 
                  className='h-[70vh] overflow-y-auto bg-gray-50'
                  layout
                  transition={transitions.default}
                >
                  <MessageList
                    messages={selectedConversation.messages}
                    currentUserId={chatData.currentUserId}
                    messagesEndRef={messagesEndRef}
                  />
                </motion.div>
                <SlideIn direction="up">
                  <MessageInput
                    messageInput={messageInput}
                    onMessageInputChange={setMessageInput}
                    onSendMessage={sendMessage}
                  />
                </SlideIn>
              </motion.div>
            )}
            {activeView === 'gallery' && (
              <motion.div
                key="gallery-view"
                className="h-full bg-gray-50"
                variants={slideVariants.left}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transitions.spring}
              >
                <GalleryView photos={selectedConversation.gallery} />
              </motion.div>
            )}
            {activeView === 'invoice' && (
              <motion.div
                key="invoice-view"
                className="h-full bg-gray-50"
                variants={slideVariants.right}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transitions.spring}
              >
                <InvoiceView invoice={selectedConversation.invoice} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <LayoutGroup>
      <motion.div 
        className="flex bg-gray-50 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transitions.default}
      >
        {/* Mobile Layout */}
        {isMobileView && (
          <motion.div 
            className="w-full h-full"
            layout
            transition={transitions.spring}
          >
            <AnimatePresence mode="wait">
              {selectedConversationId ? (
                <motion.div
                  key="chat-area-mobile"
                  variants={slideVariants.left}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={transitions.spring}
                  className="h-full"
                >
                  {renderChatArea()}
                </motion.div>
              ) : (
                <motion.div
                  key="conversation-list-mobile"
                  variants={slideVariants.right}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={transitions.spring}
                  className="h-full"
                >
                  <ConversationList
                    conversations={getFilteredConversations()}
                    selectedConversationId={selectedConversationId}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSelectConversation={selectConversation}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Desktop Layout */}
        {!isMobileView && (
          <>
            <motion.div
              layout
              transition={transitions.spring}
              className="flex-shrink-0 bg-gray-100"
            >
              <SlideIn direction="left">
                <ConversationList
                  conversations={getFilteredConversations()}
                  selectedConversationId={selectedConversationId}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSelectConversation={selectConversation}
                />
              </SlideIn>
            </motion.div>
            <motion.div
              layout
              transition={transitions.spring}
              className="flex-1"
            >
              <AnimatePresence mode="wait">
                {renderChatArea()}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </motion.div>
    </LayoutGroup>
  );
};

export default ChatTab;