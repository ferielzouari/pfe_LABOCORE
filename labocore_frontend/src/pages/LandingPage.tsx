import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── SVG Lab Elements ────────────────────────────────────────────────────────

const DNAHelix = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size * 1.625} viewBox="0 0 60 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 30 5 Q 55 25, 30 45 Q 5 65, 30 85 Q 55 105, 30 125"
      stroke="#a78bfa" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.95"/>
    <path d="M 30 5 Q 5 25, 30 45 Q 55 65, 30 85 Q 5 105, 30 125"
      stroke="#34d399" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.95"/>
    <line x1="15" y1="25" x2="45" y2="25" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
    <line x1="15" y1="65" x2="45" y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
    <line x1="15" y1="105" x2="45" y2="105" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
    <line x1="23" y1="15" x2="37" y2="15" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    <line x1="23" y1="35" x2="37" y2="35" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    <line x1="23" y1="55" x2="37" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    <line x1="23" y1="75" x2="37" y2="75" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    <line x1="23" y1="95" x2="37" y2="95" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    <line x1="23" y1="115" x2="37" y2="115" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    <circle cx="45" cy="25" r="3.5" fill="#a78bfa"/>
    <circle cx="15" cy="25" r="3.5" fill="#34d399"/>
    <circle cx="15" cy="65" r="3.5" fill="#a78bfa"/>
    <circle cx="45" cy="65" r="3.5" fill="#34d399"/>
    <circle cx="45" cy="105" r="3.5" fill="#a78bfa"/>
    <circle cx="15" cy="105" r="3.5" fill="#34d399"/>
  </svg>
)

