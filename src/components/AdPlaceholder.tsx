import React from 'react';
import { cn } from '../lib/utils';

interface AdPlaceholderProps {
  className?: string;
  format?: 'horizontal' | 'vertical' | 'square';
  label?: string;
}

export function AdPlaceholder({ className, format = 'horizontal', label = 'Advertisement' }: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 overflow-hidden relative',
        {
          'w-full h-24 md:h-32': format === 'horizontal',
          'w-full max-w-[300px] h-[600px]': format === 'vertical',
          'w-full max-w-[300px] h-[250px]': format === 'square',
        },
        className
      )}
    >
      <span className="text-xs uppercase tracking-widest font-semibold mb-1">{label}</span>
      <span className="text-[10px] text-center px-4">
        Google AdSense Slot<br/>
        (Replace with &lt;ins class="adsbygoogle"&gt;)
      </span>
    </div>
  );
}
