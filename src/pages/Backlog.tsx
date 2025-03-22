
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ListChecks, Plus, Search, Filter, SortDesc, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

interface GameItem {
  id: number;
  name: string;
  image: string;
  platform?: string;
  status?: 'not_started' | 'in_progress' | 'nearly_done';
  progress?: number;
  estimatedTime?: number;
  notes?: string;
}

const Backlog = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGame, setNewGame] = useState<Partial<GameItem>>({
    name: '',
    platform: '',
    status: 'not_started',
    progress: 0,
    estimatedTime: 20,
    notes: ''
  });
  
  // Mock data for demonstration purposes
  const [backlogGames, setBacklogGames] = useState<GameItem[]>([
    {
      id: 201,
      name: "Hogwarts Legacy",
      image: "https://placehold.co/100x150?text=Hogwarts",
      platform: "PlayStation 5",
      status: "in_progress",
      progress: 35,
      estimatedTime: 60,
      notes: "Exploring Hogwarts, need to complete main story"
    },
    {
      id: 202,
      name: "Baldur's Gate 3",
      image: "https://placehold.co/100x150?text=BG3",
      platform: "PC",
      status: "not_started",
      progress: 5,
      estimatedTime: 100,
      notes: "Need to start this epic RPG"
    },
    {
      id: 203,
      name: "Resident Evil 4 Remake",
      image: "https://placehold.co/100x150?text=RE4",
      platform: "PlayStation 5",
      status: "nearly_done",
      progress: 68,
      estimatedTime: 20,
      notes: "Almost done, need to defeat final boss"
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
      status: newGame.status as 'not_started' | 'in_progress' | 'nearly_done',
      progress: newGame.progress,
      estimatedTime: newGame.estimatedTime,
      notes: newGame.notes
    };
    
    setBacklogGames(prev => [gameToAdd, ...prev]);
    setNewGame({
      name: '',
      platform: '',
      status: 'not_started',
      progress: 0,
      estimatedTime: 20,
      notes: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Game added",
      description: `${gameToAdd.name} has been added to your backlog.`
    });
  };
  
  const handleRemoveGame = (id: number) => {
    setBacklogGames(prev => prev.filter(game => game.id !== id));
    
    toast({
      title: "Game removed",
      description: "Game has been removed from your backlog."
    });
  };
  
  const handleUpdateProgress = (id: number, progress: number) => {
    setBacklogGames(prev => 
      prev.map(game => {
        if (game.id === id) {
          let status = game.status;
          
          // Update status based on progress
          if (progress === 0) {
            status = 'not_started';
          } else if (progress < 60) {
            status = 'in_progress';
          } else {
            status = 'nearly_done';
          }
          
          return { ...game, progress, status };
        }
        return game;
      })
    );
  };
  
  const handleMarkAsPlaying = (id: number) => {
    toast({
      title: "Added to currently playing",
      description: "This game has been marked as currently playing."
    });
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'not_started':
        return "bg-blue-500/20 text-blue-400";
      case 'in_progress':
        return "bg-yellow-500/20 text-yellow-400";
      case 'nearly_done':
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-neutral-500/20 text-neutral-400";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'not_started':
        return "Not Started";
      case 'in_progress':
        return "In Progress";
      case 'nearly_done':
        return "Nearly Done";
      default:
        return status;
    }
  };
  
  // Filter and sort games
  const filteredGames = backlogGames
    .filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = filterPlatform === 'all' || game.platform === filterPlatform;
      const matchesStatus = filterStatus === 'all' || game.status === filterStatus;
      return matchesSearch && matchesPlatform && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'progress') {
        return (b.progress || 0) - (a.progress || 0);
      } else if (sortBy === 'estimated_time') {
        return (a.estimatedTime || 0) - (b.estimatedTime || 0);
      }
      // Default: newest (by ID, higher is newer)
      return b.id - a.id;
    });
  
  // Get unique platforms for filtering
  const platforms = ['all', ...new Set(backlogGames.map(game => game.platform || '').filter(Boolean))];
  
  return (
    <div className="page-container bg-primary">
      <Helmet>
        <title>My Backlog | PlatinumPath</title>
        <meta name="description" content="Manage your gaming backlog" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ListChecks className="mr-2 h-6 w-6 text-neon-blue" />
              My Backlog
            </h1>
            <p className="text-zinc-400 mt-1">Track your progress on games you own but haven't completed</p>
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
                <DialogTitle>Add Game to Backlog</DialogTitle>
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
                  <Label htmlFor="estimatedTime">Estimated Time to Complete (hours)</Label>
                  <Input 
                    id="estimatedTime" 
                    type="number"
                    min={1}
                    value={newGame.estimatedTime?.toString()}
                    onChange={(e) => setNewGame(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 0 }))}
                  />
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
                <Button onClick={handleAddGame}>Add to Backlog</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="glass-card mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="nearly_done">Nearly Done</SelectItem>
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
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="estimated_time">Shortest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((game) => (
              <Card key={game.id} className="glass-card overflow-hidden">
                <div className="flex p-4">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{game.name}</h3>
                      <button 
                        onClick={() => handleMarkAsPlaying(game.id)}
                        className="text-neon-purple hover:text-neon-purple/80 p-1 rounded"
                        title="Mark as playing"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-zinc-400">{game.platform}</p>
                    <Badge className={`mt-2 ${getStatusColor(game.status || '')}`}>
                      {getStatusLabel(game.status || '')}
                    </Badge>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{game.progress}%</span>
                      </div>
                      <Progress value={game.progress} className="h-1.5 bg-black/40" />
                    </div>
                    
                    {game.estimatedTime && (
                      <p className="text-xs text-zinc-500 mt-2">
                        Est. {game.estimatedTime}h to complete
                      </p>
                    )}
                    
                    {game.notes && (
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{game.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="px-4 pb-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`progress-${game.id}`} className="text-xs flex justify-between">
                        <span>Update Progress</span>
                        <span>{game.progress}%</span>
                      </Label>
                      <Slider 
                        id={`progress-${game.id}`}
                        min={0} 
                        max={100} 
                        step={1} 
                        value={[game.progress || 0]}
                        onValueChange={(values) => handleUpdateProgress(game.id, values[0])}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleRemoveGame(game.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ListChecks className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your backlog is empty</h3>
            <p className="text-zinc-400 max-w-md mx-auto mb-6">
              Add games you own but haven't completed to track your progress
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

export default Backlog;
