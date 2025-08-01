import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import PromptCard from '../components/UI/PromptCard';
import PromptModal from '../components/UI/PromptModal';
import { Prompt } from '../types';
import { useToastContext } from '../contexts/ToastContext';
import { PromptService } from '../services/promptService';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/UI/PageTransition';
import { samplePrompts } from '../data/samplePrompts';

const Explore: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  
  const { success, error } = useToastContext();
  const { currentUser } = useAuth();
  const promptService = new PromptService();

  const categories = [
    { id: 'all', name: 'Toutes' },
    { id: 'chatgpt', name: 'ChatGPT' },
    { id: 'claude', name: 'Claude' },
    { id: 'midjourney', name: 'Midjourney' },
    { id: 'dalle', name: 'DALL-E' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'code', name: 'Code' },
    { id: 'creative', name: 'Créatif' },
  ];

  // Charger les prompts publics
  useEffect(() => {
    const loadPrompts = async () => {
      try {
        setLoading(true);
        const publicPrompts = await PromptService.getPublicPrompts();
        
        // Si aucun prompt public, ajouter les exemples
        if (publicPrompts.length === 0) {
          console.log('Aucun prompt trouvé, ajout des exemples...');
          await promptService.initializeSamplePrompts();
          // Recharger après ajout des exemples
          const updatedPrompts = await PromptService.getPublicPrompts();
          setPrompts(updatedPrompts);
          setFilteredPrompts(updatedPrompts);
        } else {
          setPrompts(publicPrompts);
          setFilteredPrompts(publicPrompts);
        }
      } catch (err) {
        error('Erreur lors du chargement des prompts');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPrompts();
  }, [error]);

  // Charger les likes de l'utilisateur
  useEffect(() => {
    const loadUserLikes = async () => {
      if (!currentUser) return;
      
      try {
        const likes = new Set<string>();
        for (const prompt of prompts) {
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

    if (prompts.length > 0) {
      loadUserLikes();
    }
  }, [prompts, currentUser]);

  useEffect(() => {
    let filtered = prompts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrompts(filtered);
  }, [prompts, selectedCategory, searchTerm]);

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
        setPrompts(prev => 
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
      setPrompts(prev =>
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

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Explorer les Prompts
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Découvrez des prompts créés par la communauté
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="mb-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Rechercher des prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des prompts...</p>
          </div>
        </div>
      ) : (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
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
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && filteredPrompts.length === 0 && prompts.length > 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Aucun prompt trouvé
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {searchTerm && `Recherche: "${searchTerm}"`}
              {searchTerm && selectedCategory !== 'all' && ' • '}
              {selectedCategory !== 'all' && `Catégorie: ${selectedCategory}`}
            </p>
          </div>
        </motion.div>
      )}

      {!loading && prompts.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Aucun prompt public disponible
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Soyez le premier à publier un prompt !
            </p>
          </div>
        </motion.div>
      )}

      <PromptModal
        prompt={selectedPrompt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCopy={(content) => handleCopyPrompt(content, selectedPrompt?.id)}
      />
      </div>
    </PageTransition>
  );
};

export default Explore;