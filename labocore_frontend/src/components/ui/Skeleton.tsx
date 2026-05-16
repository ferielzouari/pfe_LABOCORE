import React from 'react';

interface SkeletonProps {
  width?:  string | number;
  height?: string | number;
  radius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width     = '100%',
  height    = '1rem',
  radius    = 'var(--radius-md)',
  className = '',
  style,
}) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius: radius, ...style }}
  />
);

export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <Skeleton height="1.25rem" width="60%" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} height="0.875rem" width={i === lines - 1 ? '40%' : '100%'} />
    ))}
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="card" style={{ padding: 0 }}>
    <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '2rem' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} height="0.75rem" width={`${60 + i * 10}px`} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        style={{
          padding: '0.9375rem 1.25rem',
          borderBottom: r < rows - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton
            key={c}
            height="0.75rem"
            width={c === 0 ? '100px' : c === cols - 1 ? '60px' : '140px'}
          />
        ))}
      </div>
    ))}
  </div>
);
