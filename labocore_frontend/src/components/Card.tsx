import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, style }) => {
  return (
    <div className={`card ${className}`} style={{ padding: noPadding ? '0' : undefined, ...style }}>
      {children}
    </div>
  );
};

export default Card;
