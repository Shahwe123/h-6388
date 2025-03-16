
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Interface for ProcessingIndicator props
 */
interface ProcessingIndicatorProps {
  platformName: string | null;  // The name of the platform being processed
}

/**
 * ProcessingIndicator component
 * Displays a loading indicator with text while platform data is being processed
 * 
 * @param platformName - The name of the platform being processed
 */
const ProcessingIndicator = ({ platformName }: ProcessingIndicatorProps) => {
  // Don't render anything if there's no platform name
  if (!platformName) return null;
  
  return (
    <div className="bg-black/30 rounded-lg p-4 mb-6 border border-neon-purple/30">
      <div className="flex items-center">
        <Loader2 className="h-5 w-5 text-neon-blue animate-spin mr-3" />
        <div>
          <h3 className="font-medium">Processing {platformName} Data</h3>
          <p className="text-sm text-neutral-400">
            We're retrieving and processing your game data. This may take a moment, but you can continue using the app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingIndicator;
