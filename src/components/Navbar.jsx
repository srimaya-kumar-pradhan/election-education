/**
 * Navbar Component
 * Top navigation bar with brand logo and auth controls
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES, APP_NAME } from '../utils/constants';
import './Navbar.css';

/**
 * @param {{ user: object|null, onSignIn: Function, onSignOut: Function }} props
 */
export default function Navbar({ user, onSignIn, onSignOut }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to={ROUTES.HOME} className="navbar-brand" aria-label="VoteWise Home">
          <span className="navbar-logo" aria-hidden="true">🗳️</span>
          <span className="navbar-title">{APP_NAME}</span>
        </Link>

        {/* Desktop nav links */}
        <div className="navbar-links" role="menubar">
          {[
            { path: ROUTES.HOME, label: t('nav.home', 'Home'), icon: '🏠' },
            { path: ROUTES.CHAT, label: t('nav.chat', 'Chat'), icon: '💬' },
            { path: ROUTES.JOURNEY, label: t('nav.journey', 'Journey'), icon: '🗺️' },
            { path: ROUTES.TIMELINE, label: t('nav.timeline', 'Timeline'), icon: '📅' },
            { path: ROUTES.FAQ, label: t('nav.faq', 'FAQ'), icon: '📋' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
              role="menuitem"
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              <span className="navbar-link-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth section */}
        <div className="navbar-auth">
          <button 
            className="btn btn-ghost btn-sm navbar-lang" 
            onClick={toggleLanguage}
            aria-label="Toggle Language"
            title="Switch Language"
          >
            {i18n.language.startsWith('en') ? 'हि' : 'EN'}
          </button>
          {user ? (
            <div className="navbar-user">
              <Link to={ROUTES.PROFILE} className="navbar-avatar-link" aria-label="Profile">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=1A73E8&color=fff`}
                  alt={`${user.displayName || 'User'}'s avatar`}
                  className="navbar-avatar"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <button
                className="btn btn-ghost btn-sm navbar-signout"
                onClick={onSignOut}
                aria-label="Sign out"
              >
                {t('nav.signOut', 'Sign Out')}
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={onSignIn}
              id="sign-in-button"
              aria-label="Sign in with Google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('nav.signIn', 'Sign In')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
