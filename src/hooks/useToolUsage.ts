import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getStoredToolUsage,
  incrementToolUsage,
  getToolSlugFromPath,
  getTotalToolUsage,
  TOOL_USAGE_EVENT,
} from '../lib/toolUsage';

/**
 * Subscribe to tool usage statistics stored in localStorage
 */
export function useToolUsage(toolId?: string) {
  const [usageMap, setUsageMap] = useState<Record<string, number>>(() =>
    getStoredToolUsage()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setUsageMap(getStoredToolUsage());
    };

    window.addEventListener(TOOL_USAGE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(TOOL_USAGE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const recordUsage = useCallback(
    (targetToolId?: string) => {
      const id = targetToolId || toolId;
      if (!id) return 0;
      return incrementToolUsage(id, { minIntervalMs: 800 });
    },
    [toolId]
  );

  const count = toolId ? usageMap[toolId] || 0 : 0;
  const totalUsage = getTotalToolUsage(usageMap);

  return {
    usageMap,
    count,
    totalUsage,
    recordUsage,
  };
}

/**
 * Automatically tracks tool page visits when navigating between tools.
 * Deduplicates React StrictMode double-effects and language switches on the same tool.
 */
export function useRouteToolUsageTracker() {
  const location = useLocation();
  const lastTrackedRef = useRef<{ toolId: string | null }>({ toolId: null });

  useEffect(() => {
    const toolId = getToolSlugFromPath(location.pathname);

    if (toolId) {
      if (lastTrackedRef.current.toolId !== toolId) {
        lastTrackedRef.current.toolId = toolId;
        incrementToolUsage(toolId, { minIntervalMs: 400 });
      }
    } else {
      lastTrackedRef.current.toolId = null;
    }
  }, [location.pathname]);
}

/**
 * Tracks active tool usage when a user modifies input in a live tool page.
 * Never triggers on initial mount or empty input.
 */
export function useActiveToolUsage(toolId: string, activeValue: unknown) {
  const initialSerializedRef = useRef<string | null>(null);
  const lastRecordedAtRef = useRef<number>(0);

  useEffect(() => {
    const serialized =
      typeof activeValue === 'string'
        ? activeValue.trim()
        : JSON.stringify(activeValue);

    if (initialSerializedRef.current === null) {
      initialSerializedRef.current = serialized;
      return;
    }

    if (!serialized || serialized === '""' || serialized === '{}' || serialized === '[]') {
      return;
    }

    if (serialized === initialSerializedRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      const now = Date.now();
      if (now - lastRecordedAtRef.current >= 8000) {
        lastRecordedAtRef.current = now;
        incrementToolUsage(toolId, { minIntervalMs: 800 });
      }
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [toolId, activeValue]);
}
