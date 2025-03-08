
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Gamepad, User, X } from 'lucide-react';

// Platform-specific icons
const SteamIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.979 0C5.678 0 0.511 4.86 0.022 11.037l6.432 2.658c0.545-0.371 1.203-0.59 1.912-0.59 0.063 0 0.125 0.004 0.188 0.008l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-0.105l-4.076 2.911c0 0.052 0.004 0.105 0.004 0.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L0.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-0.61c0.262 0.543 0.714 0.999 1.314 1.25 1.297 0.539 2.793-0.076 3.332-1.375 0.263-0.63 0.264-1.319 0.005-1.949s-0.75-1.121-1.377-1.383c-0.624-0.26-1.29-0.249-1.878-0.03l1.523 0.63c0.956 0.4 1.409 1.5 1.009 2.455-0.397 0.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-0.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
  </svg>
);

const XboxIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.382 0 0 5.382 0 12s5.382 12 12 12 12-5.382 12-12S18.618 0 12 0zm0 2c2.826 0 5.348 1.304 7 3.33l.031.03c.04.06.081.12.12.18l-5.951 5.95a3.277 3.277 0 01-2.38.91c-.868 0-1.736-.3-2.43-.9l-5.95-5.95a9.991 9.991 0 017.56-3.55zm-8.45 4.97L8.6 12l-5.05 5.03A9.971 9.971 0 012 12c0-1.89.523-3.661 1.43-5.174l.12.143zm16.9.03c.907 1.514 1.43 3.284 1.43 5.174 0 1.766-.454 3.428-1.25 4.882L15.4 12l5.05-5z"/>
  </svg>
);

const PlayStationIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.5 4.27c-.6.24-1.38.51-2.38.9C4.4 6.16 3 6.78 3 8.75v9.34c0 .86.64 1.3 1.37 1.17 2.14-.38 2.9-1.55 2.9-3.1V7.58c0-.38.21-.56.5-.47.29.09.45.31.45.7v12.7l2.26-.75V4.43s-.81-.4-1-.16zm5.3 1.61c-1.35.52-1.95 1.08-1.95 2.3v9.46c0 1.34.85 1.87 1.87 1.65.92-.2 1.49-.71 1.49-1.75V6.41l2.3-.77V4.71c-.01 0-2.38.66-3.71 1.17zm-.22 10.57c-.65 0-1.14-.29-1.14-.89 0-.59.5-1.09 1.14-1.09.65 0 1.09.5 1.09 1.09.01.6-.44.89-1.09.89z"/>
  </svg>
);

interface PlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
  platformIcon: React.ReactNode;
  inputLabel: string;
  inputPlaceholder: string;
  onSubmit: (value: string) => void;
  guideText: string;
}

