
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Heart, Bookmark, Clock, ListChecks, Search, Plus, X, ExternalLink, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types/game';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Define new types for wishlist and backlog
interface WishlistItem {
  id: number;
  name: string;
  platform: string;
  image: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  addedDate: string;
  releaseDate?: string;
  isReleased: boolean;
}

interface BacklogItem {
  id: number;
  name: string;
  platform: string;
  image: string;
  status: 'not-started' | 'in-progress' | 'on-hold' | 'almost-complete';
  estimatedHours?: number;
  progress: number;
  notes?: string;
  lastPlayed?: string;
}

// Mock data until we have real data
const mockWishlistItems: WishlistItem[] = [
  {
    id: 101,
    name: "Final Fantasy XVI",
    platform: "PlayStation",
    image: "https://placehold.co/120x160/000000/FFFFFF.png?text=FFXVI",
    priority: "high",
    notes: "Day one purchase when it comes to PC",
    addedDate: "2023-10-15",
    releaseDate: "2024-12-01",
    isReleased: false
  },
  {
    id: 102,
    name: "Elden Ring DLC",
    platform: "Steam",
    image: "https://placehold.co/120x160/000000/FFFFFF.png?text=Elden+Ring",
    priority: "high",
    addedDate: "2023-09-20",
    releaseDate: "2024-06-21",
    isReleased: true
  },
  {
    id: 103,
    name: "Starfield",
    platform: "Xbox",
    image: "https://placehold.co/120x160/000000/FFFFFF.png?text=Starfield",
    priority: "medium",
    notes: "Wait for sale",
    addedDate: "2023-08-10",
    isReleased: true
  }
];

const mockBacklogItems: BacklogItem[] = [
  {
    id: 201,
    name: "God of War Ragnarök",
    platform: "PlayStation",
    image: "https://placehold.co/120x160/000000/FFFFFF.png?text=GoW",
    status: "in-progress",
    estimatedHours: 40,
    progress: 45,
    lastPlayed: "2024-02-15",
    notes: "Stuck on Valkyrie Queen fight"
  },
  {
    id: 202,
    name: "Baldur's Gate 3",
    platform: "Steam",
    image: "https://placehold.co/120x160/000000/FFFFFF.png?text=BG3",
    status: "in-progress",
    estimatedHours: 100,
    progress: 22,
    lastPlayed: "2024-03-10",
    notes: "Currently in Act 2"
  },
  {
    id: 203,
    name: "Hogwarts Legacy",
    platform: "Xbox",
    image: "https://placehold.co/120x160/000000/FFFFFF.png?text=Hogwarts",
    status: "not-started",
    estimatedHours: 50,
    progress: 0
  },
  {
    id: 204,
    name: "Resident Evil 4 Remake",
    platform: "PlayStation",
    image: "https://placehold.co/120x160/000000/FFFFFF.png?text=RE4",
    status: "almost-complete",
    estimatedHours: 25,
    progress: 85,
    lastPlayed: "2024-01-20",
    notes: "Need to finish Professional difficulty"
  }
];

const statusColors = {
  'not-started': 'bg-neutral-500',
  'in-progress': 'bg-blue-500',
  'on-hold': 'bg-yellow-500',
  'almost-complete': 'bg-green-500'
};

const priorityColors = {
  'high': 'bg-red-500',
  'medium': 'bg-yellow-500',
  'low': 'bg-blue-500'
};

