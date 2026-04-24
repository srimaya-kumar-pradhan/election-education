/**
 * ErrorBoundary Component
 *
 * React error boundary that catches unhandled JavaScript errors
 * in the component tree and displays a user-friendly fallback UI
 * instead of crashing the entire application.
 *
 * This prevents a single component failure from taking down
 * the whole app — critical for production reliability.
 */

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error, errorInfo) {
    /* Log error details for debugging — do NOT log user data */
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="error-boundary"
          role="alert"
          aria-live="assertive"
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
            style={{
              fontSize: '4rem',
              marginBottom: '1rem',
            }}
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
            We're sorry — VoteWise ran into an unexpected issue.
            Your data is safe. Try refreshing the page or going back to the home page.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReload}
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
        </div>
      );
    }

    return this.props.children;
  }
}
