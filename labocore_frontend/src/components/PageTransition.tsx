import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!ref.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      ref.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'all' }
    );

    return () => { tl.kill(); };
  }, [location.pathname]);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      {children}
    </div>
  );
};

export default PageTransition;
