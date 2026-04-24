/**
 * Versatile loader component with multiple visual modes.
 *
 * @param {'spinner'|'skeleton'|'dots'} variant - Visual style
 * @param {string} text - Optional loading text
 * @param {'sm'|'md'|'lg'} size - Size preset
 */
export default function Loader({ variant = 'spinner', text, size = 'md' }) {
  const sizes = { sm: 24, md: 36, lg: 56 };
  const px = sizes[size];

  if (variant === 'skeleton') {
    return (
      <div className="loader-skeleton" role="status" aria-label="Loading content">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" style={{ width: '100%' }} />
        <div className="skeleton skeleton-text" style={{ width: '80%' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="loader-dots" role="status" aria-label="Loading">
        <span className="loader-dot" />
        <span className="loader-dot" />
        <span className="loader-dot" />
        {text && <span className="loader-text">{text}</span>}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="loader-spinner-wrap" role="status" aria-label="Loading">
      <div
        className="loader-spinner"
        style={{ width: px, height: px }}
      />
      {text && <span className="loader-text">{text}</span>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
