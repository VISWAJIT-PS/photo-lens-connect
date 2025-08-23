import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Camera, Heart } from 'lucide-react';
import { FadeIn, SlideIn, ScaleIn, StaggerContainer, StaggerItem, Interactive } from '@/components/ui/motion-wrappers';
import { transitions, staggerVariants } from '@/lib/motion';

const EmptyChatState: React.FC = () => {
  const iconVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 10,
      transition: transitions.fast 
    },
  };

  return (
    <motion.div 
      className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={transitions.spring}
    >
      <StaggerContainer className="text-center max-w-md">
        <StaggerItem>
          <motion.div 
            className="mb-6 flex justify-center"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1]
            }}
          >
            <Interactive
              variants={iconVariants}
              initial="rest"
              whileHover="hover"
            >
              <div className="relative">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ 
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                    scale: 1.05
                  }}
                  transition={transitions.spring}
                >
                  <MessageSquare className="h-10 w-10 text-white" />
                </motion.div>
                
                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...transitions.bounce, delay: 0.5 }}
                >
                  <Heart className="h-3 w-3 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-2 -left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...transitions.bounce, delay: 0.7 }}
                >
                  <Camera className="h-4 w-4 text-white" />
                </motion.div>
              </div>
            </Interactive>
          </motion.div>
        </StaggerItem>
        
        <StaggerItem>
          <FadeIn>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to PhotoLens Chat
            </h3>
          </FadeIn>
        </StaggerItem>
        
        <StaggerItem>
          <SlideIn direction="up">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Select a conversation to start chatting with photographers,
              view galleries, and manage your bookings.
            </p>
          </SlideIn>
        </StaggerItem>
        
        <StaggerItem>
          <ScaleIn>
            <motion.div 
              className="grid grid-cols-3 gap-4 mt-8"
              variants={staggerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: MessageSquare, label: "Chat", color: "blue" },
                { icon: Camera, label: "Gallery", color: "purple" },
                { icon: Heart, label: "Favorites", color: "pink" }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className={`p-4 rounded-xl bg-${item.color}-100 text-${item.color}-600 text-center`}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: transitions.fast
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transitions.spring, delay: index * 0.1 + 1 }}
                >
                  <item.icon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </ScaleIn>
        </StaggerItem>
      </StaggerContainer>
    </motion.div>
  );
};

export default EmptyChatState;