const WishlistManager: React.FC = () => {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(mockWishlistItems);
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>(mockBacklogItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('priority');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPlatform, setNewItemPlatform] = useState('PlayStation');
  const [newItemPriority, setNewItemPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Filter and sort wishlist items
  const filteredWishlistItems = React.useMemo(() => {
    let filtered = wishlistItems;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(item => item.platform === platformFilter);
    }
    
    // Sort items
    return [...filtered].sort((a, b) => {
      if (selectedSort === 'name') {
        return a.name.localeCompare(b.name);
      } else if (selectedSort === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (selectedSort === 'date-added') {
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      } else if (selectedSort === 'release-date') {
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      }
      return 0;
    });
  }, [wishlistItems, searchTerm, platformFilter, selectedSort]);

  // Filter and sort backlog items
  const filteredBacklogItems = React.useMemo(() => {
    let filtered = backlogItems;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(item => item.platform === platformFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Sort items
    return [...filtered].sort((a, b) => {
      if (selectedSort === 'name') {
        return a.name.localeCompare(b.name);
      } else if (selectedSort === 'progress') {
        return b.progress - a.progress;
      } else if (selectedSort === 'last-played') {
        if (!a.lastPlayed) return 1;
        if (!b.lastPlayed) return -1;
        return new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime();
      } else if (selectedSort === 'status') {
        const statusOrder = { 'almost-complete': 0, 'in-progress': 1, 'on-hold': 2, 'not-started': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });
  }, [backlogItems, searchTerm, platformFilter, statusFilter, selectedSort]);

  // Handle adding a new item to wishlist
  const handleAddWishlistItem = () => {
    if (!newItemName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a game name",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: WishlistItem = {
      id: Math.floor(Math.random() * 10000),
      name: newItemName.trim(),
      platform: newItemPlatform,
      image: `https://placehold.co/120x160/000000/FFFFFF.png?text=${encodeURIComponent(newItemName.trim())}`,
      priority: newItemPriority,
      addedDate: new Date().toISOString().split('T')[0],
      isReleased: false
    };
    
    setWishlistItems([...wishlistItems, newItem]);
    setNewItemName('');
    setShowAddForm(false);
    
    toast({
      title: "Game Added",
      description: `${newItemName} has been added to your wishlist`,
    });
  };

  // Handle moving from wishlist to backlog
  const moveToBacklog = (item: WishlistItem) => {
    const backlogItem: BacklogItem = {
      id: item.id,
      name: item.name,
      platform: item.platform,
      image: item.image,
      status: 'not-started',
      progress: 0,
      notes: item.notes
    };
    
    setBacklogItems([...backlogItems, backlogItem]);
    setWishlistItems(wishlistItems.filter(i => i.id !== item.id));
    
    toast({
      title: "Moved to Backlog",
      description: `${item.name} has been moved to your backlog`,
    });
  };

  // Handle removing items
  const removeWishlistItem = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    toast({
      title: "Game Removed",
      description: "Game has been removed from your wishlist",
    });
  };
  
  const removeBacklogItem = (id: number) => {
    setBacklogItems(backlogItems.filter(item => item.id !== id));
    toast({
      title: "Game Removed",
      description: "Game has been removed from your backlog",
    });
  };

  // Handle updating backlog item status
  const updateBacklogItemStatus = (id: number, status: BacklogItem['status']) => {
    setBacklogItems(
      backlogItems.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
    
    toast({
      title: "Status Updated",
      description: "Game status has been updated",
    });
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="wishlist" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Wishlist</span>
          </TabsTrigger>
          <TabsTrigger value="backlog" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span>Backlog</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Controls shared between tabs */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search games..." 
                className="pl-10 w-[200px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select onValueChange={setPlatformFilter} value={platformFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="PlayStation">PlayStation</SelectItem>
                <SelectItem value="Xbox">Xbox</SelectItem>
                <SelectItem value="Steam">Steam</SelectItem>
                <SelectItem value="Switch">Switch</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={setSelectedSort} value={selectedSort}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="date-added">Date Added</SelectItem>
                <SelectItem value="release-date">Release Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="last-played">Last Played</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Wishlist ({filteredWishlistItems.length})</h2>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {showAddForm ? 'Cancel' : 'Add Game'}
            </Button>
          </div>
          
          {/* Add new game form */}
          {showAddForm && (
            <Card className="mb-6 glass-card">
              <CardHeader>
                <CardTitle>Add Game to Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Game Name</label>
                    <Input
                      placeholder="Enter game name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Platform</label>
                      <Select onValueChange={setNewItemPlatform} value={newItemPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PlayStation">PlayStation</SelectItem>
                          <SelectItem value="Xbox">Xbox</SelectItem>
                          <SelectItem value="Steam">Steam</SelectItem>
                          <SelectItem value="Switch">Switch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Priority</label>
                      <Select onValueChange={(value: any) => setNewItemPriority(value)} value={newItemPriority}>
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
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddWishlistItem}>Add to Wishlist</Button>
              </CardFooter>
            </Card>
          )}
          
          {filteredWishlistItems.length === 0 ? (
            <div className="text-center py-12 bg-black/20 rounded-lg">
              <Heart className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
              <h3 className="text-xl font-bold">Your Wishlist is Empty</h3>
              <p className="text-zinc-400 mt-2">
                Add games you're interested in to your wishlist.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWishlistItems.map(item => (
                <Card key={item.id} className="overflow-hidden glass-card hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <div className="shrink-0">
                      <img src={item.image} alt={item.name} className="w-[80px] h-[120px] object-cover" />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-lg line-clamp-1">{item.name}</h3>
                        <Badge className={`${priorityColors[item.priority]}`}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">{item.platform}</p>
                      
                      {item.releaseDate && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500">
                          <Calendar className="h-3 w-3" />
                          <span>Release: {item.releaseDate}</span>
                          {!item.isReleased && (
                            <Badge variant="outline" className="ml-1 text-xs">
                              Upcoming
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {item.notes && (
                        <p className="mt-2 text-xs text-zinc-400 line-clamp-2">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-black/30 p-2 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => removeWishlistItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => moveToBacklog(item)}
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      Move to Backlog
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Backlog Tab */}
        <TabsContent value="backlog">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Your Backlog ({filteredBacklogItems.length})</h2>
              <p className="text-sm text-zinc-400">Track your progress on games you own but haven't completed</p>
            </div>
            
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="almost-complete">Almost Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredBacklogItems.length === 0 ? (
            <div className="text-center py-12 bg-black/20 rounded-lg">
              <ListChecks className="h-16 w-16 mx-auto mb-4 text-neutral-600" />
              <h3 className="text-xl font-bold">Your Backlog is Empty</h3>
              <p className="text-zinc-400 mt-2">
                Add games you own but haven't completed to your backlog.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBacklogItems.map(item => (
                <Card key={item.id} className="overflow-hidden glass-card hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <div className="shrink-0">
                      <img src={item.image} alt={item.name} className="w-[90px] h-[120px] object-cover" />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-lg line-clamp-1">{item.name}</h3>
                        <Badge className={`${statusColors[item.status]}`}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">{item.platform}</p>
                      
                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-neon-purple"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {item.estimatedHours && (
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <Clock className="h-3 w-3" />
                            <span>Est. {item.estimatedHours} hours</span>
                          </div>
                        )}
                        
                        {item.lastPlayed && (
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <Calendar className="h-3 w-3" />
                            <span>Last played: {item.lastPlayed}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-2">
                    <div className="grid grid-cols-5 gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`h-8 p-1 text-xs ${item.status === 'not-started' ? 'bg-black/20' : ''}`}
                        onClick={() => updateBacklogItemStatus(item.id, 'not-started')}
                      >
                        Not Started
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`h-8 p-1 text-xs ${item.status === 'in-progress' ? 'bg-black/20' : ''}`}
                        onClick={() => updateBacklogItemStatus(item.id, 'in-progress')}
                      >
                        In Progress
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`h-8 p-1 text-xs ${item.status === 'on-hold' ? 'bg-black/20' : ''}`}
                        onClick={() => updateBacklogItemStatus(item.id, 'on-hold')}
                      >
                        On Hold
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`h-8 p-1 text-xs ${item.status === 'almost-complete' ? 'bg-black/20' : ''}`}
                        onClick={() => updateBacklogItemStatus(item.id, 'almost-complete')}
                      >
                        Almost Done
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 p-1 text-xs text-red-500"
                        onClick={() => removeBacklogItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WishlistManager;
