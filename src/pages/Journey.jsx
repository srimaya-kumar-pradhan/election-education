/**
 * Journey Page
 * Step-by-step guided election journey with progress tracking
 */

import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { logAnalyticsEvent } from '../services/firebase';
import { ANALYTICS_EVENTS } from '../utils/constants';
import './Journey.css';

/**
 * Guided election journey flow component
 */
export default function Journey() {
  const { data: steps, loading } = useFirestore('journeySteps');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentStep = steps[currentStepIdx];
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((currentStepIdx + 1) / totalSteps) * 100 : 0;

  const goNext = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx((i) => i + 1);
      logAnalyticsEvent(ANALYTICS_EVENTS.JOURNEY_STEP_VIEWED, { step: currentStepIdx + 2 });
    } else {
      setCompleted(true);
      logAnalyticsEvent(ANALYTICS_EVENTS.JOURNEY_COMPLETED);
    }
  };

  const goPrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((i) => i - 1);
    }
  };

  const restart = () => {
    setCurrentStepIdx(0);
    setCompleted(false);
  };

  const iconMap = {
    how_to_reg: '📋',
    app_registration: '📝',
    location_on: '📍',
    badge: '🪪',
    how_to_vote: '🗳️',
  };

  if (loading) {
    return (
      <div className="journey-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
        <div className="journey-loading">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-card" style={{ height: '300px' }} />
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="journey-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
        <div className="journey-complete animate-bounceIn">
          <div className="journey-complete-icon" aria-hidden="true">🎉</div>
          <h1 className="journey-complete-title">You Are Ready to Vote!</h1>
          <p className="journey-complete-text">
            Congratulations! You have completed the voter journey guide.
            You now know all the steps to exercise your right to vote.
          </p>
          <div className="journey-complete-actions">
            <button className="btn btn-primary btn-lg" onClick={restart}>
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="journey-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
      <div className="page-header animate-fadeInDown">
        <h1 className="page-title">Your Voting Journey</h1>
        <p className="page-subtitle">
          Follow these steps to cast your vote with confidence
        </p>
      </div>

      {/* Progress Bar */}
      <div className="journey-progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
        <div className="journey-progress-bar">
          <div
            className="journey-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="journey-progress-text">
          Step {currentStepIdx + 1} of {totalSteps}
        </span>
      </div>

      {/* Step Indicators */}
      <div className="journey-indicators" aria-label="Journey steps">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            className={`journey-indicator ${idx === currentStepIdx ? 'active' : ''} ${idx < currentStepIdx ? 'completed' : ''}`}
            onClick={() => setCurrentStepIdx(idx)}
            aria-label={`Go to step ${idx + 1}: ${step.title}`}
            aria-current={idx === currentStepIdx ? 'step' : undefined}
          >
            {idx < currentStepIdx ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ) : (
              <span>{idx + 1}</span>
            )}
          </button>
        ))}
      </div>

      {/* Step Card */}
      {currentStep && (
        <div className="journey-card card card-elevated animate-fadeIn" key={currentStep.id}>
          <div className="journey-card-icon">
            <span aria-hidden="true">{iconMap[currentStep.icon] || '📋'}</span>
          </div>
          <h2 className="journey-card-title">{currentStep.title}</h2>
          <p className="journey-card-description">{currentStep.description}</p>

          {currentStep.ctaUrl && (
            <a
              href={currentStep.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm journey-card-cta"
            >
              {currentStep.ctaLabel || 'Learn More'} ↗
            </a>
          )}

          <div className="journey-card-actions">
            <button
              className="btn btn-ghost"
              onClick={goPrev}
              disabled={currentStepIdx === 0}
              aria-label="Previous step"
            >
              ← Previous
            </button>
            <button
              className="btn btn-primary"
              onClick={goNext}
              aria-label={currentStepIdx === totalSteps - 1 ? 'Complete journey' : 'Next step'}
              id="journey-next"
            >
              {currentStepIdx === totalSteps - 1 ? 'Complete ✓' : 'Next Step →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
