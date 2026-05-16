import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (msg: string, variant?: ToastVariant, title?: string, duration?: number) => void;
  success: (msg: string, title?: string) => void;
  error:   (msg: string, title?: string) => void;
  warning: (msg: string, title?: string) => void;
  info:    (msg: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

/* ── Individual Toast ───────────────────────────────────── */

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

const ToastCard: React.FC<{ item: ToastItem; onDismiss: (id: string) => void }> = ({
  item,
  onDismiss,
}) => {
  const elRef      = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const duration   = item.duration ?? 4000;

  useEffect(() => {
    if (!elRef.current) return;

    /* slide in */
    gsap.fromTo(
      elRef.current,
      { opacity: 0, x: 60, scale: 0.92 },
      { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)', clearProps: 'all' }
    );

    /* progress bar */
    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 1 },
        { scaleX: 0, duration: duration / 1000, ease: 'none', transformOrigin: 'left center' }
      );
    }

    /* auto dismiss */
    const timer = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    if (!elRef.current) { onDismiss(item.id); return; }
    gsap.to(elRef.current, {
      opacity: 0,
      x: 60,
      scale: 0.9,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => onDismiss(item.id),
    });
  };

  return (
    <div ref={elRef} className={`toast-card toast-${item.variant}`}>
      <span className={`toast-icon toast-icon-${item.variant}`}>{ICONS[item.variant]}</span>
      <div className="toast-body">
        {item.title && <p className="toast-title">{item.title}</p>}
        <p className="toast-message">{item.message}</p>
      </div>
      <button className="toast-close" onClick={dismiss} aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div ref={progressRef} className={`toast-progress toast-progress-${item.variant}`} />
    </div>
  );
};

/* ── Provider ───────────────────────────────────────────── */

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info', title?: string, duration?: number) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev.slice(-4), { id, message, title, variant, duration }]);
    },
    []
  );

  const success = useCallback((m: string, t?: string) => toast(m, 'success', t), [toast]);
  const error   = useCallback((m: string, t?: string) => toast(m, 'error',   t), [toast]);
  const warning = useCallback((m: string, t?: string) => toast(m, 'warning', t), [toast]);
  const info    = useCallback((m: string, t?: string) => toast(m, 'info',    t), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {createPortal(
        <div className="toast-container">
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
