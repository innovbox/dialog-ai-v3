import { useState, useCallback } from 'react';
import { Toast } from '../types';

/**
 * Hook personnalisé pour gérer les notifications toast
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    // Auto-remove après la durée spécifiée
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => 
    addToast(message, 'success', duration), [addToast]);

  const error = useCallback((message: string, duration?: number) => 
    addToast(message, 'error', duration), [addToast]);

  const info = useCallback((message: string, duration?: number) => 
    addToast(message, 'info', duration), [addToast]);

  const warning = useCallback((message: string, duration?: number) => 
    addToast(message, 'warning', duration), [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  };
};