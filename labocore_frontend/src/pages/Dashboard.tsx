import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import StatCard from '../components/StatCard'
import GlowCard from '../components/ui/GlowCard'
import RippleButton from '../components/ui/RippleButton'
import Badge from '../components/Badge'
import DataTable, { Column } from '../components/DataTable'

interface Activity {
  id: string;
  action: string;
  target: string;
  time: string;
  user: string;
  status: 'success' | 'warning' | 'info';
}

const mockActivity: Activity[] = [
  { id: '1', action: 'Sample Validated',   target: 'SMP-2023-0891', time: '10 mins ago', user: 'Dr. Smith', status: 'success' },
  { id: '2', action: 'Low Stock Alert',    target: 'Reagent A',     time: '1 hour ago',  user: 'System',    status: 'warning' },
  { id: '3', action: 'New Supplier Added', target: 'BioGenics Inc', time: '3 hours ago', user: 'Alice',     status: 'info'    },
  { id: '4', action: 'Results Pending',    target: 'Batch 44B',     time: '5 hours ago', user: 'System',    status: 'warning' },
]

const BARS = [
  { label: 'Microbiology', pct: 72, color: 'var(--primary-color)' },
  { label: 'Biochemistry', pct: 54, color: 'var(--success)'       },
  { label: 'Hematology',   pct: 38, color: 'var(--warning)'       },
  { label: 'Immunology',   pct: 25, color: 'var(--info)'          },
]

const MINI_STATS = [
  { label: 'Total Samples', value: '1,284', color: 'var(--primary-color)' },
  { label: 'This Week',     value: '+47',   color: 'var(--success)'       },
  { label: 'Avg. TAT',      value: '2.4h',  color: 'var(--warning)'       },
  { label: 'Critical',      value: '3',     color: 'var(--danger)'        },
]

const Dashboard: React.FC = () => {
  const statsRef  = useRef<HTMLDivElement>(null)
  const cardsRef  = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    if (headerRef.current) {
      tl.from(headerRef.current, {
        opacity: 0, y: -12, duration: 0.4, ease: 'power3.out', clearProps: 'all',
      })
    }
    if (statsRef.current) {
      tl.from(statsRef.current.querySelectorAll('.card'), {
        opacity: 0, y: 28, scale: 0.97, duration: 0.45, stagger: 0.09, ease: 'power3.out', clearProps: 'all',
      }, '-=0.2')
    }
    if (cardsRef.current) {
      tl.from(cardsRef.current.querySelectorAll('.card'), {
        opacity: 0, y: 22, duration: 0.4, stagger: 0.1, ease: 'power3.out', clearProps: 'all',
      }, '-=0.3')
    }

    /* animate progress bars */
    const bars = document.querySelectorAll('.db-bar-fill')
    if (bars.length) {
      gsap.from(bars, { scaleX: 0, transformOrigin: 'left center', duration: 1.1, delay: 0.6, stagger: 0.1, ease: 'power3.out' })
    }

    return () => { tl.kill() }
  }, [])

  const activityCols: Column<Activity>[] = [
    {
      header: 'Event',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: 600, display: 'block', marginBottom: '1px' }}>{row.action}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{row.target}</span>
        </div>
      ),
    },
    { header: 'User', accessor: 'user' },
    { header: 'Time', accessor: 'time' },
    {
      header: 'Status',
      accessor: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
  ]

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header" ref={headerRef}>
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Overview of laboratory operations and alerts</p>
        </div>
        <div className="page-actions">
          <RippleButton variant="outline" icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
          }>Export</RippleButton>

          <RippleButton variant="primary" magnetic icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          }>New Sample</RippleButton>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid-cols-4 mb-6" ref={statsRef}>
        <StatCard
          title="Pending Samples" value={142}
          trend={{ value: '12%', isPositive: false }}
          variant="warning"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>}
        />
        <StatCard
          title="Completed Results" value={89}
          trend={{ value: '5%', isPositive: true }}
          variant="success"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard
          title="Delayed Items" value={12}
          trend={{ value: '2', isPositive: false }}
          variant="danger"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard
          title="Active Technicians" value={8}
          variant="primary"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
      </div>

      {/* ── Content Cards ── */}
      <div className="grid-cols-2" ref={cardsRef}>

        {/* Recent Activity */}
        <GlowCard noPadding glowColor="rgba(37,99,235,0.1)">
          <div className="section-header">
            <div className="section-header-info">
              <h3>Recent Activity</h3>
              <p>Latest lab events</p>
            </div>
            <RippleButton variant="outline" size="sm">View All</RippleButton>
          </div>
          <div className="table-container">
            <DataTable data={mockActivity} columns={activityCols} keyExtractor={(r) => r.id} />
          </div>
        </GlowCard>

        {/* Workload Overview */}
        <GlowCard glowColor="rgba(5,150,105,0.1)">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '2px' }}>Workload Overview</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distribution by category</p>
            </div>
            <RippleButton variant="ghost" size="sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </RippleButton>
          </div>

          {/* Progress bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {BARS.map((b) => (
              <div key={b.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-main)' }}>{b.label}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: b.color }}>{b.pct}%</span>
                </div>
                <div style={{ height: '7px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    className="db-bar-fill"
                    style={{ height: '100%', width: `${b.pct}%`, background: b.color, borderRadius: '999px' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mini stat grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
            {MINI_STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  padding: '0.75rem',
                  background: 'var(--surface-hover)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  {s.label}
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </GlowCard>

      </div>
    </>
  )
}

export default Dashboard
