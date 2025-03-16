
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserType {
  id: string;
  name: string;  // We'll still keep this field in our interface
  email: string;
  avatar: string;
  is_private: boolean;
}

interface UserContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Load user data from session when component mounts
    const loadUserData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (data) {
          setUser({
            id: data.id,
            name: data.username || '', // Use username property instead of name
            email: data.email || sessionData.session.user.email || '',
            avatar: data.avatar_url || '',
            is_private: data.is_private || false,
          });
        }
      }
    };
    
    loadUserData();
  }, []);

  const value = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
