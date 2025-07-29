import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSave } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useToastContext } from '../contexts/ToastContext';
import { PromptService } from '../services/promptService';

const CreatePrompt: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { currentUser } = useAuth();
  const { success, error: showError } = useToastContext();
  const navigate = useNavigate();

  const categories = [
    { id: 'chatgpt', name: 'ChatGPT' },
    { id: 'claude', name: 'Claude' },
    { id: 'midjourney', name: 'Midjourney' },
    { id: 'dalle', name: 'DALL-E' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'code', name: 'Code' },
    { id: 'creative', name: 'Créatif' },
    { id: 'productivite', name: 'Productivité' },
    { id: 'business', name: 'Business' },
    { id: 'autre', name: 'Autre' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      setImage(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !content || !category) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!currentUser) {
      setError('Vous devez être connecté pour publier un prompt');
      return;
    }

    setLoading(true);

    try {
      const promptData = {
        title,
        content,
        category,
        isPublic,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || 'Utilisateur anonyme'
      };

      await PromptService.createPrompt(promptData, image || undefined);
      
      success('✅ Prompt publié avec succès !');

      // Redirection vers le dashboard après succès
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la publication du prompt');
      showError('Impossible de publier le prompt');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Vous devez être connecté pour créer un prompt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Publier un Prompt
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Partagez votre prompt avec la communauté
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre du prompt *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ex: Assistant de code expert"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contenu du prompt *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Décrivez votre prompt en détail..."
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Utilisez [VARIABLE] pour les éléments que l'utilisateur devra remplacer
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image d'aperçu (optionnel)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="mx-auto h-32 w-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <FontAwesomeIcon
                      icon={faUpload}
                      className="mx-auto h-12 w-12 text-gray-400"
                    />
                  )}
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-500 hover:text-blue-600 focus-within:outline-none"
                    >
                      <span>{imagePreview ? 'Changer l\'image' : 'Télécharger une image'}</span>
                      <input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, WEBP jusqu'à 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Rendre ce prompt public (visible par tous les utilisateurs)
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  'Publication...'
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Publier
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePrompt;