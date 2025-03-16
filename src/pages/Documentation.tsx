
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  
  const categories = [
    'Getting Started',
    'Account Management',
    'Platform Integration',
    'Achievement Tracking',
    'Social Features',
    'Privacy & Security',
    'Troubleshooting',
    'API Reference'
  ];
  
  // Mock documentation content
  const docContent = {
    'Getting Started': [
      {
        title: 'What is PlatinumPath?',
        content: 'PlatinumPath is a comprehensive achievement tracking platform that brings together your gaming accomplishments from PlayStation, Xbox, Steam, and more into one unified profile.'
      },
      {
        title: 'Creating Your Account',
        content: 'To create a PlatinumPath account, click the "Sign Up" button in the top right corner of the homepage. You can register using your email address or sign in with your Google or Discord account.'
      },
      {
        title: 'Setting Up Your Profile',
        content: 'After creating your account, you can customize your profile by adding a profile picture, cover image, bio, and linking your gaming accounts. A complete profile helps friends find you and showcases your gaming style.'
      }
    ],
    'Account Management': [
      {
        title: 'Changing Your Password',
        content: 'To change your password, go to Settings > Security and click "Change Password". You'll need to enter your current password and then your new password twice to confirm.'
      },
      {
        title: 'Updating Email Address',
        content: 'To update your email address, go to Settings > Account and click "Update Email". A verification link will be sent to your new email address to confirm the change.'
      },
      {
        title: 'Deleting Your Account',
        content: 'To delete your account, go to Settings > Account > Delete Account. This action is permanent and will remove all your data from PlatinumPath.'
      }
    ],
    'Platform Integration': [
      {
        title: 'Linking PlayStation Account',
        content: 'To link your PlayStation account, go to Settings > Linked Accounts and click "Connect" next to PlayStation. You'll be redirected to Sony's login page to authorize the connection.'
      },
      {
        title: 'Linking Xbox Account',
        content: 'To link your Xbox account, go to Settings > Linked Accounts and click "Connect" next to Xbox. You'll be redirected to Microsoft's login page to authorize the connection.'
      },
      {
        title: 'Linking Steam Account',
        content: 'To link your Steam account, go to Settings > Linked Accounts and click "Connect" next to Steam. You'll be redirected to Steam's login page to authorize the connection.'
      }
    ],
    'Achievement Tracking': [
      {
        title: 'Viewing Your Achievements',
        content: 'Your achievements from all platforms are displayed on your profile page. You can filter by platform, game, or achievement type to find specific accomplishments.'
      },
      {
        title: 'Achievement Synchronization',
        content: 'PlatinumPath automatically syncs your achievements every 24 hours. You can manually trigger a sync by clicking the refresh button on your profile page.'
      },
      {
        title: 'Achievement Rarity',
        content: 'Each achievement displays its rarity based on the percentage of players who have unlocked it. Ultra Rare achievements are those unlocked by less than 5% of players.'
      }
    ],
    'Social Features': [
      {
        title: 'Adding Friends',
        content: 'To add friends on PlatinumPath, go to the Friends page and use the search bar to find users by username or email. Click "Add Friend" to send a friend request.'
      },
      {
        title: 'Comparing Achievements',
        content: 'You can compare your achievements with friends by visiting their profile and clicking "Compare". This shows achievements you both have, as well as those unique to each player.'
      },
      {
        title: 'Leaderboards',
        content: 'PlatinumPath features global and friends leaderboards. You can compare achievement counts, platinum trophies, and completion percentages across different categories.'
      }
    ],
    'Privacy & Security': [
      {
        title: 'Privacy Settings',
        content: 'Manage your privacy settings by going to Settings > Privacy. You can control who sees your profile, achievements, and gaming activity.'
      },
      {
        title: 'Two-Factor Authentication',
        content: 'Enable Two-Factor Authentication (2FA) in Settings > Security for an extra layer of account protection. We support SMS verification and authentication apps.'
      },
      {
        title: 'Data Sharing Controls',
        content: 'Control what data PlatinumPath shares with third parties in Settings > Privacy > Data Sharing. You can opt out of analytics and marketing data collection.'
      }
    ],
    'Troubleshooting': [
      {
        title: 'Achievement Sync Issues',
        content: 'If your achievements aren't syncing, ensure your gaming accounts are properly linked and try manually refreshing your profile. If issues persist, check our server status page.'
      },
      {
        title: 'Account Linking Failures',
        content: 'If you're having trouble linking a gaming account, try logging out and back in to both PlatinumPath and the gaming platform. Ensure you're using the correct credentials.'
      },
      {
        title: 'Missing Achievements',
        content: 'Some achievements may not appear immediately due to caching or API limitations. If achievements are missing after 24 hours, contact support with details of the missing achievements.'
      }
    ],
    'API Reference': [
      {
        title: 'API Overview',
        content: 'PlatinumPath offers a public API for developers to integrate achievement data into their applications. The API is RESTful and returns data in JSON format.'
      },
      {
        title: 'Authentication',
        content: 'API requests require authentication using an API key. Register your application in the Developer Portal to receive your API key.'
      },
      {
        title: 'Rate Limiting',
        content: 'The API is rate limited to 1000 requests per day for free tier users. Enterprise plans offer higher limits. Rate limit headers are included in all API responses.'
      }
    ]
  };
  
  const filteredDocs = activeCategory 
    ? docContent[activeCategory].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <div className="max-w-6xl mx-auto container-padding">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Documentation</h1>
          <p className="text-neutral-400">Detailed information about using PlatinumPath</p>
        </div>
        
        <div className="mb-8">
          <div className="relative w-full max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search documentation..."
              className="pl-10 bg-black/30 border-neutral-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-black/30 rounded-xl p-4 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Categories</h2>
              <nav className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeCategory === category 
                        ? "bg-neon-purple/20 text-neon-purple" 
                        : "text-neutral-400 hover:bg-black/20"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">{activeCategory}</h2>
              
              {filteredDocs.length > 0 ? (
                <div className="space-y-8">
                  {filteredDocs.map((doc, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-semibold mb-2">{doc.title}</h3>
                      <p className="text-neutral-300">{doc.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-400">
                    {searchQuery 
                      ? `No documentation found matching "${searchQuery}" in ${activeCategory}` 
                      : `No documentation available for ${activeCategory}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
