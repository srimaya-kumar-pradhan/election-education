/**
 * @fileoverview Reusable skeleton loading component.
 * Shows animated placeholder UI while async data loads.
 * Reduces Cumulative Layout Shift (CLS) and communicates
 * loading state accessibly to screen readers.
 * @module Skeleton
 */

import PropTypes from 'prop-types';

/**
 * @description Animated skeleton placeholder that mimics
 * the shape of content while it is being fetched.
 * Choose the variant that best matches the content shape.
 *
 * @param {("text"|"card"|"circle"|"list"|"line")} props.variant
 *   The shape of the skeleton placeholder
 * @param {number} [props.count=1] - Number of placeholders to show
 * @param {string} [props.className] - Additional CSS class names
 * @param {string} [props.label="Loading content"]
 *   Custom aria-label for screen reader announcement
 *
 * @returns {JSX.Element} The skeleton placeholder component
 *
 * @example
 * // Show 3 list item placeholders while FAQ loads
 * <Skeleton variant="list" count={3} />
 *
 * @example
 * // Show a card placeholder while journey step loads
 * <Skeleton variant="card" />
 */
const Skeleton = ({
  variant = 'text',
  count = 1,
  className = '',
  label = 'Loading content',
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  const shapeStyles = {
    text: { height: '16px', marginBottom: '8px', width: '100%', borderRadius: '4px' },
    line: { height: '14px', marginBottom: '6px', width: '75%', borderRadius: '4px' },
    card: { height: '128px', marginBottom: '16px', width: '100%', borderRadius: '12px' },
    circle: { height: '48px', width: '48px', borderRadius: '50%', marginBottom: '0' },
    list: { height: '72px', marginBottom: '12px', width: '100%', borderRadius: '8px' },
  };

  const pulseStyle = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeletonPulse 1.5s ease-in-out infinite',
  };

  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div
        className={className}
        role="status"
        aria-label={label}
        aria-busy="true"
        aria-live="polite"
      >
        {items.map((i) => (
          <div
            key={i}
            style={{
              ...pulseStyle,
              ...(shapeStyles[variant] || shapeStyles.text),
            }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">{label}...</span>
      </div>
    </>
  );
};

Skeleton.propTypes = {
  /** The shape variant of the skeleton placeholder */
  variant: PropTypes.oneOf(['text', 'card', 'circle', 'list', 'line']),
  /** Number of skeleton items to render */
  count: PropTypes.number,
  /** Additional CSS class names */
  className: PropTypes.string,
  /** Screen reader label for the loading state */
  label: PropTypes.string,
};

Skeleton.defaultProps = {
  variant: 'text',
  count: 1,
  className: '',
  label: 'Loading content',
};

export default Skeleton;
