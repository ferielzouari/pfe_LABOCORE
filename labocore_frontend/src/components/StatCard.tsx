import React from 'react';
import Card from './Card';

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

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, variant = 'primary' }) => {
  return (
    <Card className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {icon && (
          <div className={`stat-icon ${variant}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: trend.isPositive ? 'var(--success)' : 'var(--danger)' }}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '4px' }}>vs last week</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
