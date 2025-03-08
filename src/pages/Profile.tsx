
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchProfile } from '@/store/slices/profileSlice';
import { fetchUserGames } from '@/store/slices/gamesSlice';
import { fetchUserAchievements } from '@/store/slices/achievementsSlice';
import { fetchFriends } from '@/store/slices/friendsSlice';
import AuthRequired from '@/components/AuthRequired';

const ProfileStats = ({ label, value }: { label: string; value: number | string }) => (
  <div className="glass-card p-4 text-center">
    <p className="text-sm text-neutral-400">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { profile, isLoading: profileLoading } = useAppSelector(state => state.profile);
  const { userAchievements } = useAppSelector(state => state.achievements);
  const { userGames } = useAppSelector(state => state.games);
  const { friends } = useAppSelector(state => state.friends);

  useEffect(() => {
    if (user) {
      dispatch(fetchProfile(user.id));
      dispatch(fetchUserGames(user.id));
      dispatch(fetchUserAchievements(user.id));
      dispatch(fetchFriends(user.id));
    }
  }, [user, dispatch]);

  if (profileLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AuthRequired>
      <div className="min-h-screen">
        {/* Cover Photo */}
        <div 
          className="h-48 bg-black rounded-b-2xl bg-opacity-40 relative"
          style={{ backgroundImage: "linear-gradient(to right, #4c1d95, #7e22ce)" }}
        >
          {/* Avatar - positioned at the bottom of the cover photo */}
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full bg-black border-4 border-black overflow-hidden">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url}
                  alt={profile.display_name || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neon-purple/30 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {profile.display_name ? profile.display_name[0].toUpperCase() : '?'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="container-padding mt-20 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{profile.display_name || 'User'}</h1>
            <p className="text-neon-purple">@{profile.username || 'username'}</p>
            {profile.bio && <p className="mt-2 text-neutral-300">{profile.bio}</p>}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <ProfileStats label="Total Achievements" value={userAchievements.length} />
            <ProfileStats label="Total Games" value={userGames.length} />
            <ProfileStats label="Hours Played" value="0" />
            <ProfileStats label="Overall Score" value={profile.total_points || 0} />
          </div>

          {/* Achievements Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Recent Achievements</h2>
            {userAchievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userAchievements.slice(0, 6).map(userAchievement => (
                  <div key={userAchievement.id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neon-purple/30 rounded-lg flex items-center justify-center">
                        {userAchievement.achievement.image_url ? (
                          <img 
                            src={userAchievement.achievement.image_url} 
                            alt={userAchievement.achievement.title}
                            className="w-10 h-10 object-cover"
                          />
                        ) : (
                          <span className="text-xl">🏆</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{userAchievement.achievement.title}</h3>
                        <p className="text-sm text-neutral-400">
                          {new Date(userAchievement.unlocked_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p>No achievements unlocked yet</p>
              </div>
            )}
          </section>

          {/* Games Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Games Library</h2>
            {userGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userGames.slice(0, 6).map(userGame => (
                  <div key={userGame.id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neon-purple/30 rounded-lg flex items-center justify-center">
                        {userGame.game.image_url ? (
                          <img 
                            src={userGame.game.image_url} 
                            alt={userGame.game.title}
                            className="w-10 h-10 object-cover"
                          />
                        ) : (
                          <span className="text-xl">🎮</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{userGame.game.title}</h3>
                        <p className="text-sm text-neutral-400">
                          {userGame.completion_percentage}% complete
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p>No games added yet</p>
              </div>
            )}
          </section>

          {/* Friends Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Friends</h2>
            {friends.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.slice(0, 6).map(friendship => (
                  <div key={friendship.id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-neon-purple/30 flex items-center justify-center overflow-hidden">
                        {friendship.friend.avatar_url ? (
                          <img 
                            src={friendship.friend.avatar_url} 
                            alt={friendship.friend.display_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold">
                            {friendship.friend.display_name?.[0]?.toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{friendship.friend.display_name}</h3>
                        <p className="text-sm text-neutral-400">
                          @{friendship.friend.username}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p>No friends added yet</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </AuthRequired>
  );
};

export default Profile;
