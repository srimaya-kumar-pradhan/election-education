/**
 * VoteWise App — Root Application Component
 *
 * Responsibilities:
 * - Initializes routing via React Router
 * - Manages authentication state via useAuth hook
 * - Provides global layout (Navbar, BottomNav)
 * - Wraps the app in an ErrorBoundary for crash resilience
 * - Uses React.lazy for route-level code splitting (performance)
 *
 * This file only handles initialization and routing — all page logic
 * lives in individual page components under /pages.
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './utils/constants';

/* Layout Components (loaded eagerly — always visible) */
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

/* Page Components — lazy loaded for optimal bundle splitting */
const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Journey = lazy(() => import('./pages/Journey'));
const Eligibility = lazy(() => import('./pages/Eligibility'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Faq = lazy(() => import('./pages/Faq'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Profile = lazy(() => import('./pages/Profile'));

/* Styles */
import './styles/global.css';

/**
 * Inline fallback for lazy-loaded page transitions.
 * Renders a lightweight spinner to avoid layout shifts.
 * @returns {JSX.Element}
 */
function PageLoader() {
  return (
    <div className="page-container" role="status" aria-label="Loading page">
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <div className="app-loading-spinner" />
      </div>
    </div>
  );
}

/**
 * Root application component with routing and auth context
 * @returns {JSX.Element}
 */
export default function App() {
  const { user, userData, loading, signIn, signOut } = useAuth();

  /* Loading state — shown while Firebase Auth initializes */
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
    <ErrorBoundary>
      <ToastProvider>
      <Router>
        <div className="app">
          <Navbar user={user} onSignIn={signIn} onSignOut={signOut} />

          <main id="main-content" role="main">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route
                  path={ROUTES.HOME}
                  element={<Home user={user} onSignIn={signIn} />}
                />
                <Route
                  path={ROUTES.CHAT}
                  element={<Chat user={user} userData={userData} onSignIn={signIn} />}
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
            </Suspense>
          </main>

          <BottomNav />
        </div>
      </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}
