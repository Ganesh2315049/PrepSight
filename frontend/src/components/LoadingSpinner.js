import React from 'react';

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export default LoadingSpinner;
