import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCopy, faEye, faDownload } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Prompt } from '../../types';

interface PromptCardProps {
  prompt: Prompt;
  isLiked?: boolean;
  onView: (prompt: Prompt) => void;
  onCopy: (content: string) => void;
  onLike: (promptId: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, isLiked = false, onView, onCopy, onLike }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prompt.imageUrl && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {prompt.title}
            </h3>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {prompt.category}
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {prompt.content.substring(0, 120)}...
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span>Par {prompt.authorName}</span>
            {prompt.copies > 0 && (
              <span className="ml-2">
                <FontAwesomeIcon icon={faDownload} className="mr-1" />
                {prompt.copies}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => onLike(prompt.id)}
              className={`p-2 rounded-lg transition-colors ${
                isLiked 
                  ? 'bg-red-100 dark:bg-red-900 text-red-500' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faHeart} />
              <span className="ml-1 text-xs">{prompt.likes}</span>
            </motion.button>
            
            <motion.button
              onClick={() => onCopy(prompt.content)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faCopy} />
            </motion.button>
            
            <motion.button
              onClick={() => onView(prompt)}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faEye} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptCard;