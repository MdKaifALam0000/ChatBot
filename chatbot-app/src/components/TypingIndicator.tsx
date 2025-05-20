import React from 'react';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface TypingIndicatorProps {
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <AnimatePresence>
      <motion.div 
        className={`flex mb-4 ${className || ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mr-3">
            <motion.div 
              className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-white" />
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: -5 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-800 rounded-lg px-4 py-3 shadow-lg max-w-xs sm:max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full" 
                  animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full" 
                  animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                />
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full" 
                  animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />
              </div>
              <motion.span 
                className="text-xs text-zinc-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Gemini is generating...
              </motion.span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TypingIndicator;