
import { UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Profile } from '@/pages/Profile';
import RankBadge from '@/components/profile/RankBadge';
import LevelProgress from '@/components/profile/LevelProgress';
import SocialShare from '@/components/profile/SocialShare';

/**
 * Props interface for the ProfileHeader component
 * @property {Profile} profile - The user profile data
 * @property {Object} playerStats - Stats for the player including level, XP, and rank
 */
interface ProfileHeaderProps {
  profile: Profile;
  playerStats: {
    level: number;
    xp: number;
    nextLevelXp: number;
    rank: string;
  };
}

/**
 * ProfileHeader component displaying the user's profile information
 * 
 * This component shows:
 * - Profile picture and cover image
 * - Username and rank badge
 * - User bio
 * - Social sharing options
 * - Level progress bar
 * 
 * @param {ProfileHeaderProps} props - Component props
 * @returns {JSX.Element} The profile header UI
 */
const ProfileHeader = ({ profile, playerStats }: ProfileHeaderProps) => {
  return (
    <div className="glass-card rounded-xl p-8 mb-8 relative overflow-hidden">
      {/* Cover Image Background */}
      <div className="h-40 absolute top-0 left-0 right-0">
        {profile?.cover_url ? (
          <img src={profile.cover_url} alt="Profile cover" className="w-full h-full object-cover" />
        ) : (
          <div className="h-40 bg-gradient-game"></div>
        )}
      </div>

      <div className="relative mt-20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Avatar */}
          <motion.div
            className="w-24 h-24 bg-black/50 rounded-full border-4 border-neon-purple flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)' }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-24 h-24 text-neutral-400" />
            )}
          </motion.div>

          {/* Username, Rank and Bio */}
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center flex-wrap justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold neon-text">{profile?.username}</h1>
              <RankBadge rank={playerStats.rank} />
            </div>
            <p className="text-neutral-300">{profile?.bio || 'No bio yet'}</p>
          </div>

          {/* Social Share Button */}
          <SocialShare username={profile.username} />
        </div>

        {/* Level Progress Bar */}
        <div className="mt-6">
          <LevelProgress
            level={playerStats.level}
            xp={playerStats.xp}
            nextLevelXp={playerStats.nextLevelXp}
            rank={playerStats.rank}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
