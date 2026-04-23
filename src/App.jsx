/**
 * VoteWise App — Root Application Component
 * Manages routing, authentication state, and global layout
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './utils/constants';

/* Layout Components */
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

/* Page Components */
import Home from './pages/Home';
import Chat from './pages/Chat';
import Journey from './pages/Journey';
import Eligibility from './pages/Eligibility';
import Timeline from './pages/Timeline';
import Faq from './pages/Faq';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';

/* Styles */
import './styles/global.css';

/**
 * Root application component with routing and auth context
 */
export default function App() {
  const { user, userData, loading, signIn, signOut, isFirstTimeVoter } = useAuth();

  /* Loading state */
  if (loading) {
    return (
      <div className="app-loading" role="status" aria-label="Loading application">
        <div className="app-loading-content">
          <span className="app-loading-icon" aria-hidden="true">🗳️</span>
          <h1 className="app-loading-title">VoteWise</h1>
          <div className="app-loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} onSignIn={signIn} onSignOut={signOut} />

        <main id="main-content" role="main">
          <Routes>
            <Route
              path={ROUTES.HOME}
              element={<Home user={user} onSignIn={signIn} />}
            />
            <Route
              path={ROUTES.CHAT}
              element={<Chat user={user} onSignIn={signIn} />}
            />
            <Route
              path={ROUTES.JOURNEY}
              element={<Journey />}
            />
            <Route
              path={ROUTES.ELIGIBILITY}
              element={<Eligibility user={user} />}
            />
            <Route
              path={ROUTES.TIMELINE}
              element={<Timeline />}
            />
            <Route
              path={ROUTES.FAQ}
              element={<Faq />}
            />
            <Route
              path={ROUTES.ONBOARDING}
              element={<Onboarding user={user} />}
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <Profile
                  user={user}
                  userData={userData}
                  onSignIn={signIn}
                  onSignOut={signOut}
                />
              }
            />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
}
