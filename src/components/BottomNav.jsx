/**
 * BottomNav Component
 * Mobile bottom navigation bar
 */

import { Link, useLocation } from 'react-router-dom';
import { ROUTES, NAV_LABELS } from '../utils/constants';
import './BottomNav.css';

const navItems = [
  { path: ROUTES.HOME, label: NAV_LABELS.HOME, icon: '🏠' },
  { path: ROUTES.CHAT, label: NAV_LABELS.CHAT, icon: '💬' },
  { path: ROUTES.JOURNEY, label: NAV_LABELS.JOURNEY, icon: '🗺️' },
  { path: ROUTES.FAQ, label: NAV_LABELS.FAQ, icon: '📋' },
  { path: ROUTES.PROFILE, label: NAV_LABELS.PROFILE, icon: '👤' },
];

/**
 * Bottom navigation bar for mobile devices
 */
export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="bottom-nav-icon-wrap">
              <span className="bottom-nav-icon" aria-hidden="true">{item.icon}</span>
            </div>
            <span className="bottom-nav-label">{item.label}</span>
            {isActive && <span className="bottom-nav-indicator" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}
