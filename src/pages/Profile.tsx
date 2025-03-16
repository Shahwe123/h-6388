
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Trophy, Medal, Target, Users } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Progress } from "@/components/ui/progress";
import ProfileStats from "@/components/profile/ProfileStats";
import GamingStats from "@/components/profile/GamingStats";

const Profile = () => {
  const { logout } = useAuth();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [is_private, setIsPrivate] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newAvatar, setNewAvatar] = useState<File | null>(null);

  // Mock player stats - in a real app, this would come from the backend
  const playerStats = {
    trophiesCount: 128,
    platinumCount: 12,
    completionPercentage: 78,
    friendCount: 24,
    level: 42,
    xp: 8750,
    nextLevelXp: 10000,
    rank: "Master"
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsPrivate(user.is_private);
      setAvatarUrl(user.avatar);
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate("/auth");
      toast({
        title: "Logged out successfully.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed.",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsPrivate(user.is_private);
      setAvatarUrl(user.avatar);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("is_private", String(is_private));
      if (newAvatar) {
        formData.append("avatar", newAvatar);
      } else {
        formData.append("avatar", avatarUrl || "");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update profile, please try again."
        );
      }

      const updatedUser = await response.json();

      setUser({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        is_private: updatedUser.is_private,
      });

      toast({
        title: "Profile updated successfully.",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast({
        title: "Profile update failed.",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert user data to profile format
  const profileData = user ? {
    id: user.id || '',
    username: user.name || '',
    bio: '',
    avatar_url: user.avatar || '',
    cover_url: '',
    is_private: user.is_private
  } : {
    id: '',
    username: '',
    bio: '',
    avatar_url: '',
    cover_url: '',
    is_private: false
  };

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main className="container py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="overview">Profile Overview</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="mb-8">
              <div className="glass-card rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-20 w-20 border-2 border-neon-purple">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={name} />
                    ) : (
                      <AvatarFallback className="bg-black/60 text-white text-xl">
                        {name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold neon-text">{name || "Username"}</h1>
                    <p className="text-neutral-400">Level {playerStats.level} • {playerStats.rank}</p>
                    <div className="mt-2">
                      <Progress value={(playerStats.xp / playerStats.nextLevelXp) * 100} className="h-2" />
                      <p className="text-xs mt-1 text-neutral-400">{playerStats.xp}/{playerStats.nextLevelXp} XP</p>
                    </div>
                  </div>
                </div>
              </div>

              <ProfileStats 
                trophiesCount={playerStats.trophiesCount}
                platinumCount={playerStats.platinumCount}
                completionPercentage={playerStats.completionPercentage}
                friendCount={playerStats.friendCount}
              />

              <GamingStats />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Account Settings <Settings className="inline-block ml-2 h-5 w-5" />
                </CardTitle>
                <CardDescription>
                  Manage your account settings and privacy.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-center">
                  <Avatar className="h-24 w-24">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Avatar" />
                    ) : (
                      <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                </div>
                {isEditing && (
                  <div>
                    <Label htmlFor="avatar">Change Avatar</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="mt-2"
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_private">Private Profile</Label>
                  <Switch
                    id="is_private"
                    checked={is_private}
                    onCheckedChange={(checked) => setIsPrivate(checked)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {!isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleEditProfile}>
                      Edit Profile
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging Out..." : "Logout"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
