import React from 'react';

function PrepSightLogo() {
  return (
    <span className="brand-mark" aria-label="PrepSight logo">
      <svg viewBox="0 0 36 36" className="brand-mark-icon" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="psGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#psGlow)" />
        <path d="M11 24V12h8c3 0 5 1.8 5 4.6S22 21 19 21h-4v3h-4zm4-6h3.4c1 0 1.7-.6 1.7-1.5s-.7-1.5-1.7-1.5H15V18z" fill="#F5F3FF" />
      </svg>
      <span className="brand-mark-text">PrepSight</span>
    </span>
  );
}

export default PrepSightLogo;
