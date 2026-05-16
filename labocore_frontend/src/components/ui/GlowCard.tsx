import React, { useRef } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  style?: React.CSSProperties;
  /** Disable the spotlight hover — use for static/layout cards */
  noGlow?: boolean;
  glowColor?: string;
  onClick?: () => void;
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  noPadding = false,
  style,
  noGlow = false,
  glowColor,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (noGlow || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--glow-x', `${x}%`);
    cardRef.current.style.setProperty('--glow-y', `${y}%`);
    cardRef.current.style.setProperty('--glow-opacity', '1');
  };

  const handleMouseLeave = () => {
    if (noGlow || !cardRef.current) return;
    cardRef.current.style.setProperty('--glow-opacity', '0');
  };

  return (
    <div
      ref={cardRef}
      className={`card glow-card ${noGlow ? 'no-glow' : ''} ${className}`}
      style={{
        padding: noPadding ? '0' : undefined,
        '--glow-color': glowColor ?? 'rgba(109,40,217,0.14)',
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-opacity': '0',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlowCard;
