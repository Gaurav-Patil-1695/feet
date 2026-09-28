import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, className }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--elevation-1)',
    padding: 'var(--space-6)',
    ...style,
  };

  return (
    <div style={cardStyle} className={className}>
      {children}
    </div>
  );
};

export default Card;
