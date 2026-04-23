/**
 * Onboarding Page
 * First-time voter mode with animated card carousel
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BOOTH_STEPS, ROUTES, ANALYTICS_EVENTS } from '../utils/constants';
import { logAnalyticsEvent, updateUserDocument } from '../services/firebase';
import './Onboarding.css';

/**
 * @param {{ user: object|null }} props
 */
export default function Onboarding({ user }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const step = BOOTH_STEPS[currentStep];

  const goNext = () => {
    if (currentStep < BOOTH_STEPS.length - 1) {
      setCurrentStep((i) => i + 1);
    } else {
      setCompleted(true);
      logAnalyticsEvent(ANALYTICS_EVENTS.ONBOARDING_COMPLETED);
      if (user?.uid) {
        updateUserDocument(user.uid, { isFirstTimeVoter: false }).catch(console.error);
      }
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((i) => i - 1);
    }
  };

  if (completed) {
    return (
      <div className="onboarding-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
        <div className="onboarding-complete animate-bounceIn">
          <div className="onboarding-complete-icon" aria-hidden="true">🎓</div>
          <h1 className="onboarding-complete-title">You Are Booth-Ready!</h1>
          <p className="onboarding-complete-text">
            Now you know exactly what happens at the polling booth. Go vote with confidence!
          </p>
          <div className="onboarding-complete-actions">
            <Link to={ROUTES.JOURNEY} className="btn btn-primary btn-lg">
              Start Voter Journey 🗺️
            </Link>
            <Link to={ROUTES.CHAT} className="btn btn-secondary btn-lg">
              Ask AI Assistant 💬
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
      <div className="page-header animate-fadeInDown">
        <h1 className="page-title">First-Time Voter Guide</h1>
        <p className="page-subtitle">
          What to expect at the polling booth — step by step
        </p>
      </div>

      {/* Progress Dots */}
      <div className="onboarding-dots" aria-label="Steps">
        {BOOTH_STEPS.map((_, idx) => (
          <button
            key={idx}
            className={`onboarding-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
            onClick={() => setCurrentStep(idx)}
            aria-label={`Step ${idx + 1}`}
            aria-current={idx === currentStep ? 'step' : undefined}
          />
        ))}
      </div>

      {/* Step Card */}
      <div className="onboarding-card card card-elevated animate-fadeIn" key={currentStep}>
        <div className="onboarding-step-number">
          Step {currentStep + 1} of {BOOTH_STEPS.length}
        </div>
        <div className="onboarding-icon" aria-hidden="true">
          {step.icon}
        </div>
        <h2 className="onboarding-title">{step.title}</h2>
        <p className="onboarding-description">{step.description}</p>

        <div className="onboarding-actions">
          <button
            className="btn btn-ghost"
            onClick={goPrev}
            disabled={currentStep === 0}
            aria-label="Previous step"
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={goNext}
            aria-label={currentStep === BOOTH_STEPS.length - 1 ? 'Finish guide' : 'Next step'}
            id="onboarding-next"
          >
            {currentStep === BOOTH_STEPS.length - 1 ? 'Finish ✓' : 'Next →'}
          </button>
        </div>
      </div>

      {/* Chatbot Link */}
      <Link to={ROUTES.CHAT} className="onboarding-chatbot-link animate-fadeInUp">
        <span aria-hidden="true">💬</span>
        Ask the chatbot about booth procedures
      </Link>
    </div>
  );
}
