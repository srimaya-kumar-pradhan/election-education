/**
 * Timeline Page
 * Election phase timeline viewer with status indicators
 */

import { useFirestore } from '../hooks/useFirestore';
import { TIMELINE_STATUS } from '../utils/constants';
import { formatTimestamp } from '../utils/validators';
import './Timeline.css';

/**
 * Vertical election timeline component
 */
export default function Timeline() {
  const { data: phases, loading } = useFirestore('timelinePhases');

  if (loading) {
    return (
      <div className="timeline-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
        <div className="page-header">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton skeleton-card" style={{ height: '100px', marginBottom: '16px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="timeline-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
      <div className="page-header animate-fadeInDown">
        <h1 className="page-title">Election Timeline</h1>
        <p className="page-subtitle">
          Track election phases, important dates, and upcoming deadlines
        </p>
      </div>

      {/* Legend */}
      <div className="timeline-legend" aria-label="Timeline status legend">
        <div className="timeline-legend-item">
          <span className="timeline-legend-dot completed" aria-hidden="true" />
          <span>Completed</span>
        </div>
        <div className="timeline-legend-item">
          <span className="timeline-legend-dot active" aria-hidden="true" />
          <span>Active</span>
        </div>
        <div className="timeline-legend-item">
          <span className="timeline-legend-dot upcoming" aria-hidden="true" />
          <span>Upcoming</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline stagger-children" role="list" aria-label="Election timeline">
        {phases.map((phase, idx) => (
          <div
            key={phase.id}
            className={`timeline-item ${phase.status}`}
            role="listitem"
            aria-label={`Phase ${phase.phase}: ${phase.label} — ${phase.status}`}
          >
            {/* Line connector */}
            {idx < phases.length - 1 && (
              <div className={`timeline-connector ${phase.status}`} aria-hidden="true" />
            )}

            {/* Dot */}
            <div className={`timeline-dot ${phase.status}`} aria-hidden="true">
              {phase.status === TIMELINE_STATUS.COMPLETED ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              ) : phase.status === TIMELINE_STATUS.ACTIVE ? (
                <span className="timeline-dot-pulse" />
              ) : (
                <span className="timeline-dot-inner" />
              )}
            </div>

            {/* Content */}
            <div className="timeline-content card">
              <div className="timeline-content-header">
                <div>
                  <span className={`badge badge-${phase.status === 'completed' ? 'success' : phase.status === 'active' ? 'info' : 'warning'}`}>
                    Phase {phase.phase}
                  </span>
                  <h3 className="timeline-label">{phase.label}</h3>
                </div>
                <time className="timeline-date" dateTime={phase.date}>
                  {new Date(phase.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <p className="timeline-description">{phase.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
