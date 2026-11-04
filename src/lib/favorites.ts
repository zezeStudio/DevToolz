export const FAVORITES_STORAGE_KEY = 'devtoolz_favorite_tools';
export const FAVORITES_EVENT = 'devtoolz-favorites-updated';

/**
 * Retrieve favorite tool IDs from localStorage
 */
export function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading favorites from localStorage', e);
    return [];
  }
}

/**
 * Save favorite tool IDs to localStorage and dispatch custom update event
 */
export function saveStoredFavorites(favorites: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: favorites }));
  } catch (e) {
    console.error('Error writing favorites to localStorage', e);
  }
}

/**
 * Check if a tool is favorited
 */
export function isToolFavorite(toolId: string): boolean {
  return getStoredFavorites().includes(toolId);
}

/**
 * Toggle favorite state for a tool
 */
export function toggleToolFavorite(toolId: string): boolean {
  const current = getStoredFavorites();
  const exists = current.includes(toolId);
  const updated = exists ? current.filter(id => id !== toolId) : [...current, toolId];
  saveStoredFavorites(updated);
  return !exists;
}

/**
 * Explicitly remove a tool from favorites
 */
export function removeToolFavorite(toolId: string): void {
  const current = getStoredFavorites();
  saveStoredFavorites(current.filter(id => id !== toolId));
}

/**
 * Explicitly add a tool to favorites
 */
export function addToolFavorite(toolId: string): void {
  const current = getStoredFavorites();
  if (!current.includes(toolId)) {
    saveStoredFavorites([...current, toolId]);
  }
}
