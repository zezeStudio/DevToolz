import { useState, useEffect, useCallback } from 'react';
import { 
  getStoredFavorites, 
  toggleToolFavorite, 
  removeToolFavorite, 
  addToolFavorite,
  FAVORITES_EVENT 
} from '../lib/favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => getStoredFavorites());

  useEffect(() => {
    const handleUpdate = () => {
      setFavorites(getStoredFavorites());
    };

    window.addEventListener(FAVORITES_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(FAVORITES_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const isFavorite = useCallback(
    (toolId: string) => favorites.includes(toolId),
    [favorites]
  );

  const toggleFavorite = useCallback((toolId: string) => {
    return toggleToolFavorite(toolId);
  }, []);

  const removeFavorite = useCallback((toolId: string) => {
    removeToolFavorite(toolId);
  }, []);

  const addFavorite = useCallback((toolId: string) => {
    addToolFavorite(toolId);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    addFavorite,
  };
}
