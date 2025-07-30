import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import PromptCard from '../components/UI/PromptCard';
import PromptModal from '../components/UI/PromptModal';
import { useAuth } from '../contexts/AuthContext';
import { useToastContext } from '../contexts/ToastContext';
import { PromptService } from '../services/promptService';
import { Prompt } from '../types';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, error } = useToastContext();
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  // Charger les prompts de l'utilisateur
  useEffect(() => {
    const loadUserPrompts = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const prompts = await PromptService.getUserPrompts(currentUser.uid);
        setUserPrompts(prompts);
      } catch (err) {
        error('Erreur lors du chargement de vos prompts');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserPrompts();
  }, [currentUser]);

  // Charger les likes de l'utilisateur
  useEffect(() => {
    const loadUserLikes = async () => {
      if (!currentUser) return;
      
      try {
        const likes = new Set<string>();
        for (const prompt of userPrompts) {
          const hasLiked = await PromptService.hasUserLiked(prompt.id, currentUser.uid);
          if (hasLiked) {
            likes.add(prompt.id);
          }
        }
        setUserLikes(likes);
      } catch (err) {
        console.error('Erreur lors du chargement des likes:', err);
      }
    };

    if (userPrompts.length > 0) {
      loadUserLikes();
    }
  }, [userPrompts, currentUser]);

  const handleViewPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleCopyPrompt = async (content: string, promptId?: string) => {
    try {
      await navigator.clipboard.writeText(content);
      success('✅ Prompt copié dans le presse-papiers !');
      
      // Incrémenter le compteur de copies
      if (promptId) {
        await PromptService.incrementCopyCount(promptId, currentUser?.uid);
        // Mettre à jour l'état local
        setUserPrompts(prev => 
          prev.map(p => 
            p.id === promptId 
              ? { ...p, copies: p.copies + 1 }
              : p
          )
        );
      }
    } catch (err) {
      error('Impossible de copier le prompt');
      console.error('Erreur de copie:', err);
    }
  };

  const handleLikePrompt = async (promptId: string) => {
    if (!currentUser) {
      error('Vous devez être connecté pour liker un prompt');
      return;
    }

    try {
      const isLiked = await PromptService.toggleLike(promptId, currentUser.uid);
      
      // Mettre à jour l'état local
      setUserPrompts(prev =>
        prev.map(prompt =>
          prompt.id === promptId
            ? { 
                ...prompt, 
                likes: isLiked ? prompt.likes + 1 : prompt.likes - 1 
              }
            : prompt
        )
      );

      // Mettre à jour les likes utilisateur
      setUserLikes(prev => {
        const newLikes = new Set(prev);
        if (isLiked) {
          newLikes.add(promptId);
        } else {
          newLikes.delete(promptId);
        }
        return newLikes;
      });

      success(isLiked ? '❤️ Prompt liké !' : '💔 Like retiré');
    } catch (err) {
      error('Impossible de liker le prompt');
      console.error('Erreur de like:', err);
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce prompt ?')) {
      return;
    }

    try {
      await PromptService.deletePrompt(promptId);
      setUserPrompts(prev => prev.filter(prompt => prompt.id !== promptId));
      success('🗑️ Prompt supprimé avec succès');
    } catch (err) {
      error('Impossible de supprimer le prompt');
      console.error('Erreur de suppression:', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Vous devez être connecté pour accéder au dashboard.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mon Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez vos prompts et suivez vos performances
          </p>
        </div>

        <Link
          to="/create"
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Publier un Prompt
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Total Prompts
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {userPrompts.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Total Likes
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {userPrompts.reduce((total, prompt) => total + prompt.likes, 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Prompts Publics
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {userPrompts.filter(prompt => prompt.isPublic).length}
          </p>
        </div>
      </motion.div>

      {/* User Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Mes Prompts
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Chargement de vos prompts...</p>
            </div>
          </div>
        ) : userPrompts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              Vous n'avez pas encore créé de prompts
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Créer votre premier prompt
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <PromptCard
                  prompt={prompt}
                  isLiked={userLikes.has(prompt.id)}
                  onView={handleViewPrompt}
                  onCopy={(content) => handleCopyPrompt(content, prompt.id)}
                  onLike={handleLikePrompt}
                />
                
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => {/* Logique pour éditer */}}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeletePrompt(prompt.id)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <PromptModal
        prompt={selectedPrompt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCopy={(content) => handleCopyPrompt(content, selectedPrompt?.id)}
      />
    </div>
  );
};

export default Dashboard;