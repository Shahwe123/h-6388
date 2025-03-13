
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import Leaderboard from './pages/Leaderboard';
import LinkAccounts from './pages/LinkAccounts';
import BetaLanding from './pages/BetaLanding';
import AuthRequired from './components/AuthRequired';
import './App.css';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/beta" element={<BetaLanding />} />
        <Route 
          path="/profile" 
          element={
            <AuthRequired>
              <Profile />
            </AuthRequired>
          } 
        />
        <Route 
          path="/friends" 
          element={
            <AuthRequired>
              <Friends />
            </AuthRequired>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <AuthRequired>
              <Settings />
            </AuthRequired>
          } 
        />
        <Route 
          path="/leaderboard" 
          element={
            <AuthRequired>
              <Leaderboard />
            </AuthRequired>
          } 
        />
        <Route 
          path="/link-accounts" 
          element={
            <AuthRequired>
              <LinkAccounts />
            </AuthRequired>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
