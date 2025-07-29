import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faSearch, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Boostez vos{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              idées IA
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Découvrez, partagez et optimisez vos prompts pour ChatGPT, Claude, Midjourney et toutes les IA
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/explore"
              className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium text-lg"
            >
              <FontAwesomeIcon icon={faRocket} className="mr-2" />
              Commencer
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium text-lg"
            >
              Se connecter
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi Dialog-ai ?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              La plateforme ultime pour les créateurs de prompts IA
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: faSearch,
                title: 'Explorer & Découvrir',
                description: 'Parcourez des milliers de prompts créés par la communauté, organisés par catégories'
              },
              {
                icon: faLightbulb,
                title: 'Créer & Partager',
                description: 'Publiez vos prompts les plus efficaces et aidez la communauté à grandir'
              },
              {
                icon: faRocket,
                title: 'Optimiser & Performer',
                description: 'Trouvez les prompts parfaits pour maximiser vos résultats avec toutes les IA'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={feature.icon} className="text-2xl text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Prêt à révolutionner vos prompts IA ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Rejoignez des milliers de créateurs qui optimisent déjà leurs résultats
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium text-lg"
          >
            Créer un compte gratuit
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;