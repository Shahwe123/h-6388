
import { Link as RouterLink } from 'react-router-dom';
import { Link, Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile';

interface LinkedAccountsProps {
  profile: Profile;
  isOwnProfile: boolean;
  hasLinkedAccounts: boolean;
}

const LinkedAccounts = ({ profile, isOwnProfile, hasLinkedAccounts }: LinkedAccountsProps) => {
  // Only show linked accounts section if it's the user's own profile or if the other user has linked accounts
  if (!isOwnProfile && !hasLinkedAccounts) return null;

  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Linked Gaming Accounts</h2>
        {isOwnProfile && (
          <RouterLink to="/link-accounts">
            <Button className="bg-gradient-game" size="sm">
              <Link className="h-4 w-4 mr-1" />
              {hasLinkedAccounts ? 'Manage Accounts' : 'Link Accounts'}
            </Button>
          </RouterLink>
        )}
      </div>

      {hasLinkedAccounts ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.steam_id && (
            <div className="bg-black/30 p-4 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.979 0C5.678 0 0.511 4.86 0.022 11.037l6.432 2.658c0.545-0.371 1.203-0.59 1.912-0.59 0.063 0 0.125 0.004 0.188 0.008l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-0.105l-4.076 2.911c0 0.052 0.004 0.105 0.004 0.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L0.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-0.61c0.262 0.543 0.714 0.999 1.314 1.25 1.297 0.539 2.793-0.076 3.332-1.375 0.263-0.63 0.264-1.319 0.005-1.949s-0.75-1.121-1.377-1.383c-0.624-0.26-1.29-0.249-1.878-0.03l1.523 0.63c0.956 0.4 1.409 1.5 1.009 2.455-0.397 0.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-0.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.266-1.253 0-2.265-1.014-2.265-2.265z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-neutral-400">Steam</div>
                <div className="font-medium">{profile.steam_id}</div>
              </div>
            </div>
          )}

          {profile.xbox_gamertag && (
            <div className="bg-black/30 p-4 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.382 0 0 5.382 0 12s5.382 12 12 12 12-5.382 12-12S18.618 0 12 0zm0 2c2.826 0 5.348 1.304 7 3.33l.031.03c.04.06.081.12.12.18l-5.951 5.95a3.277 3.277 0 01-2.38.91c-.868 0-1.736-.3-2.43-.9l-5.95-5.95a9.991 9.991 0 017.56-3.55zm-8.45 4.97L8.6 12l-5.05 5.03A9.971 9.971 0 012 12c0-1.89.523-3.661 1.43-5.174l.12.143zm16.9.03c.907 1.514 1.43 3.284 1.43 5.174 0 1.766-.454 3.428-1.25 4.882L15.4 12l5.05-5z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-neutral-400">Xbox</div>
                <div className="font-medium">{profile.xbox_gamertag}</div>
              </div>
            </div>
          )}

          {profile.playstation_username && (
            <div className="bg-black/30 p-4 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.5 4.27c-.6.24-1.38.51-2.38.9C4.4 6.16 3 6.78 3 8.75v9.34c0 .86.64 1.3 1.37 1.17 2.14-.38 2.9-1.55 2.9-3.1V7.58c0-.38.21-.56.5-.47.29.09.45.31.45.7v12.7l2.26-.75V4.43s-.81-.4-1-.16zm5.3 1.61c-1.35.52-1.95 1.08-1.95 2.3v9.46c0 1.34.85 1.87 1.87 1.65.92-.2 1.49-.71 1.49-1.75V6.41l2.3-.77V4.71c-.01 0-2.38.66-3.71 1.17zm-.22 10.57c-.65 0-1.14-.29-1.14-.89 0-.59.5-1.09 1.14-1.09.65 0 1.09.5 1.09 1.09.01.6-.44.89-1.09.89z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-neutral-400">PlayStation</div>
                <div className="font-medium">{profile.playstation_username}</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        isOwnProfile && (
          <div className="text-neutral-400 text-center py-8">
            <Link className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No gaming accounts linked</p>
            <p className="text-sm mt-1">Connect your gaming accounts to track achievements and stats</p>
            <RouterLink to="/link-accounts" className="block mt-4">
              <Button className="bg-gradient-game mt-2" size="sm">
                Link Accounts
              </Button>
            </RouterLink>
          </div>
        )
      )}
    </div>
  );
};

export default LinkedAccounts;
