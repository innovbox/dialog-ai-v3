import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faGithub as faGithubBrand } from '@fortawesome/free-brands-svg-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import UserMenu from '../UI/UserMenu';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Dialog-ai</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Explorer
            </Link>
            {currentUser && (
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
            </button>

            <a
              href="https://github.com/dialog-ai/dialog-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FontAwesomeIcon icon={faGithubBrand} />
            </a>

            {currentUser ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;