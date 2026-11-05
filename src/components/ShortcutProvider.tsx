import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { getToolSlugFromPath } from '../lib/toolUsage';
import { toggleToolFavorite } from '../lib/favorites';

export interface ShortcutItem {
  id: string;
  keys: string[];
  altKeys?: string[];
  descriptionKey: string;
  defaultDescription: string;
  category: 'global' | 'search';
}

interface ShortcutContextValue {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  isHelpOpen: boolean;
  setIsHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openHelp: () => void;
  closeHelp: () => void;
  toggleHelp: () => void;
  isMac: boolean;
  modKey: string;
  shortcuts: ShortcutItem[];
}

const ShortcutContext = createContext<ShortcutContextValue | undefined>(undefined);

function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tagName = target.tagName;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }
  if (target.isContentEditable) {
    return true;
  }
  return Boolean(target.closest('[contenteditable="true"]'));
}

export function ShortcutProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const isApple = /(Mac|iPhone|iPod|iPad)/i.test(
        navigator.userAgent || navigator.platform
      );
      setIsMac(isApple);
    }
  }, []);

  const modKey = isMac ? '⌘' : 'Ctrl';

  const openSearch = useCallback(() => {
    setIsHelpOpen(false);
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsHelpOpen(false);
    setIsSearchOpen((prev) => !prev);
  }, []);

  const openHelp = useCallback(() => {
    setIsSearchOpen(false);
    setIsHelpOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  const toggleHelp = useCallback(() => {
    setIsSearchOpen(false);
    setIsHelpOpen((prev) => !prev);
  }, []);

  const getHomePath = useCallback(() => {
    const rawSegments = location.pathname.split('/').filter(Boolean);
    if (
      rawSegments.length > 0 &&
      ['ko', 'ja'].includes(rawSegments[0])
    ) {
      return `/${rawSegments[0]}`;
    }
    return '/';
  }, [location.pathname]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const hasPrimaryMod = e.metaKey || e.ctrlKey;
      const keyLower = e.key.toLowerCase();
      const editable = isEditableElement(e.target);

      // 1. Cmd/Ctrl + K -> Trigger Global Tool Search from anywhere
      if (hasPrimaryMod && !e.altKey && keyLower === 'k') {
        e.preventDefault();
        e.stopPropagation();
        toggleSearch();
        return;
      }

      // 2. Cmd/Ctrl + Shift + / -> Toggle Keyboard Shortcuts Help
      if (hasPrimaryMod && e.shiftKey && (e.key === '?' || e.key === '/')) {
        e.preventDefault();
        e.stopPropagation();
        toggleHelp();
        return;
      }

      // 3. Alt + D -> Toggle Dark / Light Theme
      if (e.altKey && !hasPrimaryMod && (keyLower === 'd' || e.code === 'KeyD')) {
        e.preventDefault();
        setTheme(theme === 'dark' ? 'light' : 'dark');
        return;
      }

      // 4. Alt + H -> Navigate to Home Dashboard
      if (e.altKey && !hasPrimaryMod && (keyLower === 'h' || e.code === 'KeyH')) {
        e.preventDefault();
        setIsSearchOpen(false);
        setIsHelpOpen(false);
        navigate(getHomePath());
        return;
      }

      // 5. Alt + P -> Pin / Unpin current tool page
      if (e.altKey && !hasPrimaryMod && (keyLower === 'p' || e.code === 'KeyP')) {
        const currentToolId = getToolSlugFromPath(location.pathname);
        if (currentToolId) {
          e.preventDefault();
          toggleToolFavorite(currentToolId);
        }
        return;
      }

      // 6. Escape -> Close active modal
      if (e.key === 'Escape') {
        if (isHelpOpen) {
          e.preventDefault();
          setIsHelpOpen(false);
          return;
        }
        if (isSearchOpen) {
          e.preventDefault();
          setIsSearchOpen(false);
          return;
        }
      }

      // Non-modifier shortcuts (only when outside editable fields)
      if (!editable && !hasPrimaryMod && !e.altKey) {
        // '/' -> Open Global Tool Search
        if (e.key === '/' && !e.shiftKey && !isSearchOpen) {
          e.preventDefault();
          openSearch();
          return;
        }

        // '?' -> Toggle Keyboard Shortcuts Help
        if (e.key === '?') {
          e.preventDefault();
          toggleHelp();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    return () =>
      window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
  }, [
    isSearchOpen,
    isHelpOpen,
    theme,
    setTheme,
    location.pathname,
    navigate,
    getHomePath,
    openSearch,
    toggleSearch,
    toggleHelp,
  ]);

  // Custom event listeners for imperative triggers
  useEffect(() => {
    const onOpenSearch = () => openSearch();
    const onCloseSearch = () => closeSearch();
    const onOpenShortcuts = () => openHelp();

    window.addEventListener('devtoolz:open-search', onOpenSearch);
    window.addEventListener('devtoolz:close-search', onCloseSearch);
    window.addEventListener('devtoolz:open-shortcuts', onOpenShortcuts);

    return () => {
      window.removeEventListener('devtoolz:open-search', onOpenSearch);
      window.removeEventListener('devtoolz:close-search', onCloseSearch);
      window.removeEventListener('devtoolz:open-shortcuts', onOpenShortcuts);
    };
  }, [openSearch, closeSearch, openHelp]);

  const shortcuts: ShortcutItem[] = useMemo(
    () => [
      {
        id: 'global-search',
        keys: [modKey, 'K'],
        altKeys: ['/'],
        descriptionKey: 'shortcuts.openSearch',
        defaultDescription: 'Open global tool search',
        category: 'global',
      },
      {
        id: 'go-home',
        keys: ['Alt', 'H'],
        descriptionKey: 'shortcuts.goHome',
        defaultDescription: 'Go to Home dashboard',
        category: 'global',
      },
      {
        id: 'pin-tool',
        keys: ['Alt', 'P'],
        descriptionKey: 'shortcuts.togglePin',
        defaultDescription: 'Pin or unpin current tool',
        category: 'global',
      },
      {
        id: 'toggle-theme',
        keys: ['Alt', 'D'],
        descriptionKey: 'shortcuts.toggleTheme',
        defaultDescription: 'Toggle dark / light mode',
        category: 'global',
      },
      {
        id: 'help-modal',
        keys: ['?'],
        descriptionKey: 'shortcuts.toggleHelp',
        defaultDescription: 'Show or hide keyboard shortcuts',
        category: 'global',
      },
      {
        id: 'search-nav',
        keys: ['↑', '↓'],
        descriptionKey: 'shortcuts.searchNavigate',
        defaultDescription: 'Move selection up / down',
        category: 'search',
      },
      {
        id: 'search-select',
        keys: ['Enter'],
        descriptionKey: 'shortcuts.searchSelect',
        defaultDescription: 'Open selected tool',
        category: 'search',
      },
      {
        id: 'search-category',
        keys: ['Tab'],
        descriptionKey: 'shortcuts.searchCategoryTab',
        defaultDescription: 'Cycle category filter',
        category: 'search',
      },
      {
        id: 'close-modal',
        keys: ['Esc'],
        descriptionKey: 'shortcuts.closeModal',
        defaultDescription: 'Close active dialog',
        category: 'search',
      },
    ],
    [modKey]
  );

  const value: ShortcutContextValue = {
    isSearchOpen,
    setIsSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
    isHelpOpen,
    setIsHelpOpen,
    openHelp,
    closeHelp,
    toggleHelp,
    isMac,
    modKey,
    shortcuts,
  };

  return (
    <ShortcutContext.Provider value={value}>{children}</ShortcutContext.Provider>
  );
}

export function useShortcuts() {
  const context = useContext(ShortcutContext);
  if (!context) {
    throw new Error('useShortcuts must be used within a ShortcutProvider');
  }
  return context;
}
