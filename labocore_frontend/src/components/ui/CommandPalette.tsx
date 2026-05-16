import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  group?: string;
  keywords?: string[];
}

const NAV_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const SEARCH_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(0);
  const navigate                = useNavigate();
  const backdropRef             = useRef<HTMLDivElement>(null);
  const panelRef                = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  const go = useCallback((path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  const ALL_COMMANDS: Command[] = [
    { id: 'dash',  label: 'Dashboard',         description: 'Lab overview & KPIs',        icon: NAV_ICON, group: 'Navigate', action: () => go('/dashboard'),  keywords: ['home','overview'] },
    { id: 'samp',  label: 'Samples',            description: 'Manage lab samples',         icon: NAV_ICON, group: 'Navigate', action: () => go('/samples'),    keywords: ['specimen','blood'] },
    { id: 'res',   label: 'Results',            description: 'Analysis results',           icon: NAV_ICON, group: 'Navigate', action: () => go('/results'),    keywords: ['analysis','report'] },
    { id: 'inv',   label: 'Inventory',          description: 'Reagents & stock levels',    icon: NAV_ICON, group: 'Navigate', action: () => go('/inventory'),  keywords: ['stock','reagent'] },
    { id: 'sup',   label: 'Suppliers',          description: 'Supplier management',        icon: NAV_ICON, group: 'Navigate', action: () => go('/suppliers'),  keywords: ['vendor'] },
    { id: 'tech',  label: 'Technicians',        description: 'Staff directory',            icon: NAV_ICON, group: 'Navigate', action: () => go('/technicians'),keywords: ['staff','user'] },
    { id: 'rep',   label: 'Reports',            description: 'Analytics & exports',        icon: NAV_ICON, group: 'Navigate', action: () => go('/reports'),    keywords: ['export','chart'] },
    { id: 'set',   label: 'Settings',           description: 'Articles & risk conditions', icon: NAV_ICON, group: 'Navigate', action: () => go('/settings'),   keywords: ['config','admin'] },
  ];

  const filtered = query.trim()
    ? ALL_COMMANDS.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.label.toLowerCase().includes(q) ||
          (c.description?.toLowerCase().includes(q)) ||
          c.keywords?.some((k) => k.includes(q))
        );
      })
    : ALL_COMMANDS;

  /* ── Open/close animation ─────────────────── */
  useEffect(() => {
    if (!backdropRef.current || !panelRef.current) return;

    if (isOpen) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.18 });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -24, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: 'back.out(1.6)', clearProps: 'all' }
      );
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelected(0);
    }
  }, [isOpen]);

  /* ── Reset selection when filter changes ─── */
  useEffect(() => { setSelected(0); }, [query]);

  /* ── Keyboard navigation ──────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === 'Enter' && filtered[selected]) {
        filtered[selected].action();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, filtered, selected, onClose]);

  if (!isOpen) return null;

  const groups = [...new Set(filtered.map((c) => c.group ?? 'Actions'))];

  return createPortal(
    <div
      ref={backdropRef}
      className="cp-backdrop"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div ref={panelRef} className="cp-panel">
        {/* Search */}
        <div className="cp-search">
          <span className="cp-search-icon">{SEARCH_ICON}</span>
          <input
            ref={inputRef}
            className="cp-input"
            placeholder="Search pages, commands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="cp-kbd">ESC</kbd>
        </div>

        {/* Results */}
        <div className="cp-results">
          {filtered.length === 0 ? (
            <div className="cp-empty">
              <p>No results for <strong>"{query}"</strong></p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group} className="cp-group">
                <p className="cp-group-label">{group}</p>
                {filtered
                  .filter((c) => (c.group ?? 'Actions') === group)
                  .map((cmd) => {
                    const idx = filtered.indexOf(cmd);
                    return (
                      <button
                        key={cmd.id}
                        className={`cp-item ${idx === selected ? 'cp-item-active' : ''}`}
                        onMouseEnter={() => setSelected(idx)}
                        onClick={() => { cmd.action(); }}
                      >
                        <span className="cp-item-icon">{cmd.icon}</span>
                        <span className="cp-item-text">
                          <span className="cp-item-label">{cmd.label}</span>
                          {cmd.description && <span className="cp-item-desc">{cmd.description}</span>}
                        </span>
                        <kbd className="cp-item-kbd">↵</kbd>
                      </button>
                    );
                  })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="cp-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommandPalette;
