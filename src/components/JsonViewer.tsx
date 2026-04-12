import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  name?: string;
  isLast?: boolean;
  key?: string | number;
}

export function JsonViewer({ data, name, isLast = true }: JsonViewerProps) {
  const [expanded, setExpanded] = useState(true);

  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);

  if (!isObject) {
    let valueColor = 'text-blue-600'; // string
    if (typeof data === 'number') valueColor = 'text-green-600';
    else if (typeof data === 'boolean') valueColor = 'text-purple-600';
    else if (data === null) valueColor = 'text-gray-500 dark:text-gray-400';

    return (
      <div className="font-mono text-sm pl-4 leading-6">
        {name && <span className="text-gray-700 dark:text-gray-300">"{name}": </span>}
        <span className={valueColor}>
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
        {!isLast && <span className="text-gray-500 dark:text-gray-400">,</span>}
      </div>
    );
  }

  const keys = Object.keys(data);
  const isEmpty = keys.length === 0;
  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';

  return (
    <div className="font-mono text-sm leading-6">
      <div 
        className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 rounded px-1 -ml-1 w-max select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {!isEmpty && (
          expanded ? <ChevronDown className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" /> : <ChevronRight className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
        )}
        {isEmpty && <span className="w-4" />}
        {name && <span className="text-gray-700 dark:text-gray-300">"{name}": </span>}
        <span className="text-gray-500 dark:text-gray-400">{openBracket}</span>
        {!expanded && !isEmpty && <span className="text-gray-400 mx-1">...</span>}
        {!expanded && !isEmpty && <span className="text-gray-500 dark:text-gray-400">{closeBracket}{!isLast ? ',' : ''}</span>}
        {!expanded && isArray && <span className="text-gray-400 text-xs ml-2">{keys.length} items</span>}
      </div>
      
      {expanded && !isEmpty && (
        <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-1.5">
          {keys.map((key, index) => (
            <JsonViewer 
              key={key} 
              data={data[key as keyof typeof data]} 
              name={isArray ? undefined : key} 
              isLast={index === keys.length - 1} 
            />
          ))}
        </div>
      )}
      
      {expanded && (
        <div className="pl-1">
          <span className="text-gray-500 dark:text-gray-400">{closeBracket}</span>
          {!isLast && <span className="text-gray-500 dark:text-gray-400">,</span>}
        </div>
      )}
    </div>
  );
}
