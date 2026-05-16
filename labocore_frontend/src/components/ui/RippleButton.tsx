import React, { useRef } from 'react';
import gsap from 'gsap';

export type ButtonVariant = 'primary' | 'outline' | 'danger' | 'success' | 'ghost';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg';

interface RippleButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  /** Subtle magnetic pull toward cursor */
  magnetic?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  danger:  'btn-danger',
  success: 'btn-success',
  ghost:   'btn-ghost',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

const Spinner = () => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ animation: 'rippleSpinKf 0.7s linear infinite' }}
  >
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  variant  = 'primary',
  size     = 'md',
  onClick,
  disabled,
  loading,
  type     = 'button',
  className = '',
  style,
  magnetic  = false,
  icon,
  iconRight,
  fullWidth = false,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  /* ── Ripple on click ──────────────────────── */
  const triggerRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const btn  = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;

    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height) * 2.2;
    Object.assign(ripple.style, {
      position:      'absolute',
      borderRadius:  '50%',
      background:    'rgba(255,255,255,0.28)',
      pointerEvents: 'none',
      width:  `${size}px`,
      height: `${size}px`,
      left:   `${x - size / 2}px`,
      top:    `${y - size / 2}px`,
      transform: 'scale(0)',
    });
    btn.appendChild(ripple);

    gsap.to(ripple, {
      scale:    1,
      opacity:  0,
      duration: 0.6,
      ease:     'power2.out',
      onComplete: () => ripple.remove(),
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    triggerRipple(e);
    onClick?.(e);
  };

  /* ── Magnetic hover ───────────────────────── */
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || disabled || !btnRef.current) return;
    const btn  = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.22;
    const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.22;
    gsap.to(btn, { x: dx, y: dy, duration: 0.25, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!magnetic || !btnRef.current) return;
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
  };

  return (
    <>
      <style>{`@keyframes rippleSpinKf { to { transform: rotate(360deg); } }`}</style>
      <button
        ref={btnRef}
        type={type}
        className={`btn ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${fullWidth ? 'btn-full' : ''} ${className}`}
        style={{ position: 'relative', overflow: 'hidden', ...style }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        disabled={disabled || loading}
      >
        {loading ? <Spinner /> : icon}
        {!loading && children}
        {!loading && iconRight}
      </button>
    </>
  );
};

export default RippleButton;