const Molecule = ({ size = 70 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="50" x2="20" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
    <line x1="50" y1="50" x2="80" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
    <line x1="50" y1="50" x2="20" y2="78" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
    <line x1="50" y1="50" x2="80" y2="78" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
    <line x1="50" y1="50" x2="50" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
    <circle cx="50" cy="50" r="14" fill="rgba(167,139,250,0.18)" stroke="#a78bfa" strokeWidth="2.5"/>
    <circle cx="50" cy="50" r="7" fill="#a78bfa" opacity="0.85"/>
    <circle cx="20" cy="22" r="9" fill="rgba(52,211,153,0.18)" stroke="#34d399" strokeWidth="2"/>
    <circle cx="20" cy="22" r="4.5" fill="#34d399" opacity="0.85"/>
    <circle cx="80" cy="22" r="9" fill="rgba(96,165,250,0.18)" stroke="#60a5fa" strokeWidth="2"/>
    <circle cx="80" cy="22" r="4.5" fill="#60a5fa" opacity="0.85"/>
    <circle cx="20" cy="78" r="9" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" strokeWidth="2"/>
    <circle cx="20" cy="78" r="4.5" fill="#fbbf24" opacity="0.85"/>
    <circle cx="80" cy="78" r="9" fill="rgba(244,114,182,0.18)" stroke="#f472b6" strokeWidth="2"/>
    <circle cx="80" cy="78" r="4.5" fill="#f472b6" opacity="0.85"/>
    <circle cx="50" cy="12" r="7" fill="rgba(52,211,153,0.18)" stroke="#34d399" strokeWidth="2"/>
    <circle cx="50" cy="12" r="3.5" fill="#34d399" opacity="0.85"/>
  </svg>
)

const TestTube = ({ size = 50 }: { size?: number }) => (
  <svg width={size} height={size * 2} viewBox="0 0 50 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="0" width="22" height="6" rx="3" fill="#60a5fa" opacity="0.55"/>
    <path d="M14 6 L14 68 Q14 86 25 86 Q36 86 36 68 L36 6 Z"
      stroke="#60a5fa" strokeWidth="2" fill="rgba(96,165,250,0.08)" strokeLinecap="round"/>
    <line x1="14" y1="18" x2="36" y2="18" stroke="#60a5fa" strokeWidth="1" opacity="0.35"/>
    <line x1="14" y1="32" x2="36" y2="32" stroke="#60a5fa" strokeWidth="1" opacity="0.35"/>
    <line x1="14" y1="46" x2="36" y2="46" stroke="#60a5fa" strokeWidth="1" opacity="0.35"/>
    <path d="M14 62 Q14 86 25 86 Q36 86 36 62 Z" fill="rgba(96,165,250,0.3)"/>
    <ellipse cx="25" cy="54" rx="8" ry="4" fill="rgba(96,165,250,0.4)"/>
    <circle cx="21" cy="50" r="2.5" fill="#60a5fa" opacity="0.5"/>
    <circle cx="29" cy="43" r="1.8" fill="#60a5fa" opacity="0.4"/>
    <circle cx="22" cy="36" r="1.2" fill="#60a5fa" opacity="0.3"/>
  </svg>
)

const Microscope = ({ size = 70 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="4" width="20" height="26" rx="5" stroke="#f472b6" strokeWidth="2.5" fill="rgba(244,114,182,0.1)"/>
    <circle cx="50" cy="17" r="6" stroke="#f472b6" strokeWidth="1.5" fill="rgba(244,114,182,0.2)"/>
    <rect x="44" y="4" width="12" height="4" rx="2" fill="#f472b6" opacity="0.4"/>
    <line x1="50" y1="30" x2="50" y2="56" stroke="#f472b6" strokeWidth="3.5" strokeLinecap="round"/>
    <circle cx="50" cy="56" r="5" fill="#f472b6" opacity="0.75"/>
    <path d="M50 56 L37 74" stroke="#f472b6" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="37" cy="74" r="9" stroke="#f472b6" strokeWidth="2.5" fill="rgba(244,114,182,0.18)"/>
    <circle cx="37" cy="74" r="4" fill="#f472b6" opacity="0.5"/>
    <rect x="18" y="80" width="64" height="7" rx="3.5" stroke="#f472b6" strokeWidth="2" fill="rgba(244,114,182,0.1)"/>
    <path d="M23 87 L23 94 L77 94 L77 87" stroke="#f472b6" strokeWidth="2" strokeLinecap="round"/>
    <rect x="18" y="92" width="64" height="6" rx="3" fill="#f472b6" opacity="0.45"/>
    <line x1="37" y1="82" x2="37" y2="80" stroke="#fbbf24" strokeWidth="2.5" opacity="0.8"/>
    <line x1="30" y1="81" x2="28" y2="79" stroke="#fbbf24" strokeWidth="2" opacity="0.45"/>
    <line x1="44" y1="81" x2="46" y2="79" stroke="#fbbf24" strokeWidth="2" opacity="0.45"/>
  </svg>
)

const PetriDish = ({ size = 55 }: { size?: number }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 100 65" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="40" rx="48" ry="22" stroke="#34d399" strokeWidth="2.5" fill="rgba(52,211,153,0.05)"/>
    <path d="M2 40 Q2 12 50 12 Q98 12 98 40" stroke="#34d399" strokeWidth="2.5" fill="rgba(52,211,153,0.07)"/>
    <circle cx="33" cy="40" r="9" fill="rgba(52,211,153,0.42)" stroke="#34d399" strokeWidth="1.5"/>
    <circle cx="57" cy="33" r="6" fill="rgba(52,211,153,0.32)" stroke="#34d399" strokeWidth="1.5"/>
    <circle cx="50" cy="48" r="7" fill="rgba(52,211,153,0.38)" stroke="#34d399" strokeWidth="1.5"/>
    <circle cx="70" cy="40" r="5" fill="rgba(52,211,153,0.28)" stroke="#34d399" strokeWidth="1.5"/>
    <circle cx="28" cy="50" r="4" fill="rgba(52,211,153,0.22)" stroke="#34d399" strokeWidth="1.5"/>
    <circle cx="42" cy="34" r="3" fill="rgba(52,211,153,0.2)" stroke="#34d399" strokeWidth="1"/>
  </svg>
)

const Flask = ({ size = 55 }: { size?: number }) => (
  <svg width={size} height={size * 1.35} viewBox="0 0 60 82" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="21" y="0" width="18" height="4" rx="2" fill="#fbbf24" opacity="0.65"/>
    <rect x="22" y="4" width="16" height="30" rx="4" stroke="#fbbf24" strokeWidth="2" fill="rgba(251,191,36,0.08)"/>
    <path d="M22 32 L8 66 Q8 78 30 78 Q52 78 52 66 L38 32 Z"
      stroke="#fbbf24" strokeWidth="2" fill="rgba(251,191,36,0.08)" strokeLinejoin="round"/>
    <path d="M14 60 Q14 76 30 76 Q46 76 46 60 Z" fill="rgba(251,191,36,0.35)"/>
    <ellipse cx="30" cy="56" rx="12" ry="6" fill="rgba(251,191,36,0.3)"/>
    <circle cx="23" cy="51" r="3.5" fill="#fbbf24" opacity="0.55"/>
    <circle cx="35" cy="44" r="2.5" fill="#fbbf24" opacity="0.45"/>
    <circle cx="26" cy="37" r="1.8" fill="#fbbf24" opacity="0.35"/>
  </svg>
)

// ─── Static data ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    title: 'Sample Tracking',
    desc: 'End-to-end sample lifecycle management with real-time status updates and barcode integration.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
      </svg>
    ),
  },
  {
    color: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
    title: 'BI Analytics',
    desc: 'Interactive dashboards with live charts, KPI counters, and exportable PDF/CSV reports.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
  },
  {
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.12)',
    title: 'Inventory Control',
    desc: 'Smart reagent stock management with low-stock alerts, expiry tracking, and reorder automation.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
    ),
  },
  {
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.12)',
    title: 'Team Management',
    desc: 'Multi-role access control for admins, technicians, and analysts with service-based grouping.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.12)',
    title: 'Supplier Network',
    desc: 'Centralize supplier relationships, manage purchase orders, and track delivery timelines.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.12)',
    title: 'Compliance & Safety',
    desc: 'Built-in risk condition tracking, safety data sheets, and hazard mention management.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
]

