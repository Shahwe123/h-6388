import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserCircle } from 'lucide-react';

interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
}

const Settings = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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

        setProfile(data);
        setUsername(data.username || '');
        setBio(data.bio || '');
        setEmail(session.user.email || '');
        setAvatarUrl(data.avatar_url);
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    try {
      setUpdating(true);
      
      // Only update fields that have changed
      const updates: any = {};
      if (username !== profile.username) updates.username = username;
      if (bio !== profile.bio) updates.bio = bio;
      
      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', profile.id);
          
        if (error) throw error;
        
        // Also update email in auth if it changed
        if (email !== profile.email) {
          const { error: authError } = await supabase.auth.updateUser({
            email,
          });
          
          if (authError) throw authError;
        }
        
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated',
        });
      }
      
      // Handle password change if provided
      if (password && confirmPassword) {
        if (password !== confirmPassword) {
          toast({
            title: 'Passwords do not match',
            description: 'Please ensure both passwords match',
            variant: 'destructive',
          });
          return;
        }
        
        const { error } = await supabase.auth.updateUser({
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: 'Password updated',
          description: 'Your password has been successfully changed',
        });
        
        setPassword('');
        setConfirmPassword('');
      }
      
      // Refresh profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single();
        
      if (error) throw error;
      
      setProfile(data);
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    try {
      setUploadingAvatar(true);
      
      // Get current user session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to upload an avatar');
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log('Uploading avatar:', filePath);
      
      // Upload avatar to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      console.log('Avatar uploaded, public URL:', publicUrlData.publicUrl);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', session.user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setAvatarUrl(publicUrlData.publicUrl);
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated',
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: 'Error uploading avatar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading settings...</p>
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
      <div className="container-padding mx-auto max-w-3xl">
        <div className="glass-card rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-black/50 rounded-full border-2 border-neon-purple flex items-center justify-center overflow-hidden mb-4">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={profile.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-24 h-24 text-neutral-400" />
                )}
              </div>
              
              <label className="cyber-button cursor-pointer text-sm px-4 py-2 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
                {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
              </label>
            </div>
            
            {/* Settings Form */}
            <form onSubmit={handleUpdateProfile} className="flex-1 space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/70 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/70 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-neutral-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-black/70 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple resize-none"
                />
              </div>
              
              <div className="pt-4 border-t border-neutral-700">
                <h2 className="text-lg font-medium mb-4">Change Password</h2>
                
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/70 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/70 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="cyber-button w-full flex items-center justify-center"
                >
                  {updating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
