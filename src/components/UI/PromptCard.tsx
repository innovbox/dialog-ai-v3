import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCopy, faEye, faDownload, faUser } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Prompt } from '../../types';

interface PromptCardProps {
  prompt: Prompt;
  isLiked?: boolean;
  onView: (prompt: Prompt) => void;
  onCopy: (content: string) => void;
  onLike: (promptId: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ 
  prompt, 
  isLiked = false, 
  onView, 
  onCopy, 
  onLike 
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      chatgpt: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      claude: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      midjourney: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      dalle: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
      marketing: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      code: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200',
      creative: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      productivite: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
      business: 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200',
      autre: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.autre;
  };

  const getCategoryName = (category: string) => {
    const names = {
      chatgpt: 'ChatGPT',
      claude: 'Claude',
      midjourney: 'Midjourney',
      dalle: 'DALL-E',
      marketing: 'Marketing',
      code: 'Code',
      creative: 'Créatif',
      productivite: 'Productivité',
      business: 'Business',
      autre: 'Autre'
    };
    return names[category as keyof typeof names] || category;
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    
    let dateObj: Date;
    if (date.toDate && typeof date.toDate === 'function') {
      // Firebase Timestamp
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }
    
    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image d'aperçu */}
      {prompt.imageUrl && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Header avec titre et catégorie */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {prompt.title}
            </h3>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(prompt.category)}`}>
              {getCategoryName(prompt.category)}
            </span>
          </div>
        </div>

        {/* Contenu du prompt */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
          {truncateContent(prompt.content)}
        </p>

        {/* Informations auteur et stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-1.5" />
              <span className="truncate max-w-20">
                {prompt.authorName || 'Anonyme'}
              </span>
            </div>
            
            {prompt.createdAt && (
              <div className="flex items-center">
                <span>{formatDate(prompt.createdAt)}</span>
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            {prompt.copies > 0 && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faDownload} className="mr-1" />
                <span>{prompt.copies}</span>
              </div>
            )}
            
            {prompt.likes > 0 && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faHeart} className="mr-1" />
                <span>{prompt.likes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Bouton Like */}
            <motion.button
              onClick={() => onLike(prompt.id)}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-100 dark:bg-red-900/50 text-red-500 shadow-sm' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isLiked ? 'Retirer le like' : 'Liker ce prompt'}
            >
              <FontAwesomeIcon icon={faHeart} className="text-sm" />
            </motion.button>
            
            {/* Bouton Copier */}
            <motion.button
              onClick={() => onCopy(prompt.content)}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-500 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Copier le prompt"
            >
              <FontAwesomeIcon icon={faCopy} className="text-sm" />
            </motion.button>
          </div>
          
          {/* Bouton Voir */}
          <motion.button
            onClick={() => onView(prompt)}
            className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FontAwesomeIcon icon={faEye} className="text-sm" />
            <span>Voir</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptCard;