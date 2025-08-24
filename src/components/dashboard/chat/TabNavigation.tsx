import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Images, Receipt, Lock } from 'lucide-react';
import { Button } from '../../ui/button';
import { Interactive } from '@/components/ui/motion-wrappers';
import { transitions } from '@/lib/motion';
import type { ActiveView, Conversation } from '../../../types/chat.types';

interface TabNavigationProps {
  activeView: ActiveView;
  conversation: Conversation;
  onViewChange: (view: ActiveView) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeView,
  conversation,
  onViewChange,
}) => {
  const tabIndicatorVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: { 
      scaleX: 1, 
      opacity: 1,
      transition: { ...transitions.spring, duration: 0.3 }
    },
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { ...transitions.bounce, delay: 0.1 }
    },
    hover: {
      scale: 1.1,
      transition: transitions.fast
    },
  };

  const iconVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: transitions.fast 
    },
    tap: { 
      scale: 0.95,
      transition: transitions.fast 
    },
  };

  return (
    <motion.div 
      className="flex-shrink-0 border-b border-gray-200 bg-white"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={transitions.spring}
    >
      <motion.div 
        className="flex relative"
        layout
        transition={transitions.spring}
      >
        {/* Messages Tab */}
        <Interactive
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="ghost"
            onClick={() => onViewChange('messages')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all duration-200 relative ${
              activeView === 'messages'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
              <MessageSquare className="h-4 w-4" />
            </motion.div>
            <span>Messages</span>
            {activeView === 'messages' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                variants={tabIndicatorVariants}
                initial="hidden"
                animate="visible"
                layoutId="activeTabIndicator"
              />
            )}
          </Button>
        </Interactive>
        
        {/* Gallery Tab */}
        <Interactive
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="ghost"
            onClick={() => {
              if (!conversation?.gallery) return;
              onViewChange('gallery');
            }}
            disabled={!conversation.gallery}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all duration-200 relative ${
              activeView === 'gallery'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : conversation.gallery
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  : 'border-transparent text-gray-400 cursor-not-allowed'
            }`}
          >
            <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
              <Images className="h-4 w-4" />
            </motion.div>
            <span>Gallery</span>
            <AnimatePresence>
              {conversation.gallery && (
                <motion.span 
                  className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full font-medium"
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                >
                  {conversation.gallery.length}
                </motion.span>
              )}
              {!conversation.gallery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transitions.bounce}
                >
                  <Lock className="h-3 w-3" />
                </motion.div>
              )}
            </AnimatePresence>
            {activeView === 'gallery' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                variants={tabIndicatorVariants}
                initial="hidden"
                animate="visible"
                layoutId="activeTabIndicator"
              />
            )}
          </Button>
        </Interactive>
        
        {/* Invoice Tab */}
        <Interactive
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="ghost"
            onClick={() => {
              if (!conversation?.invoice) return;
              onViewChange('invoice');
            }}
            disabled={!conversation.invoice}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all duration-200 relative ${
              activeView === 'invoice'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : conversation.invoice
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  : 'border-transparent text-gray-400 cursor-not-allowed'
            }`}
          >
            <motion.div variants={iconVariants} initial="rest" whileHover="hover" whileTap="tap">
              <Receipt className="h-4 w-4" />
            </motion.div>
            <span>Invoice</span>
            <AnimatePresence>
              {conversation.invoice && (
                <motion.span 
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    conversation.invoice.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : conversation.invoice.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                >
                  {conversation.invoice.status === 'paid' ? '✓' : 
                   conversation.invoice.status === 'pending' ? '⏳' : '⚠️'}
                </motion.span>
              )}
              {!conversation.invoice && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transitions.bounce}
                >
                  <Lock className="h-3 w-3" />
                </motion.div>
              )}
            </AnimatePresence>
            {activeView === 'invoice' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                variants={tabIndicatorVariants}
                initial="hidden"
                animate="visible"
                layoutId="activeTabIndicator"
              />
            )}
          </Button>
        </Interactive>
      </motion.div>
    </motion.div>
  );
};

export default TabNavigation;