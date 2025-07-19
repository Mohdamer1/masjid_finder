import React from 'react';

const IslamicSpinner: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <div className="flex flex-col items-center justify-center">
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFD700"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: 'spin 1.5s linear infinite', display: 'block' }}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
    <style>{`
      @keyframes spin {
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default IslamicSpinner; 