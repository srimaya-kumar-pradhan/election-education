/**
 * Profile Page
 * User information, settings, and account management
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import './Profile.css';

/**
 * @param {{ user: object|null, userData: object|null, onSignIn: Function, onSignOut: Function }} props
 */
export default function Profile({ user, userData, onSignIn, onSignOut }) {
  if (!user) {
    return (
      <div className="profile-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
        <div className="profile-auth-gate animate-fadeIn">
          <div className="profile-auth-icon" aria-hidden="true">👤</div>
          <h1 className="profile-auth-title">Your Profile</h1>
          <p className="profile-auth-text">
            Sign in to access your profile, save your progress, and personalize your experience.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onSignIn} id="profile-sign-in">
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { label: 'AI Chat', icon: '💬', path: ROUTES.CHAT, desc: 'Ask election questions' },
    { label: 'Voter Journey', icon: '🗺️', path: ROUTES.JOURNEY, desc: 'Step-by-step guide' },
    { label: 'Eligibility', icon: '✅', path: ROUTES.ELIGIBILITY, desc: 'Check if you can vote' },
    { label: 'Timeline', icon: '📅', path: ROUTES.TIMELINE, desc: 'Election phases' },
    { label: 'FAQ', icon: '📋', path: ROUTES.FAQ, desc: 'Common questions' },
    { label: 'First-Time Guide', icon: '🎓', path: ROUTES.ONBOARDING, desc: 'Booth walkthrough' },
  ];

  return (
    <div className="profile-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
      {/* Profile Card */}
      <div className="profile-card card card-elevated animate-fadeInUp">
        <div className="profile-header">
          <img
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=1A73E8&color=fff&size=96`}
            alt={`${user.displayName || 'User'}'s avatar`}
            className="profile-avatar"
            referrerPolicy="no-referrer"
          />
          <div className="profile-info">
            <h1 className="profile-name">{user.displayName || 'User'}</h1>
            <p className="profile-email">{user.email}</p>
            {userData?.isFirstTimeVoter && (
              <span className="badge badge-info">First-Time Voter</span>
            )}
          </div>
        </div>

        {/* Eligibility Result */}
        {userData?.eligibilityResult && (
          <div className={`profile-eligibility ${userData.eligibilityResult.eligible ? 'eligible' : 'ineligible'}`}>
            <span className="profile-eligibility-icon" aria-hidden="true">
              {userData.eligibilityResult.eligible ? '✅' : '❌'}
            </span>
            <div>
              <strong>{userData.eligibilityResult.reason}</strong>
              <p className="profile-eligibility-date">
                Checked on {new Date(userData.eligibilityResult.checkedAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="profile-section">
        <h2 className="section-title">Quick Access</h2>
        <div className="profile-links stagger-children">
          {quickLinks.map((link) => (
            <Link key={link.path} to={link.path} className="profile-link card card-interactive">
              <span className="profile-link-icon" aria-hidden="true">{link.icon}</span>
              <div className="profile-link-content">
                <span className="profile-link-label">{link.label}</span>
                <span className="profile-link-desc">{link.desc}</span>
              </div>
              <span className="profile-link-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <div className="profile-signout">
        <button className="btn btn-ghost" onClick={onSignOut} id="profile-sign-out">
          Sign Out
        </button>
      </div>
    </div>
  );
}
