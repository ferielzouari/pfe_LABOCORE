import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Prevent closing when clicking backdrop */
  persistent?: boolean;
}

const SIZE_MAX: Record<string, string> = {
  sm: '420px',
  md: '540px',
  lg: '700px',
  xl: '880px',
};

const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size        = 'md',
  persistent  = false,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef    = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  /* ── Open animation ────────────────────────── */
  useEffect(() => {
    if (!isOpen || !backdropRef.current || !modalRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    tl.fromTo(
      modalRef.current,
      { opacity: 0, y: -28, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)', clearProps: 'all' },
      '-=0.1'
    );

    return () => { tl.kill(); };
  }, [isOpen]);

  /* ── Lock body scroll when open ────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── Close with animation ──────────────────── */
  const handleClose = () => {
    if (isAnimating.current || !backdropRef.current || !modalRef.current) {
      onClose();
      return;
    }
    isAnimating.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        onClose();
      },
    });
    tl.to(modalRef.current,    { opacity: 0, y: -16, scale: 0.96, duration: 0.22, ease: 'power2.in' });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.18 }, '-=0.1');
  };

  /* ── Keyboard Escape ────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !persistent) handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, persistent]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={backdropRef}
      className="pm-backdrop"
      onClick={(e) => { if (e.target === backdropRef.current && !persistent) handleClose(); }}
    >
      <div
        ref={modalRef}
        className="pm-modal"
        style={{ maxWidth: SIZE_MAX[size] }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* ── Header ── */}
        <div className="pm-header">
          <div>
            <h3 className="pm-title">{title}</h3>
            {subtitle && <p className="pm-subtitle">{subtitle}</p>}
          </div>
          <button className="pm-close" onClick={handleClose} aria-label="Close modal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="pm-body">{children}</div>

        {/* ── Footer ── */}
        {footer && <div className="pm-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default PremiumModal;
