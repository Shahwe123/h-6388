
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell, Gamepad, Palette, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import SEO from "../components/SEO";

const Settings = () => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16">
      <SEO 
        title="Account Settings" 
        description="Manage your PlatinumPath settings, preferences, and linked accounts."
        url="/settings"
      />
      <div className="max-w-4xl mx-auto container-padding">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Account Settings</h1>
        
        <div className="glass-card rounded-xl overflow-hidden">
          <Tabs defaultValue="profile" className="w-full">
            <div className="sm:flex">
              <TabsList className="sm:flex-col sm:h-auto gap-1 p-2 bg-black/20 sm:w-64 sm:rounded-none">
                <TabsTrigger value="profile" className="justify-start w-full">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="connections" className="justify-start w-full">
                  <Gamepad className="mr-2 h-4 w-4" />
                  Connected Accounts
                </TabsTrigger>
                <TabsTrigger value="appearance" className="justify-start w-full">
                  <Palette className="mr-2 h-4 w-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="billing" className="justify-start w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </TabsTrigger>
              </TabsList>
              
              <div className="p-6 flex-1">
                <TabsContent value="profile" className="mt-0">
                  <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-right">
                        Username
                      </label>
                      <input 
                        defaultValue="GamerTag123" 
                        className="w-full px-4 py-2 rounded bg-black/70 border border-neutral-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-right">
                        Display Name
                      </label>
                      <input 
                        defaultValue="John Doe" 
                        className="w-full px-4 py-2 rounded bg-black/70 border border-neutral-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-right">
                        Email
                      </label>
                      <input 
                        defaultValue="john@example.com" 
                        className="w-full px-4 py-2 rounded bg-black/70 border border-neutral-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-right">
                        Bio
                      </label>
                      <textarea 
                        className="w-full rounded bg-black/70 border border-neutral-700 p-3 text-white"
                        rows={4}
                        defaultValue="Trophy hunter and achievement collector. I love completing games 100%!"
                      />
                    </div>
                    <Button onClick={handleSave} className="bg-gradient-game">Save Changes</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Current Password
                      </label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 rounded bg-black/70 border border-neutral-700 text-white" 
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        New Password
                      </label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 rounded bg-black/70 border border-neutral-700 text-white" 
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Confirm New Password
                      </label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 rounded bg-black/70 border border-neutral-700 text-white"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-neutral-400">Add an extra layer of security to your account</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button onClick={handleSave} className="bg-gradient-game">Update Security</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-neutral-400">Receive emails about your account activity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div>
                        <h3 className="font-medium">Friend Requests</h3>
                        <p className="text-sm text-neutral-400">Get notified when someone sends you a friend request</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div>
                        <h3 className="font-medium">Achievement Updates</h3>
                        <p className="text-sm text-neutral-400">Get notified when friends earn new achievements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-neutral-400">Receive updates on new features and offers</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <Button onClick={handleSave} className="bg-gradient-game">Save Preferences</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="connections" className="mt-0">
                  <h2 className="text-2xl font-bold mb-4">Connected Gaming Accounts</h2>
                  <div className="space-y-4">
                    <p className="text-neutral-300 mb-4">
                      Manage your connected gaming accounts. Adding your accounts allows us to track your achievements.
                    </p>
                    
                    <div className="bg-black/20 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.5 10.5C20.5 14.88 17.9 18.35 14 19.54V17.31C14 16.22 13.36 15.23 12.37 14.79L11 14.17V11.5C11 11.03 11.22 10.61 11.57 10.33L14.89 7.84C15.33 7.5 15.67 7.09 15.93 6.61C16.18 6.13 16.31 5.61 16.31 5.08V3H20.38C20.44 3.16 20.5 3.32 20.5 3.5V10.5Z" fill="currentColor"/>
                            <path d="M18.5 6.5V11.67C18.5 12.7 17.58 13.6 16.27 14.39C15.39 14.92 14.32 15.31 13.15 15.54C12.85 15.6 12.56 15.66 12.27 15.71C11.9 15.79 11.52 15.83 11.13 15.87V17.31C11.13 16.36 10.62 15.51 9.79 15.15L7.79 14.35C7.51 14.25 7.27 14.07 7.1 13.84C6.92 13.61 6.82 13.33 6.82 13.05V12.39C6.82 11.92 7.05 11.49 7.43 11.22L9.57 9.67C9.93 9.4 10.13 8.98 10.13 8.54V3.5H13.67V5.08C13.67 5.39 13.59 5.69 13.45 5.97C13.31 6.24 13.11 6.47 12.86 6.66L9.54 9.15C8.86 9.67 8.45 10.49 8.45 11.37V12.16L7.37 12.67C7.08 12.8 6.87 13.07 6.82 13.39L4.14 14.48C3.69 14.68 3.3 15.01 3.03 15.42C2.74 15.83 2.59 16.32 2.59 16.81V18.51C2.59 19.01 2.74 19.49 3.03 19.91C3.3 20.32 3.69 20.65 4.14 20.85L9.03 22.96C9.48 23.16 9.97 23.24 10.47 23.18C10.96 23.13 11.43 22.95 11.83 22.67C12.24 22.94 12.7 23.13 13.19 23.18C13.68 23.24 14.17 23.16 14.63 22.96L19.51 20.85C19.96 20.65 20.35 20.32 20.63 19.91C20.91 19.49 21.06 19.01 21.06 18.51V16.81C21.06 16.32 20.91 15.83 20.63 15.42C20.35 15.01 19.96 14.68 19.51 14.48L18.5 14.02V6.5Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">PlayStation Network</h3>
                          <p className="text-xs text-neutral-400">Connected as PSN_GamerTag</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.55953 2C4.71361 2 4 2.71361 4 3.55953V20.4405C4 21.2864 4.71361 22 5.55953 22H18.4405C19.2864 22 20 21.2864 20 20.4405V3.55953C20 2.71361 19.2864 2 18.4405 2H5.55953ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Xbox Live</h3>
                          <p className="text-xs text-neutral-400">Connected as XboxGamerTag</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM17.707 16.704C17.601 16.847 17.471 16.971 17.324 17.069C17.177 17.168 17.015 17.241 16.845 17.285C16.675 17.329 16.5 17.344 16.326 17.329C16.151 17.314 15.981 17.27 15.823 17.199C13.473 16.133 10.695 15.726 6.923 16.42C6.574 16.48 6.215 16.401 5.929 16.2C5.786 16.1 5.662 15.974 5.564 15.829C5.465 15.685 5.394 15.524 5.35 15.354C5.307 15.185 5.293 15.008 5.308 14.834C5.323 14.659 5.367 14.489 5.438 14.332C5.528 14.138 5.655 13.966 5.811 13.826C5.967 13.686 6.149 13.582 6.345 13.521C10.511 12.759 13.643 13.221 16.302 14.416C16.451 14.486 16.586 14.582 16.7 14.697C16.813 14.813 16.904 14.948 16.967 15.096C17.03 15.244 17.065 15.403 17.07 15.564C17.074 15.725 17.048 15.886 16.994 16.038C16.94 16.189 16.858 16.329 16.754 16.451L17.707 16.704V16.704Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Steam</h3>
                          <p className="text-xs text-neutral-400">Connected as SteamUser</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                    
                    <Button onClick={handleSave} className="bg-gradient-game">
                      <a href="/link-accounts">Manage Gaming Accounts</a>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <h2 className="text-2xl font-bold mb-4">Appearance Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Theme
                      </label>
                      <Select defaultValue="dark">
                        <SelectTrigger className="bg-black/30 border-neutral-700">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System Default</SelectItem>
                          <SelectItem value="dark">Dark Mode</SelectItem>
                          <SelectItem value="light">Light Mode</SelectItem>
                          <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Accent Color
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="w-10 h-10 rounded-full bg-purple-500 cursor-pointer ring-2 ring-offset-2 ring-offset-black ring-white"></div>
                        <div className="w-10 h-10 rounded-full bg-blue-500 cursor-pointer"></div>
                        <div className="w-10 h-10 rounded-full bg-green-500 cursor-pointer"></div>
                        <div className="w-10 h-10 rounded-full bg-red-500 cursor-pointer"></div>
                        <div className="w-10 h-10 rounded-full bg-yellow-500 cursor-pointer"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div>
                        <h3 className="font-medium">Reduce Motion</h3>
                        <p className="text-sm text-neutral-400">Minimize animations throughout the interface</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div>
                        <h3 className="font-medium">High Contrast Mode</h3>
                        <p className="text-sm text-neutral-400">Increase contrast for better visibility</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <Button onClick={handleSave} className="bg-gradient-game">Save Preferences</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="billing" className="mt-0">
                  <h2 className="text-2xl font-bold mb-4">Billing Settings</h2>
                  <div className="space-y-4">
                    <div className="bg-black/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Current Plan</h3>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold">Pro Gamer</p>
                          <p className="text-sm text-neutral-400">$9.99/month</p>
                        </div>
                        <Button variant="outline" size="sm">Change Plan</Button>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-6 bg-neutral-800 rounded mr-3 flex items-center justify-center">
                            <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="24" height="16" rx="2" fill="#252525"/>
                              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="#EB001B"/>
                              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="#F79E1B"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10Z" fill="#FF5F00"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Mastercard ending in 4242</p>
                            <p className="text-xs text-neutral-400">Expires 12/25</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Billing History</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm">May 01, 2024</p>
                          <p className="text-sm font-medium">$9.99</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Apr 01, 2024</p>
                          <p className="text-sm font-medium">$9.99</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">Mar 01, 2024</p>
                          <p className="text-sm font-medium">$9.99</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">View Full Billing History</Button>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
