export const TOOL_USAGE_STORAGE_KEY = 'devtoolz_tool_usage';
export const TOOL_USAGE_EVENT = 'devtoolz-tool-usage-updated';

export const VALID_TOOL_IDS = new Set<string>([
  'json-formatter',
  'password-generator',
  'text-analyzer',
  'base64-converter',
  'url-encoder',
  'jwt-decoder',
  'color-converter',
  'markdown-editor',
  'uuid-generator',
  'hash-generator',
  'unix-timestamp',
  'qr-code',
  'regex-tester',
  'diff-checker',
  'image-compressor',
  'json-to-ts',
  'json-schema-generator',
  'function-calling-builder',
  'token-counter',
  'llm-optimizer',
  'prompt-wrapper',
  'chunking-simulator',
  'system-prompt',
  'prompt-variable-injector',
  'prompt-token-splitter',
  'llm-parameter-playground',
  'xml-guardrail-generator',
  'few-shot-builder',
]);

const lastIncrementByTool: Record<string, number> = {};

/**
 * Extract canonical tool ID from a router pathname (e.g. "/ko/json-formatter" -> "json-formatter")
 */
export function getToolSlugFromPath(pathname: string): string | null {
  const rawSegments = pathname.split('/').filter(Boolean);
  const segments =
    rawSegments.length > 0 && ['en', 'ko', 'ja'].includes(rawSegments[0])
      ? rawSegments.slice(1)
      : rawSegments;

  if (segments.length === 0) return null;
  const candidate = segments[0];
  return VALID_TOOL_IDS.has(candidate) ? candidate : null;
}

/**
 * Read all tool usage counts from localStorage
 */
export function getStoredToolUsage(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(TOOL_USAGE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    const sanitized: Record<string, number> = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
        sanitized[key] = Math.floor(val);
      }
    }
    return sanitized;
  } catch (e) {
    console.error('Error reading tool usage from localStorage', e);
    return {};
  }
}

/**
 * Persist tool usage counts to localStorage and notify subscribers
 */
export function saveStoredToolUsage(usage: Record<string, number>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOOL_USAGE_STORAGE_KEY, JSON.stringify(usage));
    window.dispatchEvent(new CustomEvent(TOOL_USAGE_EVENT, { detail: usage }));
  } catch (e) {
    console.error('Error saving tool usage to localStorage', e);
  }
}

/**
 * Get usage count for a specific tool
 */
export function getToolUsageCount(toolId: string): number {
  const usage = getStoredToolUsage();
  return usage[toolId] || 0;
}

/**
 * Increment usage count for a specific tool
 */
export function incrementToolUsage(
  toolId: string,
  options?: { minIntervalMs?: number }
): number {
  if (!VALID_TOOL_IDS.has(toolId)) return 0;

  const now = Date.now();
  const minInterval = options?.minIntervalMs ?? 0;
  if (minInterval > 0) {
    const prev = lastIncrementByTool[toolId] || 0;
    if (now - prev < minInterval) {
      return getToolUsageCount(toolId);
    }
  }
  lastIncrementByTool[toolId] = now;

  const current = getStoredToolUsage();
  const nextCount = (current[toolId] || 0) + 1;
  const updated = {
    ...current,
    [toolId]: nextCount,
  };
  saveStoredToolUsage(updated);
  return nextCount;
}

/**
 * Compute total tool uses across all tools
 */
export function getTotalToolUsage(usageMap?: Record<string, number>): number {
  const map = usageMap || getStoredToolUsage();
  return Object.values(map).reduce((sum, count) => sum + (count || 0), 0);
}
