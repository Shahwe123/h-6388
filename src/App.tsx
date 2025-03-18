import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Documentation from "./pages/Documentation";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import LinkAccounts from "./pages/LinkAccounts";
import Leaderboard from "./pages/Leaderboard";
import Friends from "./pages/Friends";
import BetaLanding from "./pages/BetaLanding";
import Guides from "./pages/Guides";
import { Provider } from 'react-redux';
import store from './redux/store';
import { useEffect } from 'react';
import { supabase } from './integrations/supabase/client';
import { fetchUserData } from './redux/slices/userSlice';

function App() {
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      store.dispatch(fetchUserData(session))

      supabase.auth.onAuthStateChange((_event, session) => {
        store.dispatch(fetchUserData(session))
      })
    }

    getSession();
  }, [])
  return (
    <HelmetProvider>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/link-accounts" element={<LinkAccounts />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/beta" element={<BetaLanding />} />
            <Route path="/guides" element={<Guides />} />
          </Routes>
        </Router>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
