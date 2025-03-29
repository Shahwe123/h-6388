
import { useState } from 'react';
import { BookMarked, ListChecks, ArrowRight, Crown, Star, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface GameItem {
  id: number;
  name: string;
  image: string;
  platform?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
  progress?: number;
  estimatedTime?: number;
}

const WishlistBacklogWidget = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('wishlist');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGame, setNewGame] = useState<Partial<GameItem>>({
    name: '',
    platform: '',
    priority: 'medium',
    progress: 0,
    estimatedTime: 20,
    notes: ''
  });
  
  // Mock data for demonstration purposes
  const [wishlistGames, setWishlistGames] = useState<GameItem[]>([
    {
      id: 101,
      name: "Starfield",
      image: "https://placehold.co/100x150?text=Starfield",
      platform: "PC",
      priority: "high"
    },
    {
      id: 102,
      name: "Final Fantasy XVI",
      image: "https://placehold.co/100x150?text=FF+XVI",
      platform: "PlayStation 5",
      priority: "medium"
    }
  ]);
  
  const [backlogGames, setBacklogGames] = useState<GameItem[]>([
    {
      id: 201,
      name: "Hogwarts Legacy",
      image: "https://placehold.co/100x150?text=Hogwarts",
      platform: "PlayStation 5",
      progress: 35,
      estimatedTime: 60
    },
    {
      id: 202,
      name: "Baldur's Gate 3",
      image: "https://placehold.co/100x150?text=BG3",
      platform: "PC",
      progress: 20,
      estimatedTime: 100
    },
    {
      id: 203,
      name: "Resident Evil 4 Remake",
      image: "https://placehold.co/100x150?text=RE4",
      platform: "PlayStation 5",
      progress: 68,
      estimatedTime: 20
    }
  ]);
  
  const handleAddToPlaying = (gameId: number) => {
    toast({
      title: "Added to currently playing",
      description: "This game has been added to your playing collection",
    });
  };
  
  const handleAddGame = () => {
    if (!newGame.name) {
      toast({
        title: "Error",
        description: "Game name is required",
        variant: "destructive"
      });
      return;
    }
    
    const gameToAdd: GameItem = {
      id: Date.now(),
      name: newGame.name || '',
      image: `https://placehold.co/100x150?text=${encodeURIComponent(newGame.name || '')}`,
      platform: newGame.platform,
      ...(activeTab === 'wishlist' 
        ? { priority: newGame.priority as 'high' | 'medium' | 'low' }
        : { progress: newGame.progress, estimatedTime: newGame.estimatedTime }
      ),
      notes: newGame.notes
    };
    
    if (activeTab === 'wishlist') {
      setWishlistGames(prev => [gameToAdd, ...prev]);
    } else {
      setBacklogGames(prev => [gameToAdd, ...prev]);
    }
    
    // Reset the form
    setNewGame({
      name: '',
      platform: '',
      priority: 'medium',
      progress: 0,
      estimatedTime: 20,
      notes: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Game added",
      description: `${gameToAdd.name} has been added to your ${activeTab}.`
    });
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high':
        return "bg-red-500/20 text-red-400";
      case 'medium':
        return "bg-yellow-500/20 text-yellow-400";
      case 'low':
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-neutral-500/20 text-neutral-400";
    }
  };
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl justify-between">
          <div className="flex items-center">
            {activeTab === 'wishlist' 
              ? <BookMarked className="mr-2 h-5 w-5 text-neon-purple" /> 
              : <ListChecks className="mr-2 h-5 w-5 text-neon-blue" />
            }
            {activeTab === 'wishlist' ? 'Game Wishlist' : 'Backlog Manager'}
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2" title="Add game">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Add Game to {activeTab === 'wishlist' ? 'Wishlist' : 'Backlog'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Game Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter game name"
                    value={newGame.name}
                    onChange={(e) => setNewGame(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input 
                    id="platform" 
                    placeholder="PlayStation 5, Xbox, PC, etc."
                    value={newGame.platform}
                    onChange={(e) => setNewGame(prev => ({ ...prev, platform: e.target.value }))}
                  />
                </div>
                
                {activeTab === 'wishlist' ? (
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newGame.priority} 
                      onValueChange={(value) => setNewGame(prev => ({ ...prev, priority: value as 'high' | 'medium' | 'low' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="progress">Progress (%)</Label>
                      <Slider 
                        id="progress"
                        min={0} 
                        max={100} 
                        step={1} 
                        value={[newGame.progress || 0]}
                        onValueChange={(values) => setNewGame(prev => ({ ...prev, progress: values[0] }))}
                      />
                      <div className="text-right text-sm text-muted-foreground">
                        {newGame.progress || 0}%
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
                      <Input 
                        id="estimatedTime" 
                        type="number"
                        min={1}
                        value={newGame.estimatedTime?.toString()}
                        onChange={(e) => setNewGame(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddGame}>
                  Add to {activeTab === 'wishlist' ? 'Wishlist' : 'Backlog'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <Tabs 
          defaultValue="wishlist" 
          className="w-full" 
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4 w-full glass-card">
            <TabsTrigger value="wishlist" className="w-1/2">Wishlist</TabsTrigger>
            <TabsTrigger value="backlog" className="w-1/2">Backlog</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wishlist" className="mt-0">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {wishlistGames.length > 0 ? (
                wishlistGames.map((game) => (
                  <div key={game.id} className="bg-black/20 rounded-lg p-2 flex items-center">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-10 h-14 object-cover rounded"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">{game.name}</p>
                        <Badge className={getPriorityColor(game.priority || '')}>
                          {game.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400">{game.platform}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-400">
                  <BookMarked className="mx-auto h-10 w-10 opacity-40 mb-2" />
                  <p>Your wishlist is empty</p>
                  <p className="text-sm mt-1">Add games you want to play in the future</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link to="/wishlist">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Wishlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="backlog" className="mt-0">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {backlogGames.length > 0 ? (
                backlogGames.map((game) => (
                  <div key={game.id} className="bg-black/20 rounded-lg p-2 flex">
                    <img 
                      src={game.image}
                      alt={game.name}
                      className="w-10 h-14 object-cover rounded"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm">{game.name}</p>
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleAddToPlaying(game.id)}
                            className="text-neon-purple hover:text-neon-purple/80 p-1 rounded"
                            title="Mark as playing"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400">{game.platform}</p>
                      <div className="mt-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{game.progress}%</span>
                        </div>
                        <Progress value={game.progress} className="h-1.5 bg-black/40" />
                      </div>
                      {game.estimatedTime && (
                        <p className="text-xs text-zinc-500 mt-1">
                          Est. {game.estimatedTime}h to complete
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-400">
                  <ListChecks className="mx-auto h-10 w-10 opacity-40 mb-2" />
                  <p>Your backlog is empty</p>
                  <p className="text-sm mt-1">Add games you own but haven't completed</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link to="/backlog">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Backlog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WishlistBacklogWidget;
