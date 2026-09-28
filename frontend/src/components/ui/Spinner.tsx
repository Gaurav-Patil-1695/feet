import React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  color?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
};

const strokeWidthMap: Record<SpinnerSize, number> = {
  sm: 2,
  md: 2.5,
  lg: 3,
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label = 'Loading…',
  color,
}) => {
  const px = sizeMap[size];
  const strokeWidth = strokeWidthMap[size];
  const radius = (px - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * 0.25;

  const svgStyle: React.CSSProperties = {
    display: 'block',
    animation: 'spinner-rotate 0.75s linear infinite',
    color: color ?? 'var(--color-primary)',
    flexShrink: 0,
  };

  return (
    <>
      <style>{`
        @keyframes spinner-rotate {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <svg
        role="status"
        aria-label={label}
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        style={svgStyle}
      >
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity={0.25}
        />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={0}
        />
      </svg>
    </>
  );
};

export default Spinner;
