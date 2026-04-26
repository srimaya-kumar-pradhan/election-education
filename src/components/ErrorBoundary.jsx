/**
 * @fileoverview Global React Error Boundary component.
 * Catches unhandled JavaScript errors in the component tree
 * and renders a graceful fallback UI instead of a white screen.
 * All route-level components must be wrapped in this boundary.
 *
 * @module ErrorBoundary
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { APP_NAME, ANALYTICS_EVENTS } from '../utils/constants';

/**
 * @description Class-based React Error Boundary.
 * Catches errors thrown during rendering, lifecycle methods,
 * and constructors of any child component. Displays a recovery
 * UI and logs errors to Firebase Analytics in production.
 *
 * @param {React.ReactNode} props.children - Components to protect
 * @param {React.ReactNode} [props.fallback] - Custom fallback UI
 *
 * @example
 * <ErrorBoundary>
 *   <ChatPage />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      errorId: null,
    };
    this.handleReload = this.handleReload.bind(this);
    this.handleGoHome = this.handleGoHome.bind(this);
  }

  /**
   * @description React lifecycle — updates state when child throws.
   * @param {Error} error - The error that was thrown
   * @returns {{ hasError: boolean, errorMessage: string, errorId: string }}
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
      errorId: Date.now().toString(36),
    };
  }

  /**
   * @description React lifecycle — called after error is captured.
   * Logs error to Firebase Analytics in production.
   * @param {Error} error - The error object
   * @param {React.ErrorInfo} errorInfo - Component stack trace
   * @returns {void}
   */
  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      /* Development: full details for debugging */
      console.group('🔴 ErrorBoundary caught an error:');
      console.error('Error:', error);
      console.error('Component stack:', errorInfo.componentStack);
      console.groupEnd();
    }
    /* Production: send minimal, non-PII data to Analytics */
    if (!import.meta.env.DEV) {
      try {
        import('firebase/analytics').then(({ getAnalytics, logEvent }) => {
          logEvent(getAnalytics(), ANALYTICS_EVENTS.APP_ERROR, {
            errorId: this.state.errorId,
            errorName: error.name,
            errorBoundary: 'GlobalBoundary',
          });
        });
      } catch {
        /* Silently fail — never throw from componentDidCatch */
      }
    }
  }

  /**
   * @description Reloads the current page to clear the error state.
   * @returns {void}
   */
  handleReload() {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  }

  /**
   * @description Navigates to home page to recover from error.
   * @returns {void}
   */
  handleGoHome() {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      /* If custom fallback provided, use it */
      if (this.props.fallback) {
        return this.props.fallback;
      }

      /* Default accessible fallback UI */
      return (
        <div
          className="error-boundary"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--color-background, #F0F4F9)',
            fontFamily: 'var(--font-primary, Inter, sans-serif)',
          }}
        >
          <div
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
            aria-hidden="true"
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-text-primary, #1F2937)',
              marginBottom: '0.5rem',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary, #6B7280)',
              marginBottom: '2rem',
              maxWidth: '480px',
              lineHeight: 1.6,
            }}
          >
            We&apos;re sorry — {APP_NAME} ran into an unexpected issue.
            Your data is safe. Try refreshing the page or going back to the home page.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReload}
              type="button"
              aria-label="Reload the application to recover from error"
              className="btn btn-primary"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #1A73E8, #1967D2)',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                minHeight: '48px',
              }}
            >
              Refresh Page
            </button>
            <button
              onClick={this.handleGoHome}
              type="button"
              aria-label="Go to home page"
              className="btn btn-secondary"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                background: 'white',
                color: '#1A73E8',
                border: '1.5px solid #AECBFA',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                minHeight: '48px',
              }}
            >
              Go to Home
            </button>
          </div>

          {import.meta.env.DEV && (
            <details
              style={{
                marginTop: '24px',
                maxWidth: '600px',
                textAlign: 'left',
                fontSize: '12px',
                color: '#9aa0a6',
              }}
            >
              <summary
                style={{ cursor: 'pointer' }}
                aria-label="Show technical error details"
              >
                Technical details (dev only)
              </summary>
              <pre style={{ marginTop: '8px', overflow: 'auto' }}>
                {this.state.errorMessage}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** Components to wrap and protect from unhandled errors */
  children: PropTypes.node.isRequired,
  /** Optional custom fallback UI to show on error */
  fallback: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  fallback: null,
};

export default ErrorBoundary;
