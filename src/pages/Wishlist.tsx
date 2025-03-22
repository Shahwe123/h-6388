
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookMarked, Plus, Search, Filter, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface GameItem {
  id: number;
  name: string;
  image: string;
  platform?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
}

const Wishlist = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGame, setNewGame] = useState<Partial<GameItem>>({
    name: '',
    platform: '',
    priority: 'medium',
    notes: ''
  });
  
  // Mock data for demonstration purposes
  const [wishlistGames, setWishlistGames] = useState<GameItem[]>([
    {
      id: 101,
      name: "Starfield",
      image: "https://placehold.co/100x150?text=Starfield",
      platform: "PC",
      priority: "high",
      notes: "Bethesda's space RPG"
    },
    {
      id: 102,
      name: "Final Fantasy XVI",
      image: "https://placehold.co/100x150?text=FF+XVI",
      platform: "PlayStation 5",
      priority: "medium",
      notes: "Latest in the FF series"
    },
    {
      id: 103,
      name: "Alan Wake 2",
      image: "https://placehold.co/100x150?text=Alan+Wake+2",
      platform: "PlayStation 5",
      priority: "low",
      notes: "Horror sequel by Remedy"
    }
  ]);
  
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
      priority: newGame.priority as 'high' | 'medium' | 'low',
      notes: newGame.notes
    };
    
    setWishlistGames(prev => [gameToAdd, ...prev]);
    setNewGame({
      name: '',
      platform: '',
      priority: 'medium',
      notes: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Game added",
      description: `${gameToAdd.name} has been added to your wishlist.`
    });
  };
  
  const handleRemoveGame = (id: number) => {
    setWishlistGames(prev => prev.filter(game => game.id !== id));
    
    toast({
      title: "Game removed",
      description: "Game has been removed from your wishlist."
    });
  };
  
  const handleChangePriority = (id: number, priority: 'high' | 'medium' | 'low') => {
    setWishlistGames(prev => 
      prev.map(game => 
        game.id === id ? { ...game, priority } : game
      )
    );
    
    toast({
      title: "Priority updated",
      description: "Game priority has been updated."
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
  
  // Filter and sort games
  const filteredGames = wishlistGames
    .filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = filterPlatform === 'all' || game.platform === filterPlatform;
      return matchesSearch && matchesPlatform;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low'];
      }
      // Default: newest (by ID, higher is newer)
      return b.id - a.id;
    });
  
  // Get unique platforms for filtering
  const platforms = ['all', ...new Set(wishlistGames.map(game => game.platform || '').filter(Boolean))];
  
  return (
    <div className="page-container bg-primary">
      <Helmet>
        <title>My Wishlist | PlatinumPath</title>
        <meta name="description" content="Manage your gaming wishlist" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <BookMarked className="mr-2 h-6 w-6 text-neon-purple" />
              My Wishlist
            </h1>
            <p className="text-zinc-400 mt-1">Track games you want to play in the future</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cyber-button">
                <Plus className="mr-2 h-4 w-4" />
                Add Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Game to Wishlist</DialogTitle>
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
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    placeholder="Any notes about this game"
                    value={newGame.notes}
                    onChange={(e) => setNewGame(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddGame}>Add to Wishlist</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="glass-card mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-9" 
                  placeholder="Search games..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform === 'all' ? 'All Platforms' : platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <SortDesc className="h-4 w-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((game) => (
              <Card key={game.id} className="glass-card overflow-hidden flex flex-col">
                <div className="flex p-4">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{game.name}</h3>
                      <Badge className={getPriorityColor(game.priority || '')}>
                        {game.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400">{game.platform}</p>
                    {game.notes && (
                      <p className="text-sm text-zinc-500 mt-2 line-clamp-2">{game.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto px-4 pb-4">
                  <div className="flex justify-between gap-2">
                    <Select 
                      value={game.priority} 
                      onValueChange={(value: string) => handleChangePriority(game.id, value as 'high' | 'medium' | 'low')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveGame(game.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookMarked className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-zinc-400 max-w-md mx-auto mb-6">
              Add games you want to play in the future to keep track of them
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Game
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