const PlatformModal = ({ 
  isOpen, 
  onClose, 
  platformName, 
  platformIcon, 
  inputLabel, 
  inputPlaceholder, 
  onSubmit,
  guideText 
}: PlatformModalProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-primary border border-neon-purple/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {platformIcon}
            <span>Link {platformName} Account</span>
          </DialogTitle>
          <DialogDescription className="text-neutral-300">
            Enter your {platformName} information to link your account
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform-input">{inputLabel}</Label>
            <Input 
              id="platform-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              className="bg-black/70 border-neutral-700 text-white"
            />
          </div>
          
          <div className="bg-black/30 p-3 rounded-md border border-neon-purple/10">
            <h4 className="text-sm font-medium mb-2 text-neon-blue">How to find your {platformName} information:</h4>
            <p className="text-xs text-neutral-300">{guideText}</p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              className="border-neutral-700 hover:bg-black/50 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-game"
              disabled={!inputValue.trim()}
            >
              Link Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PlatformCard = ({ 
  platformName, 
  icon, 
  description, 
  isLinked, 
  username, 
  onLink, 
  onUnlink 
}: { 
  platformName: string; 
  icon: React.ReactNode; 
  description: string; 
  isLinked: boolean; 
  username?: string | null; 
  onLink: () => void; 
  onUnlink: () => void;
}) => {
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

const LinkAccounts = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch user profile on component mount
  useState(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (error: any) {
        toast({
          title: 'Error fetching profile',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleOpenModal = (platform: string) => {
    setCurrentPlatform(platform);
  };

  const handleCloseModal = () => {
    setCurrentPlatform(null);
  };

  const handleLinkAccount = async (value: string) => {
    if (!profile) return;
    
    try {
      const updates: any = {};
      
      switch (currentPlatform) {
        case 'Steam':
          updates.steam_id = value;
          break;
        case 'Xbox':
          updates.xbox_gamertag = value;
          break;
        case 'PlayStation':
          updates.playstation_username = value;
          break;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);
        
      if (error) throw error;
      
      // Update local state
      setProfile({ ...profile, ...updates });
      
      toast({
        title: 'Account linked',
        description: `Your ${currentPlatform} account has been successfully linked.`,
      });
      
      handleCloseModal();
    } catch (error: any) {
      toast({
        title: 'Error linking account',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUnlinkAccount = async (platform: string) => {
    if (!profile) return;
    
    try {
      const updates: any = {};
      
      switch (platform) {
        case 'Steam':
          updates.steam_id = null;
          break;
        case 'Xbox':
          updates.xbox_gamertag = null;
          break;
        case 'PlayStation':
          updates.playstation_username = null;
          break;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);
        
      if (error) throw error;
      
      // Update local state
      setProfile({ ...profile, ...updates });
      
      toast({
        title: 'Account unlinked',
        description: `Your ${platform} account has been unlinked.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error unlinking account',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading account information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-primary">
      <div className="container-padding mx-auto max-w-3xl">
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad className="h-6 w-6 text-neon-pink" />
            <h1 className="text-2xl font-bold">Link Gaming Accounts</h1>
          </div>
          
          <p className="text-neutral-300 mb-8">
            Connect your gaming platform accounts to track achievements, stats, and more in one place.
          </p>
          
          <div className="space-y-4">
            <PlatformCard
              platformName="Steam"
              icon={<SteamIcon />}
              description="Link your Steam account to track your Steam games and achievements"
              isLinked={!!profile?.steam_id}
              username={profile?.steam_id}
              onLink={() => handleOpenModal('Steam')}
              onUnlink={() => handleUnlinkAccount('Steam')}
            />
            
            <PlatformCard
              platformName="Xbox"
              icon={<XboxIcon />}
              description="Link your Xbox account to track your Xbox games and achievements"
              isLinked={!!profile?.xbox_gamertag}
              username={profile?.xbox_gamertag}
              onLink={() => handleOpenModal('Xbox')}
              onUnlink={() => handleUnlinkAccount('Xbox')}
            />
            
            <PlatformCard
              platformName="PlayStation"
              icon={<PlayStationIcon />}
              description="Link your PlayStation account to track your PlayStation games and achievements"
              isLinked={!!profile?.playstation_username}
              username={profile?.playstation_username}
              onLink={() => handleOpenModal('PlayStation')}
              onUnlink={() => handleUnlinkAccount('PlayStation')}
            />
          </div>
        </div>
      </div>
      
      {/* Platform Linking Modals */}
      <PlatformModal
        isOpen={currentPlatform === 'Steam'}
        onClose={handleCloseModal}
        platformName="Steam"
        platformIcon={<SteamIcon />}
        inputLabel="Steam ID"
        inputPlaceholder="Enter your Steam ID (e.g., 76561198030841827)"
        onSubmit={handleLinkAccount}
        guideText="To find your Steam ID, open the Steam client, click on your profile name, then view profile. Your Steam ID is the number shown in the URL. You can also use third-party sites to convert your Steam vanity URL to a Steam ID."
      />
      
      <PlatformModal
        isOpen={currentPlatform === 'Xbox'}
        onClose={handleCloseModal}
        platformName="Xbox"
        platformIcon={<XboxIcon />}
        inputLabel="Xbox Gamertag"
        inputPlaceholder="Enter your Xbox Gamertag"
        onSubmit={handleLinkAccount}
        guideText="Your Xbox Gamertag is your username on Xbox Live. You can find it by signing into your Xbox console or the Xbox app on Windows and looking at your profile."
      />
      
      <PlatformModal
        isOpen={currentPlatform === 'PlayStation'}
        onClose={handleCloseModal}
        platformName="PlayStation"
        platformIcon={<PlayStationIcon />}
        inputLabel="PlayStation Username"
        inputPlaceholder="Enter your PlayStation Username (PSN ID)"
        onSubmit={handleLinkAccount}
        guideText="Your PlayStation Username (also called PSN ID) is what you use to sign in to PlayStation Network. You can find it by checking your profile on your PlayStation console or in the PlayStation app."
      />
    </div>
  );
};

export default LinkAccounts;
