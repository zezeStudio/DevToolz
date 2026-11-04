import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '../lib/utils';

interface FavoriteButtonProps {
  toolId: string;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
}

export function FavoriteButton({
  toolId,
  showLabel = false,
  className = '',
  size = 'md',
  variant = 'button',
}: FavoriteButtonProps) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(toolId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(toolId);
  };

  const label = favorited
    ? (t('tool.pinned') || 'Pinned to Home')
    : (t('tool.pinToHome') || 'Pin to Home');

  const tooltipText = favorited
    ? (t('tool.unpin') || 'Unpin from Home')
    : (t('tool.pinToHome') || 'Pin to Home');

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={tooltipText}
        aria-label={tooltipText}
        aria-pressed={favorited}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all duration-200 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
          size === 'sm' && "p-1.5",
          size === 'md' && "p-2",
          size === 'lg' && "p-2.5",
          favorited
            ? "text-amber-500 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-200/80 dark:border-amber-700/50 shadow-xs"
            : "text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700/60 dark:text-slate-400 border border-transparent",
          className
        )}
      >
        <Star
          className={cn(
            iconSizes[size],
            "transition-transform duration-200",
            favorited ? "fill-amber-400 text-amber-500 dark:fill-amber-400 dark:text-amber-400" : "hover:scale-110"
          )}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={tooltipText}
      aria-label={tooltipText}
      aria-pressed={favorited}
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 border shadow-xs select-none",
        size === 'sm' && "px-2.5 py-1 text-xs",
        size === 'md' && "px-3 py-1.5 text-xs sm:text-sm",
        size === 'lg' && "px-4 py-2 text-sm",
        favorited
          ? "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200"
          : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-600/60",
        className
      )}
    >
      <Star
        className={cn(
          iconSizes[size],
          "transition-all duration-200",
          favorited
            ? "fill-amber-400 text-amber-500 dark:fill-amber-400 dark:text-amber-400 scale-105"
            : "text-slate-400 dark:text-slate-400"
        )}
      />
      {showLabel && (
        <span className="font-semibold tracking-tight whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}
