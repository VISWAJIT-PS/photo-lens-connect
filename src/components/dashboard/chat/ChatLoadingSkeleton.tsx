import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton, LoadingSpinner } from '@/components/ui/loading-animations';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/motion-wrappers';
import { transitions } from '@/lib/motion';

interface ChatLoadingSkeletonProps {
  type?: 'conversations' | 'messages' | 'full';
}

const ChatLoadingSkeleton: React.FC<ChatLoadingSkeletonProps> = ({ type = 'full' }) => {
  const pulseAnimation = {
    opacity: [0.5, 1, 0.5],
  };
  
  const pulseTransition = {
    duration: 1.5,
    repeat: Infinity,
    ease: [0.4, 0, 0.6, 1] as any
  };

  const ConversationsSkeleton = () => (
    <motion.div 
      className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transitions.spring}
    >
      {/* Header Skeleton */}
      <motion.div 
        className="flex-shrink-0 p-4 border-b border-gray-200"
        animate={pulseAnimation}
        transition={pulseTransition}
      >
        <Skeleton className="h-6 w-24 mb-3" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </motion.div>
      
      {/* Conversations List Skeleton */}
      <div className="overflow-y-auto h-[82vh] p-2">
        <StaggerContainer className="space-y-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="p-3 rounded-xl"
                animate={pulseAnimation}
                transition={{ ...pulseTransition, delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  <Skeleton variant="circular" className="h-10 w-10" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20 rounded-full" />
                      <Skeleton variant="circular" className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </motion.div>
  );

  const MessagesSkeleton = () => (
    <motion.div 
      className="flex-1 flex flex-col bg-white"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transitions.spring}
    >
      {/* Chat Header Skeleton */}
      <motion.div 
        className="flex-shrink-0 p-4 border-b border-gray-200"
        animate={pulseAnimation}
        transition={pulseTransition}
      >
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </motion.div>

      {/* Tab Navigation Skeleton */}
      <motion.div 
        className="flex-shrink-0 border-b border-gray-200 bg-white"
        animate={pulseAnimation}
        transition={{ ...pulseTransition, delay: 0.2 }}
      >
        <div className="flex">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex-1 p-3 text-center">
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Messages Area Skeleton */}
      <motion.div 
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        animate={pulseAnimation}
        transition={{ ...pulseTransition, delay: 0.4 }}
      >
        <StaggerContainer className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => {
            const isOwn = index % 3 === 0;
            return (
              <StaggerItem key={index}>
                <motion.div
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transitions.spring, delay: index * 0.1 }}
                >
                  <div className={`max-w-xs lg:max-w-md ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
                    <Skeleton 
                      className={`h-12 rounded-2xl ${
                        isOwn ? 'bg-blue-200' : 'bg-gray-200'
                      }`} 
                    />
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </motion.div>

      {/* Message Input Skeleton */}
      <motion.div 
        className="flex-shrink-0 p-4 border-t border-gray-200 bg-white"
        animate={pulseAnimation}
        transition={{ ...pulseTransition, delay: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <Skeleton variant="circular" className="h-10 w-10" />
          <Skeleton className="flex-1 h-12 rounded-xl" />
          <Skeleton variant="circular" className="h-12 w-12" />
        </div>
      </motion.div>
    </motion.div>
  );

  const LoadingSpinnerComponent = () => (
    <motion.div 
      className="flex-1 flex items-center justify-center bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transitions.default}
    >
      <FadeIn>
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <motion.p 
            className="text-gray-600"
            animate={pulseAnimation}
            transition={pulseTransition}
          >
            Loading your conversations...
          </motion.p>
        </div>
      </FadeIn>
    </motion.div>
  );

  switch (type) {
    case 'conversations':
      return <ConversationsSkeleton />;
    case 'messages':
      return <MessagesSkeleton />;
    case 'full':
      return (
        <motion.div 
          className="flex bg-gray-100 overflow-hidden h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transitions.default}
        >
          <ConversationsSkeleton />
          <MessagesSkeleton />
        </motion.div>
      );
    default:
      return <LoadingSpinnerComponent />;
  }
};

export default ChatLoadingSkeleton;