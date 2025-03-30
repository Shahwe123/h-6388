
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Gamepad, Info } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure } from '../redux/slices/gamesSlice.js';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentSession, fetchUserProfile } from '@/helpers/authHelpers';
import { fetchPsnData, fetchSteamData, fetchXboxData } from '@/helpers/platformHelpers';
import ProcessingIndicator from '@/components/platforms/ProcessingIndicator';
import PlatformCard from '@/components/platforms/PlatformCard';
import PlatformModal from '@/components/platforms/PlatformModal';
import { SteamIcon, XboxIcon, PlayStationIcon } from '@/components/platforms/PlatformIcons';
import SEO from "../components/SEO";
import { Button } from '@/components/ui/button';

interface RootState {
  games: {
    games: any[]; // Replace with more specific type if available
    achievements: Record<string, any>;
    loading: boolean;
    error: null | string;
  };
  // Add other state slices as needed
}

const LinkAccounts = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null);
  const [processingData, setProcessingData] = useState<boolean>(false);
  const [processingPlatform, setProcessingPlatform] = useState<string | null>(null);
  const [platformHelpOpen, setPlatformHelpOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const games = useSelector((state: RootState) => state.games);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const session = await getCurrentSession();

        if (!session) {
          setLoading(false);
          return;
        }

        const profileData = await fetchUserProfile(session.user.id);
        if (profileData) {
          setProfile(profileData);
        }
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
          toast({
            title: 'Account linked',
            description: `Your ${currentPlatform} account has been successfully linked. We'll now fetch your game data.`,
          });
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

      setProfile({ ...profile, ...updates });
      handleCloseModal();

      if (currentPlatform === 'Steam') {
        try {
          setProcessingData(true);
          setProcessingPlatform('Steam');

          await fetchSteamData(
            updates.steam_id,
            profile.id,
            dispatch,
            () => {
              toast({
                title: 'Steam Account Linked',
                description: 'Your Steam data has been successfully processed.',
              });
            },
            (error) => {
              toast({
                title: 'Error Processing Steam Data',
                description: error.message || 'Failed to process Steam data',
                variant: 'destructive',
              });
            }
          );
        } finally {
          setProcessingData(false);
          setProcessingPlatform(null);
        }
      } else if (currentPlatform === 'Xbox') {
        try {
          setProcessingData(true);
          setProcessingPlatform('Xbox');
          
          await fetchXboxData(updates.xbox_gamertag);
          
          toast({
            title: 'Xbox Account Linked',
            description: 'Your Xbox data has been successfully processed.',
          });
        } catch (error: any) {
          toast({
            title: 'Error fetching Xbox data',
            description: error.message,
            variant: 'destructive',
          });
        } finally {
          setProcessingData(false);
          setProcessingPlatform(null);
        }
      } else if (currentPlatform === "PlayStation") {
          // await fetchPsnData()
          try {
            setProcessingData(true);
            setProcessingPlatform('PlayStation');

            await fetchPsnData(
              "me",
              profile.id,
              dispatch,
              () => {
                toast({
                  title: 'PlayStation Account Linked',
                  description: 'Your PlayStation data has been successfully processed.',
                });
              },
              (error) => {
                toast({
                  title: 'Error Processing PlayStation Data',
                  description: error.message || 'Failed to process PlayStation data',
                  variant: 'destructive',
                });
              }
            );
          } finally {
            setProcessingData(false);
            setProcessingPlatform(null);
          }
      }
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
          updates.steam_games = [];
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

      if (platform === 'Steam') {
        console.log('Removed Steam games from profile');
      }

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
      <SEO
        title="Link Your Gaming Accounts"
        description="Connect your PlayStation, Xbox, and Steam accounts to track achievements seamlessly."
      />
      <div className="container-padding mx-auto max-w-3xl">
        <div className="glass-card rounded-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad className="h-6 w-6 text-neon-pink" />
            <h1 className="text-2xl font-bold">Link Gaming Accounts</h1>
          </div>

          <p className="text-neutral-300 mb-8">
            Connect your gaming platform accounts to track achievements, stats, and more in one place.
          </p>

          {processingData && (
            <ProcessingIndicator platformName={processingPlatform} />
          )}

          <div className="bg-black/30 rounded-lg p-4 mb-6 border border-neon-blue/30">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-neon-blue mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Finding Your Steam ID</h3>
                <p className="text-sm text-neutral-400 mb-2">
                  Your Steam ID is a unique identifier for your Steam account. There are a few ways to find it:
                </p>
                <ol className="text-sm text-neutral-400 space-y-2 list-decimal pl-5">
                  <li>Open your Steam profile in a web browser. Your Steam ID is the long number in the URL (e.g., <span className="text-neon-blue">76561198030841827</span>)</li>
                  <li>In the Steam client, click your profile name → View Profile → The ID is in the URL</li>
                  <li>You can also use 3rd party sites like <a href="https://steamid.io" target="_blank" rel="noopener noreferrer" className="text-neon-blue underline">steamid.io</a> to convert your Steam username to an ID</li>
                </ol>
              </div>
            </div>
          </div>

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

