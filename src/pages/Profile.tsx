
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, UserCircle, BarChart3, Clock, Users, Gamepad, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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

        // Use type assertion to ensure data is treated as Profile type
        setProfile(data as Profile);
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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-300 mb-4">Profile not found. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-primary">
      <div className="container-padding mx-auto max-w-6xl">
        {/* Profile Header */}
        <div className="glass-card rounded-xl p-8 mb-8 relative overflow-hidden">
          <div className="h-40 absolute top-0 left-0 right-0">
            {profile?.cover_url ? (
              <img 
                src={profile.cover_url} 
                alt="Profile cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-40 bg-gradient-game"></div>
            )}
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6 mt-20">
            <div className="w-24 h-24 bg-black/50 rounded-full border-4 border-neon-purple flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-20 h-20 text-neutral-400" />
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold neon-text">{profile?.username}</h1>
              <p className="text-neutral-300 mt-1">{profile?.bio || 'No bio yet'}</p>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <Trophy className="w-6 h-6 text-neon-pink mx-auto mb-2" />
              <div className="text-xl font-bold">0</div>
              <div className="text-sm text-neutral-400">Achievements</div>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <BarChart3 className="w-6 h-6 text-neon-blue mx-auto mb-2" />
              <div className="text-xl font-bold">0</div>
              <div className="text-sm text-neutral-400">Games</div>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <Clock className="w-6 h-6 text-neon-purple mx-auto mb-2" />
              <div className="text-xl font-bold">0h</div>
              <div className="text-sm text-neutral-400">Hours Played</div>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold">0</div>
              <div className="text-sm text-neutral-400">Friends</div>
            </div>
          </div>
        </div>
        
        {/* Recent Achievements */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
          <div className="text-neutral-400 text-center py-8">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No achievements yet</p>
            <p className="text-sm mt-1">Connect your gaming accounts to start tracking</p>
          </div>
        </div>
        
        {/* Games Collection */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Games Collection</h2>
          <div className="text-neutral-400 text-center py-8">
            <Gamepad className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No games in your collection</p>
            <p className="text-sm mt-1">Add games to start tracking your achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
