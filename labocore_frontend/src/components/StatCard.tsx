import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import GlowCard from './ui/GlowCard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

const GLOW: Record<string, string> = {
  primary: 'rgba(109, 40, 217, 0.18)',
  success: 'rgba(5, 150, 105, 0.18)',
  warning: 'rgba(217, 119, 6, 0.18)',
  danger:  'rgba(220, 38, 38, 0.18)',
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = 'primary',
}) => {
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!valueRef.current) return;
    const numericValue =
      typeof value === 'number' ? value : parseInt(String(value), 10);

    if (!isNaN(numericValue) && numericValue > 0) {
      const counter = { val: 0 };
      const tween = gsap.to(counter, {
        val: numericValue,
        duration: 1.6,
        ease: 'power2.out',
        delay: 0.3,
        onUpdate: () => {
          if (valueRef.current) {
            valueRef.current.textContent = Math.round(counter.val).toString();
          }
        },
      });
      return () => { tween.kill(); };
    }
  }, []);

  const displayValue =
    typeof value === 'number' || !isNaN(parseInt(String(value), 10)) ? '0' : String(value);

  return (
    <GlowCard className="stat-card" glowColor={GLOW[variant]}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {icon && <div className={`stat-icon ${variant}`}>{icon}</div>}
      </div>

      <div className="stat-value" ref={valueRef}>
        {displayValue}
      </div>

      {trend && (
        <div
          className={`stat-trend ${trend.isPositive ? 'positive' : 'negative'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.25rem', fontSize: '0.8125rem' }}
        >
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span style={{ fontWeight: 700 }}>{trend.value}</span>
          <span className="stat-trend-label">vs last week</span>
        </div>
      )}
    </GlowCard>
  );
};

export default StatCard;
