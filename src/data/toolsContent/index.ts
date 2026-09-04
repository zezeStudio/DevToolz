import { ToolContentData } from './types';
import { dataTools } from './dataTools';
import { securityTools } from './securityTools';
import { utilityTools } from './utilityTools';
import { aiTools } from './aiTools';

export * from './types';
export { dataTools } from './dataTools';
export { securityTools } from './securityTools';
export { utilityTools } from './utilityTools';
export { aiTools } from './aiTools';

export const allToolsContent: ToolContentData[] = [
  ...dataTools,
  ...securityTools,
  ...utilityTools,
  ...aiTools,
];

export const toolsContentMap: Record<string, ToolContentData> = allToolsContent.reduce((acc, tool) => {
  acc[tool.id] = tool;
  return acc;
}, {} as Record<string, ToolContentData>);

export function getToolContent(id: string): ToolContentData | undefined {
  return toolsContentMap[id];
}
