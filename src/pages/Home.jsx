/**
 * Home Page
 * Landing page with hero section, feature cards, and sign-in CTA
 */

import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '../utils/constants';
import './Home.css';

/**
 * @param {{ user: object|null, onSignIn: Function }} props
 */
export default function Home({ user, onSignIn }) {
  const features = [
    {
      id: 'chat',
      icon: '💬',
      title: 'AI Election Assistant',
      description: 'Ask any election question and get instant, accurate answers powered by Google Gemini AI.',
      link: ROUTES.CHAT,
      color: '#1A73E8',
    },
    {
      id: 'journey',
      icon: '🗺️',
      title: 'Voter Journey Guide',
      description: 'Step-by-step walkthrough from registration to casting your vote with confidence.',
      link: ROUTES.JOURNEY,
      color: '#34A853',
    },
    {
      id: 'eligibility',
      icon: '✅',
      title: 'Eligibility Checker',
      description: 'Instantly check if you are eligible to vote in Indian elections.',
      link: ROUTES.ELIGIBILITY,
      color: '#EA4335',
    },
    {
      id: 'timeline',
      icon: '📅',
      title: 'Election Timeline',
      description: 'Track election phases, important dates, and upcoming deadlines at a glance.',
      link: ROUTES.TIMELINE,
      color: '#FBBC04',
    },
    {
      id: 'faq',
      icon: '📋',
      title: 'Smart FAQ',
      description: 'Searchable collection of commonly asked election questions with detailed answers.',
      link: ROUTES.FAQ,
      color: '#4285F4',
    },
    {
      id: 'onboarding',
      icon: '🎓',
      title: 'First-Time Voter Guide',
      description: 'Visual walkthrough of what to expect at the polling booth — perfect for new voters.',
      link: ROUTES.ONBOARDING,
      color: '#9334E6',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero animate-fadeIn" aria-labelledby="hero-heading">
        <div className="hero-background" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div className="hero-content">
          <div className="hero-badge animate-fadeInDown">
            <span aria-hidden="true">🇮🇳</span>
            Empowering Every Indian Voter
          </div>

          <h1 id="hero-heading" className="hero-title">
            Your Smart Guide to
            <span className="hero-highlight"> Indian Elections</span>
          </h1>

          <p className="hero-description">{APP_DESCRIPTION}</p>

          <div className="hero-actions">
            {user ? (
              <Link to={ROUTES.CHAT} className="btn btn-primary btn-lg hero-cta" id="start-chatting-btn">
                <span aria-hidden="true">💬</span>
                Start Chatting with AI
              </Link>
            ) : (
              <button className="btn btn-primary btn-lg hero-cta" onClick={onSignIn} id="hero-sign-in-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Get Started with Google
              </button>
            )}
            <Link to={ROUTES.ELIGIBILITY} className="btn btn-secondary btn-lg" id="check-eligibility-btn">
              <span aria-hidden="true">✅</span>
              Check Eligibility
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">950M+</span>
              <span className="hero-stat-label">Eligible Voters</span>
            </div>
            <div className="hero-stat-divider" aria-hidden="true" />
            <div className="hero-stat">
              <span className="hero-stat-number">1M+</span>
              <span className="hero-stat-label">Polling Stations</span>
            </div>
            <div className="hero-stat-divider" aria-hidden="true" />
            <div className="hero-stat">
              <span className="hero-stat-number">543</span>
              <span className="hero-stat-label">Constituencies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" aria-labelledby="features-heading">
        <h2 id="features-heading" className="features-title">
          Everything You Need to Vote with Confidence
        </h2>
        <p className="features-subtitle">
          Powered by Google AI and Firebase — accessible, accurate, and always free
        </p>

        <div className="features-grid stagger-children">
          {features.map((feature) => (
            <Link
              key={feature.id}
              to={feature.link}
              className="feature-card card card-interactive"
              id={`feature-${feature.id}`}
              aria-label={feature.title}
            >
              <div
                className="feature-icon-container"
                style={{ '--feature-color': feature.color }}
              >
                <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <span className="feature-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="sr-only">Powered by Google</h2>
        <div className="trust-content card card-glass">
          <div className="trust-icon" aria-hidden="true">🛡️</div>
          <h3 className="trust-title">Built on Google's Trusted Platform</h3>
          <p className="trust-description">
            VoteWise is built entirely on Google services — Firebase for infrastructure,
            Gemini for AI intelligence, and Google Cloud for security. Your data is protected,
            and our AI is designed to be neutral, factual, and bias-free.
          </p>
          <div className="trust-badges">
            <div className="trust-badge">
              <span aria-hidden="true">🔒</span>
              <span>End-to-End Secure</span>
            </div>
            <div className="trust-badge">
              <span aria-hidden="true">🤖</span>
              <span>Gemini AI Powered</span>
            </div>
            <div className="trust-badge">
              <span aria-hidden="true">♿</span>
              <span>WCAG 2.1 AA</span>
            </div>
            <div className="trust-badge">
              <span aria-hidden="true">🌍</span>
              <span>Multilingual Ready</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
