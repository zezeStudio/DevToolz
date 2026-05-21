const fs = require('fs');
let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

// The input/output layout is
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[600px]">
const targetFlex = '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[600px]">';
const replacementFlex = `
        <div className="relative flex-1 min-h-[600px] flex flex-col">
          {isProcessing && (
            <div className="absolute inset-0 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{t('json.ProcessingData') || "Processing..."}</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 h-full">`;

content = content.replace(targetFlex, replacementFlex);
// Close the added div at the end of input/output area
// finding where the grid ends
const endGrid = `          </div>
        </div>
      </div>

      <div className="w-full xl:w-[400px] flex-shrink-0 space-y-6 xl:overflow-y-auto pb-6 custom-scrollbar pr-1">`;
      
const replacementEndGrid = `          </div>
        </div>
        </div>
      </div>

      <div className="w-full xl:w-[400px] flex-shrink-0 space-y-6 xl:overflow-y-auto pb-6 custom-scrollbar px-1">`;

content = content.replace(endGrid, replacementEndGrid);
fs.writeFileSync('src/pages/JsonFormatter.tsx', content);
