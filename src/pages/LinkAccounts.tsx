import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Gamepad2, 
  Monitor, 
  User, 
  X, 
  Link2, 
  Unlink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface PlatformAccount {
  id: string;
  platform: string;
  platform_username: string;
  platform_id: string;
  connected_at: string;
}

const LinkAccounts = () => {
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [platformUsername, setPlatformUsername] = useState('');
  const [platformId, setPlatformId] = useState('');
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const [accountToUnlink, setAccountToUnlink] = useState<PlatformAccount | null>(null);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }

      const { data, error } = await supabase
        .from('platform_accounts')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        throw error;
      }

      setAccounts(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching accounts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!selectedPlatform || !platformUsername) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Authentication error',
          description: 'Please log in again',
          variant: 'destructive',
        });
        return;
      }

      // Check if account already exists
      const { data: existingAccounts } = await supabase
        .from('platform_accounts')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('platform', selectedPlatform);

      if (existingAccounts && existingAccounts.length > 0) {
        toast({
          title: 'Account already linked',
          description: `You already have a ${selectedPlatform} account linked`,
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('platform_accounts')
        .insert({
          user_id: session.user.id,
          platform: selectedPlatform,
          platform_username: platformUsername,
          platform_id: platformId || null,
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Account linked',
        description: `Your ${selectedPlatform} account has been linked successfully`,
      });

      // Reset form and close dialog
      setPlatformUsername('');
      setPlatformId('');
      setSelectedPlatform(null);
      setLinkDialogOpen(false);
      
      // Refresh accounts list
      fetchAccounts();
    } catch (error: any) {
      toast({
        title: 'Error linking account',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUnlinkAccount = async () => {
    if (!accountToUnlink) return;

    try {
      const { error } = await supabase
        .from('platform_accounts')
        .delete()
        .eq('id', accountToUnlink.id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Account unlinked',
        description: `Your ${accountToUnlink.platform} account has been unlinked`,
      });

      setUnlinkDialogOpen(false);
      setAccountToUnlink(null);
      
      // Refresh accounts list
      fetchAccounts();
    } catch (error: any) {
      toast({
        title: 'Error unlinking account',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'xbox':
        return <Gamepad2 className="w-6 h-6 text-green-500" />;
      case 'playstation':
        return <Gamepad2 className="w-6 h-6 text-blue-500" />;
      case 'steam':
        return <Monitor className="w-6 h-6 text-gray-300" />;
      case 'epic':
        return <Monitor className="w-6 h-6 text-yellow-500" />;
      default:
        return <User className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-primary">
      <div className="container-padding mx-auto max-w-4xl">
        <div className="glass-card rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold neon-text">Linked Accounts</h1>
            <Button 
              onClick={() => setLinkDialogOpen(true)}
              className="bg-gradient-game"
            >
              <Link2 className="w-4 h-4 mr-2" />
              Link New Account
            </Button>
          </div>
          
          <div className="space-y-4">
            {accounts.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No accounts linked yet</p>
                <p className="text-sm mt-1">Link your gaming accounts to track achievements across platforms</p>
              </div>
            ) : (
              accounts.map((account) => (
                <div 
                  key={account.id} 
                  className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-neon-purple/20"
                >
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(account.platform)}
                    <div>
                      <div className="font-medium">{account.platform}</div>
                      <div className="text-sm text-neutral-400">{account.platform_username}</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setAccountToUnlink(account);
                      setUnlinkDialogOpen(true);
                    }}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Unlink className="w-4 h-4 mr-1" />
                    Unlink
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Link Account Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="glass-card border-neon-purple/50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="neon-text">Link Gaming Account</DialogTitle>
            <DialogDescription>
              Connect your gaming accounts to track achievements and stats across platforms.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={selectedPlatform === 'Xbox' ? 'default' : 'outline'}
                className={selectedPlatform === 'Xbox' ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={() => setSelectedPlatform('Xbox')}
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                Xbox
              </Button>
              
              <Button
                type="button"
                variant={selectedPlatform === 'PlayStation' ? 'default' : 'outline'}
                className={selectedPlatform === 'PlayStation' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                onClick={() => setSelectedPlatform('PlayStation')}
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                PlayStation
              </Button>
              
              <Button
                type="button"
                variant={selectedPlatform === 'Steam' ? 'default' : 'outline'}
                className={selectedPlatform === 'Steam' ? 'bg-gray-600 hover:bg-gray-700' : ''}
                onClick={() => setSelectedPlatform('Steam')}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Steam
              </Button>
              
              <Button
                type="button"
                variant={selectedPlatform === 'Epic' ? 'default' : 'outline'}
                className={selectedPlatform === 'Epic' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                onClick={() => setSelectedPlatform('Epic')}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Epic
              </Button>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                value={platformUsername}
                onChange={(e) => setPlatformUsername(e.target.value)}
                placeholder="Enter your platform username"
                className="bg-black/50 border-neon-purple/30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="platformId" className="text-sm font-medium flex items-center">
                Platform ID <span className="text-xs text-neutral-400 ml-2">(Optional)</span>
              </label>
              <Input
                id="platformId"
                value={platformId}
                onChange={(e) => setPlatformId(e.target.value)}
                placeholder="Enter your platform ID if available"
                className="bg-black/50 border-neon-purple/30"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleLinkAccount} className="bg-gradient-game">
              <Link2 className="w-4 h-4 mr-2" />
              Link Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unlink Account Dialog */}
      <Dialog open={unlinkDialogOpen} onOpenChange={setUnlinkDialogOpen}>
        <DialogContent className="glass-card border-neon-purple/50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Unlink Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlink your {accountToUnlink?.platform} account? This will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnlinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleUnlinkAccount}
            >
              <Unlink className="w-4 h-4 mr-2" />
              Unlink Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinkAccounts;
