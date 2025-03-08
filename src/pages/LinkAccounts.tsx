
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Steam, GamepadIcon, Gamepad2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

type LinkedAccount = Tables<"linked_accounts">;

interface PlatformInfo {
  name: string;
  icon: React.ReactNode;
  color: string;
  linkInstructions: string;
}

const PLATFORMS: Record<string, PlatformInfo> = {
  steam: {
    name: "Steam",
    icon: <Steam className="h-8 w-8" />,
    color: "bg-[#1b2838] hover:bg-[#2a3f5a]",
    linkInstructions: "Enter your Steam username or ID. You can find this in your Steam profile URL."
  },
  xbox: {
    name: "Xbox",
    icon: <GamepadIcon className="h-8 w-8" />,
    color: "bg-neon-green hover:bg-green-600",
    linkInstructions: "Enter your Xbox Gamertag. This is the username you use to sign in to Xbox Live."
  },
  playstation: {
    name: "PlayStation",
    icon: <Gamepad2Icon className="h-8 w-8" />,
    color: "bg-blue-600 hover:bg-blue-700",
    linkInstructions: "Enter your PlayStation Network ID. This is the username you use to sign in to PSN."
  }
};

const LinkAccounts = () => {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [platformUsername, setPlatformUsername] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  const fetchLinkedAccounts = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        navigate("/auth");
        return;
      }
      
      const { data, error } = await supabase
        .from("linked_accounts")
        .select("*")
        .order("linked_at", { ascending: false });
        
      if (error) throw error;
      
      setLinkedAccounts(data || []);
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
      toast({
        title: "Error",
        description: "Failed to load linked accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openLinkDialog = (platform: string) => {
    setSelectedPlatform(platform);
    setPlatformUsername("");
    setIsDialogOpen(true);
  };

  const handleLinkAccount = async () => {
    if (!selectedPlatform || !platformUsername.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid username",
        variant: "destructive",
      });
      return;
    }

    setIsLinking(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate("/auth");
        return;
      }

      // Check if this platform is already linked
      const existingAccount = linkedAccounts.find(
        account => account.platform === selectedPlatform
      );

      if (existingAccount) {
        // Update the existing link
        const { error } = await supabase
          .from("linked_accounts")
          .update({
            platform_username: platformUsername,
            linked_at: new Date().toISOString(),
          })
          .eq("id", existingAccount.id);

        if (error) throw error;
      } else {
        // Create a new link
        const { error } = await supabase.from("linked_accounts").insert({
          user_id: session.session.user.id,
          platform: selectedPlatform,
          platform_username: platformUsername,
        });

        if (error) throw error;
      }

      // Refresh the list of linked accounts
      await fetchLinkedAccounts();
      
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: `Your ${PLATFORMS[selectedPlatform].name} account has been linked!`,
      });
    } catch (error) {
      console.error("Error linking account:", error);
      toast({
        title: "Error",
        description: "Failed to link account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkAccount = async (platform: string) => {
    try {
      const accountToUnlink = linkedAccounts.find(
        account => account.platform === platform
      );

      if (!accountToUnlink) return;

      const { error } = await supabase
        .from("linked_accounts")
        .delete()
        .eq("id", accountToUnlink.id);

      if (error) throw error;

      // Refresh the list of linked accounts
      await fetchLinkedAccounts();
      
      toast({
        title: "Account unlinked",
        description: `Your ${PLATFORMS[platform].name} account has been unlinked`,
      });
    } catch (error) {
      console.error("Error unlinking account:", error);
      toast({
        title: "Error",
        description: "Failed to unlink account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isPlatformLinked = (platform: string) => {
    return linkedAccounts.some(account => account.platform === platform);
  };

  const getLinkedUsername = (platform: string) => {
    const account = linkedAccounts.find(acc => acc.platform === platform);
    return account ? account.platform_username : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10 container-padding flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-300">Loading your linked accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 container-padding">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-6 rounded-xl mb-8">
          <h1 className="text-2xl font-bold neon-text mb-2">Link Your Gaming Accounts</h1>
          <p className="text-neutral-300 mb-4">
            Connect your gaming platform accounts to AchievR to sync achievements and track your progress across all your platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(PLATFORMS).map(([platformId, platform]) => (
            <div 
              key={platformId}
              className="glass-card p-6 rounded-xl hover:border-neon-purple/50 transition-all"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg mr-3 ${platform.color}`}>
                  {platform.icon}
                </div>
                <h2 className="text-xl font-bold text-white">{platform.name}</h2>
              </div>
              
              {isPlatformLinked(platformId) ? (
                <>
                  <div className="mb-4">
                    <p className="text-neutral-400 text-sm">Linked Account</p>
                    <p className="text-neon-purple font-medium">{getLinkedUsername(platformId)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10"
                      onClick={() => openLinkDialog(platformId)}
                    >
                      Update
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleUnlinkAccount(platformId)}
                    >
                      Unlink
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-neutral-300 mb-4">
                    Link your {platform.name} account to track achievements
                  </p>
                  <Button 
                    className={`w-full ${platform.color} text-white`}
                    onClick={() => openLinkDialog(platformId)}
                  >
                    Link Account
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Platform linking dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border border-neon-purple/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl neon-text">
              {selectedPlatform && `Link Your ${PLATFORMS[selectedPlatform].name} Account`}
            </DialogTitle>
            <DialogDescription className="text-neutral-300">
              {selectedPlatform && PLATFORMS[selectedPlatform].linkInstructions}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="platform-username" className="block text-sm font-medium text-neutral-300 mb-1">
                {selectedPlatform && `${PLATFORMS[selectedPlatform].name} Username`}
              </label>
              <input
                id="platform-username"
                type="text"
                value={platformUsername}
                onChange={(e) => setPlatformUsername(e.target.value)}
                placeholder={selectedPlatform ? `Enter your ${PLATFORMS[selectedPlatform].name} username` : ""}
                className="w-full bg-black/50 border border-neon-purple/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-neon-purple/30 text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLinkAccount}
              className={selectedPlatform ? PLATFORMS[selectedPlatform].color : ""}
              disabled={isLinking || !platformUsername.trim()}
            >
              {isLinking ? "Linking..." : "Link Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinkAccounts;
