import { useRef, useEffect, RefObject } from 'react';
import gsap from 'gsap';

interface AnimateInOptions {
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  scale?: number;
  stagger?: number;
  selector?: string;
}

export function useAnimateIn<T extends HTMLElement = HTMLDivElement>(
  options: AnimateInOptions = {}
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const targets = options.selector
      ? ref.current.querySelectorAll(options.selector)
      : ref.current;

    const tl = gsap.timeline();
    tl.from(targets, {
      opacity: 0,
      y: options.y ?? 20,
      x: options.x ?? 0,
      scale: options.scale ?? 1,
      duration: options.duration ?? 0.5,
      delay: options.delay ?? 0,
      stagger: options.stagger ?? 0,
      ease: options.ease ?? 'power3.out',
      clearProps: 'all',
    });

    return () => { tl.kill(); };
  }, []);

  return ref;
}

export function useStaggerIn<T extends HTMLElement = HTMLElement>(
  selector: string,
  options: Omit<AnimateInOptions, 'selector'> = {}
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll(selector);
    if (!items.length) return;

    const tl = gsap.timeline();
    tl.from(items, {
      opacity: 0,
      y: options.y ?? 16,
      x: options.x ?? 0,
      duration: options.duration ?? 0.4,
      delay: options.delay ?? 0,
      stagger: options.stagger ?? 0.07,
      ease: options.ease ?? 'power3.out',
      clearProps: 'all',
    });

    return () => { tl.kill(); };
  }, []);

  return ref;
}
