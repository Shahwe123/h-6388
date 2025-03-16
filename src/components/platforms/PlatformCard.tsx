
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, X } from 'lucide-react';

interface PlatformCardProps {
  platformName: string;
  icon: React.ReactNode;
  description: string;
  isLinked: boolean;
  username?: string | null;
  onLink: () => void;
  onUnlink: () => void;
}

const PlatformCard = ({
  platformName,
  icon,
  description,
  isLinked,
  username,
  onLink,
  onUnlink
}: PlatformCardProps) => {
  return (
    <div className="glass-card rounded-xl p-6 transition-all hover:shadow-lg hover:border-neon-purple/40">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-black/70 border border-neon-purple/30 flex items-center justify-center text-neon-purple">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold">{platformName}</h3>
            <p className="text-sm text-neutral-300">{description}</p>
          </div>
        </div>

        {isLinked ? (
          <Button
            onClick={onUnlink}
            size="sm"
            className="bg-black/50 hover:bg-red-950 text-white border border-red-900/30"
          >
            <X className="h-4 w-4 mr-1" /> Unlink
          </Button>
        ) : (
          <Button
            onClick={onLink}
            size="sm"
            className="bg-gradient-game"
          >
            Link Account
          </Button>
        )}
      </div>

      {isLinked && username && (
        <div className="mt-4 bg-black/40 rounded-md p-3 border border-neon-purple/10">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-neutral-400" />
            <span className="text-neutral-200">Connected as:</span>
            <span className="ml-2 font-medium text-white">{username}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformCard;