const STATS = [
  { value: 50000, suffix: '+', label: 'Samples Processed', color: '#a78bfa' },
  { value: 120,   suffix: '+', label: 'Laboratories',      color: '#34d399' },
  { value: 99,    suffix: '.9%', label: 'Uptime SLA',      color: '#60a5fa' },
  { value: 14,    suffix: 'ms', label: 'Response Time',    color: '#fbbf24' },
]

const TESTIMONIALS = [
  {
    name: 'Dr. Amira Benali',
    role: 'Lab Director, CHU Tunis',
    avatar: 'A',
    avatarBg: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    text: 'LABOCORE transformed our workflow completely. Sample processing time dropped by 40% and our technicians love the intuitive interface.',
  },
  {
    name: 'Prof. Karim Mansouri',
    role: 'Research Lead, Institut Pasteur',
    avatar: 'K',
    avatarBg: 'linear-gradient(135deg, #34d399, #059669)',
    text: 'The BI reports give us unprecedented visibility into lab performance. We can now spot bottlenecks before they become problems.',
  },
  {
    name: 'Sophie Chen',
    role: 'Lab Manager, BioGenics Inc.',
    avatar: 'S',
    avatarBg: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    text: "Supplier management and inventory tracking used to take hours per week. Now it's automated and I can focus on quality control.",
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

const LandingPage: React.FC = () => {
  const pageRef   = useRef<HTMLDivElement>(null)
  const floatRef  = useRef<HTMLDivElement>(null)
  const featRef   = useRef<HTMLElement>(null)
  const statsRef  = useRef<HTMLElement>(null)
  const testiRef  = useRef<HTMLElement>(null)
  const ctaRef    = useRef<HTMLElement>(null)
  const navigate  = useNavigate()

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    // Clear any stale GSAP inline styles left by a previous render (React StrictMode runs effects twice in dev)
    gsap.set(
      ['.landing-badge', '.landing-hero-title', '.landing-hero-sub', '.landing-hero-actions', '.landing-scroll-hint'],
      { clearProps: 'all' }
    )

    // Hero entrance — fromTo guarantees the end state is always opacity:1
    const tl = gsap.timeline()
    tl.fromTo('.landing-badge',
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'all' }
      )
      .fromTo('.landing-hero-title',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' },
        '-=0.25'
      )
      .fromTo('.landing-hero-sub',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' },
        '-=0.4'
      )
      .fromTo('.landing-hero-actions',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'all' },
        '-=0.35'
      )
      .fromTo('.landing-scroll-hint',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, clearProps: 'all' },
        '-=0.15'
      )

    // Floating elements entrance + continuous loop
    if (floatRef.current) {
      const els = floatRef.current.querySelectorAll<HTMLElement>('.float-el')
      gsap.fromTo(els,
        { opacity: 0, scale: 0.25 },
        { opacity: 0.28, scale: 1, duration: 1.1, stagger: 0.14, ease: 'back.out(1.6)', delay: 0.4 }
      )
      els.forEach((el, i) => {
        gsap.to(el, {
          y: `+=${12 + i * 6}`,
          rotation: `+=${8 - i * 2}`,
          duration: 2.8 + i * 0.45,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.25,
        })
      })
    }

    // Features section
    ScrollTrigger.create({
      trigger: featRef.current,
      scroller: page,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.fromTo('.feature-card',
          { opacity: 0, y: 50, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out', clearProps: 'all' }
        )
      },
    })

    // Stats counters
    ScrollTrigger.create({
      trigger: statsRef.current,
      scroller: page,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.fromTo('.landing-stat',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out', clearProps: 'all' }
        )
        page.querySelectorAll<HTMLElement>('.stat-count').forEach((el) => {
          const target = parseInt(el.getAttribute('data-target') || '0', 10)
          const obj = { val: 0 }
          gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.val).toLocaleString() },
          })
        })
      },
    })

    // Testimonials
    ScrollTrigger.create({
      trigger: testiRef.current,
      scroller: page,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.fromTo('.testi-card',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.13, ease: 'power3.out', clearProps: 'all' }
        )
      },
    })

    // CTA
    ScrollTrigger.create({
      trigger: ctaRef.current,
      scroller: page,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo('.landing-cta-inner',
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', clearProps: 'all' }
        )
      },
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  const scrollToFeatures = () => {
    const page = pageRef.current
    const feat = featRef.current
    if (page && feat) {
      page.scrollTo({ top: feat.offsetTop, behavior: 'smooth' })
    }
  }

  return (
    <div className="landing-page" ref={pageRef}>

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M6 18h8"/>
            <path d="M3 22h18"/>
            <path d="M14 22a7 7 0 1 0 0-14h-1"/>
            <path d="M9 14h2"/>
            <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/>
            <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
          </svg>
          <span>LABO<span style={{ color: '#a78bfa' }}>CORE</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-landing-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }} onClick={scrollToFeatures}>
            Features
          </button>
          <button className="btn-landing-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', boxShadow: '0 0 20px rgba(109,40,217,0.4)' }} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-particles" />

        {/* Floating lab elements */}
        <div className="landing-float-area" ref={floatRef}>
          <div className="float-el" style={{ top: '14%', left: '7%' }}>
            <DNAHelix size={88} />
          </div>
          <div className="float-el" style={{ top: '18%', right: '8%' }}>
            <Molecule size={72} />
          </div>
          <div className="float-el" style={{ bottom: '26%', left: '10%' }}>
            <TestTube size={54} />
          </div>
          <div className="float-el" style={{ bottom: '20%', right: '7%' }}>
            <Microscope size={82} />
          </div>
          <div className="float-el" style={{ top: '52%', left: '3.5%' }}>
            <PetriDish size={58} />
          </div>
          <div className="float-el" style={{ top: '42%', right: '3.5%' }}>
            <Flask size={58} />
          </div>
        </div>

        {/* Hero content */}
        <div className="landing-hero-content">
          <div className="landing-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
            Laboratory Management System
          </div>

          <h1 className="landing-hero-title">
            The Future of<br />
            <span className="gradient-text">Laboratory Management</span>
          </h1>

          <p className="landing-hero-sub">
            LABOCORE streamlines your laboratory workflow with real-time sample tracking,
            powerful BI analytics, and seamless multi-role team collaboration.
          </p>

          <div className="landing-hero-actions">
            <button className="btn-landing-primary" onClick={() => navigate('/login')}>
              Enter App
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn-landing-ghost" onClick={scrollToFeatures}>
              Learn More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
          </div>

          <p className="landing-scroll-hint">↓ Scroll to explore</p>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="landing-section" id="features" ref={featRef}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="landing-section-label">Everything you need</p>
          <h2 className="landing-section-title">Built for modern laboratories</h2>
          <p className="landing-section-sub" style={{ margin: '0 auto' }}>
            A complete platform covering every aspect of lab operations — from sample intake to final report.
          </p>
        </div>
        <div className="landing-features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card-icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="feature-card-title">{f.title}</h3>
              <p className="feature-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <section className="landing-stats-section" ref={statsRef}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="landing-section-label">By the numbers</p>
          <h2 className="landing-section-title" style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)' }}>
            Trusted by labs worldwide
          </h2>
        </div>
        <div className="landing-stats-inner">
          {STATS.map((s) => (
            <div key={s.label} className="landing-stat">
              <div className="landing-stat-number" style={{ color: s.color }}>
                <span className="stat-count" data-target={s.value}>0</span>
                <span style={{ fontSize: '0.6em' }}>{s.suffix}</span>
              </div>
              <p className="landing-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────── */}
      <section className="landing-section" ref={testiRef}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="landing-section-label">What they say</p>
          <h2 className="landing-section-title">Loved by lab professionals</h2>
        </div>
        <div className="landing-testi-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testi-card">
              <div className="testi-quote">"</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: t.avatarBg }}>{t.avatar}</div>
                <div>
                  <p className="testi-name">{t.name}</p>
                  <p className="testi-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="landing-cta" ref={ctaRef}>
        <div className="landing-cta-inner">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔬</div>
          <h2 className="landing-cta-title">Ready to transform your laboratory?</h2>
          <p className="landing-cta-sub">
            Join hundreds of laboratories already using LABOCORE to streamline operations,
            reduce errors, and deliver faster results.
          </p>
          <button className="btn-landing-primary" onClick={() => navigate('/login')} style={{ fontSize: '1.0625rem', padding: '0.875rem 2.25rem' }}>
            Get Started Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <p>© 2025 LABOCORE · Laboratory Management System · Built for modern science</p>
      </footer>

    </div>
  )
}

export default LandingPage
