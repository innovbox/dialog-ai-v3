import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    // Vérifier d'abord localStorage, puis les préférences système
    const saved = localStorage.getItem('dialog-ai-theme');
    if (saved) {
      return saved === 'dark';
    }
    // Fallback sur les préférences système
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Sauvegarder le thème
    localStorage.setItem('dialog-ai-theme', isDark ? 'dark' : 'light');
    
    // Appliquer le thème au document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Initialiser le thème au premier rendu
  useEffect(() => {
    const saved = localStorage.getItem('dialog-ai-theme');
    if (saved) {
      const shouldBeDark = saved === 'dark';
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      setIsDark(shouldBeDark);
    } else {
      // Si pas de préférence sauvée, utiliser les préférences système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
      setIsDark(prefersDark);
    }
  }, []);
  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
};