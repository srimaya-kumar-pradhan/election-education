/**
 * Eligibility Page
 * Voter eligibility checker with form and result display
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { checkEligibility, validateEligibilityForm } from '../utils/validators';
import { updateUserDocument, logAnalyticsEvent } from '../services/firebase';
import {
  CITIZENSHIP_OPTIONS,
  RESIDENCE_OPTIONS,
  ANALYTICS_EVENTS,
  ROUTES,
} from '../utils/constants';
import './Eligibility.css';

/**
 * @param {{ user: object|null }} props
 */
export default function Eligibility({ user }) {
  const [formData, setFormData] = useState({
    age: '',
    citizenship: '',
    residenceStatus: '',
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      age: parseInt(formData.age, 10),
      citizenship: formData.citizenship,
      residenceStatus: formData.residenceStatus,
    };

    const validation = validateEligibilityForm(data);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsChecking(true);
    setResult(null);

    /* Simulate API call delay for UX */
    await new Promise((r) => setTimeout(r, 800));

    const eligibilityResult = checkEligibility(data);
    setResult(eligibilityResult);
    setIsChecking(false);

    /* Save result to Firestore if authenticated */
    if (user?.uid) {
      try {
        await updateUserDocument(user.uid, {
          eligibilityResult: {
            ...eligibilityResult,
            checkedAt: new Date().toISOString(),
            inputs: data,
          },
        });
      } catch (err) {
        console.error('Error saving eligibility result:', err);
      }
    }

    logAnalyticsEvent(ANALYTICS_EVENTS.ELIGIBILITY_CHECKED, {
      eligible: eligibilityResult.eligible,
    });
  };

  const handleReset = () => {
    setFormData({ age: '', citizenship: '', residenceStatus: '' });
    setErrors({});
    setResult(null);
  };

  return (
    <div className="eligibility-page page-container" style={{ marginTop: 'var(--nav-height)' }}>
      <div className="page-header animate-fadeInDown">
        <h1 className="page-title">Eligibility Checker</h1>
        <p className="page-subtitle">
          Check if you are eligible to vote in Indian elections
        </p>
      </div>

      <div className="eligibility-content">
        {/* Form */}
        {!result ? (
          <form className="eligibility-form card card-elevated animate-fadeInUp" onSubmit={handleSubmit}>
            <div className="eligibility-form-icon" aria-hidden="true">✅</div>
            <h2 className="eligibility-form-title">Enter Your Details</h2>

            {/* Age Input */}
            <div className="form-group">
              <label htmlFor="age-input" className="input-label">
                Your Age
              </label>
              <input
                id="age-input"
                type="number"
                className={`input-field ${errors.age ? 'input-error' : ''}`}
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Enter your age"
                min="1"
                max="120"
                aria-describedby={errors.age ? 'age-error' : undefined}
              />
              {errors.age && (
                <span id="age-error" className="error-text" role="alert">{errors.age}</span>
              )}
            </div>

            {/* Citizenship Dropdown */}
            <div className="form-group">
              <label htmlFor="citizenship-input" className="input-label">
                Citizenship
              </label>
              <select
                id="citizenship-input"
                className={`input-field ${errors.citizenship ? 'input-error' : ''}`}
                value={formData.citizenship}
                onChange={(e) => handleChange('citizenship', e.target.value)}
                aria-describedby={errors.citizenship ? 'citizenship-error' : undefined}
              >
                <option value="">Select citizenship status</option>
                {CITIZENSHIP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.citizenship && (
                <span id="citizenship-error" className="error-text" role="alert">{errors.citizenship}</span>
              )}
            </div>

            {/* Residence Dropdown */}
            <div className="form-group">
              <label htmlFor="residence-input" className="input-label">
                Residence Status
              </label>
              <select
                id="residence-input"
                className={`input-field ${errors.residenceStatus ? 'input-error' : ''}`}
                value={formData.residenceStatus}
                onChange={(e) => handleChange('residenceStatus', e.target.value)}
                aria-describedby={errors.residenceStatus ? 'residence-error' : undefined}
              >
                <option value="">Select residence status</option>
                {RESIDENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.residenceStatus && (
                <span id="residence-error" className="error-text" role="alert">{errors.residenceStatus}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg eligibility-submit"
              disabled={isChecking}
              id="check-eligibility-submit"
            >
              {isChecking ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Checking...
                </>
              ) : (
                'Check Eligibility'
              )}
            </button>
          </form>
        ) : (
          /* Result Card */
          <div className={`eligibility-result card card-elevated animate-bounceIn ${result.eligible ? 'result-eligible' : 'result-ineligible'}`}>
            <div className="result-icon" aria-hidden="true">
              {result.eligible ? '✅' : '❌'}
            </div>
            <h2 className="result-title">{result.reason}</h2>
            <p className="result-details">{result.details}</p>

            {result.eligible && (
              <div className="result-actions">
                <Link to={ROUTES.JOURNEY} className="btn btn-primary">
                  Start Voter Journey →
                </Link>
                <Link to={ROUTES.CHAT} className="btn btn-secondary">
                  Ask AI Assistant 💬
                </Link>
              </div>
            )}

            {!result.eligible && (
              <div className="result-actions">
                <Link to={ROUTES.FAQ} className="btn btn-secondary">
                  Read FAQs →
                </Link>
              </div>
            )}

            <button
              className="btn btn-ghost result-reset"
              onClick={handleReset}
            >
              Check Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
