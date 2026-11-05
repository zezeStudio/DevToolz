import React, { useEffect } from 'react';
import { Keyboard, X, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useShortcuts } from './ShortcutProvider';

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.6rem] h-6 px-1.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded shadow-[0_1px_0_rgba(15,23,42,0.08)] dark:shadow-none">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsModal() {
  const { t } = useTranslation();
  const { isHelpOpen, closeHelp, openSearch, shortcuts, modKey } = useShortcuts();

  useEffect(() => {
    if (!isHelpOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHelpOpen]);

  if (!isHelpOpen) return null;

  const globalShortcuts = shortcuts.filter((s) => s.category === 'global');
  const searchShortcuts = shortcuts.filter((s) => s.category === 'search');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={closeHelp}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Keyboard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="shortcuts-modal-title"
                className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100"
              >
                {t('shortcuts.title') || 'Keyboard Shortcuts'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('shortcuts.subtitle') ||
                  'Navigate and launch developer tools without leaving your keyboard'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeHelp}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={t('shortcuts.closeModal') || 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Global Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
              {t('shortcuts.group.global') || 'Global Navigation & Actions'}
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-b border-slate-100 dark:border-slate-800">
              {globalShortcuts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 gap-4"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t(item.descriptionKey) || item.defaultDescription}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.keys.map((k, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && (
                          <span className="text-xs text-slate-400">+</span>
                        )}
                        <KeyCap>{k}</KeyCap>
                      </React.Fragment>
                    ))}
                    {item.altKeys && (
                      <>
                        <span className="text-xs text-slate-400 mx-1">/</span>
                        {item.altKeys.map((ak, idx) => (
                          <KeyCap key={idx}>{ak}</KeyCap>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Modal Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
              {t('shortcuts.group.search') || 'Inside Command Search'}
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-b border-slate-100 dark:border-slate-800">
              {searchShortcuts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 gap-4"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t(item.descriptionKey) || item.defaultDescription}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.keys.map((k, idx) => (
                      <KeyCap key={idx}>{k}</KeyCap>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t('shortcuts.footerHint', { key: '?' }) ||
              'Press ? anywhere outside text inputs to toggle this guide'}
          </span>

          <button
            type="button"
            onClick={openSearch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t('shortcuts.openSearch') || 'Open Search'}</span>
            <span className="opacity-80 font-mono">({modKey}K)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
