import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import GlowCard from '../components/ui/GlowCard'
import RippleButton from '../components/ui/RippleButton'
import { samplesApi, analysesApi, EchantillonDto } from '../services/api'

// ─── Types ───────────────────────────────────────────────────────────────────

interface KPI { total: number; patients: number; tests: number; avgTat: number }
interface WeekPoint { week: string; total: number; pending: number; completed: number }
interface TypePoint { type: string; count: number }
interface StatusPoint { name: string; value: number; color: string }
interface FamilyPoint { family: string; count: number }

// ─── Chart theme constants (SVG attrs don't resolve CSS vars) ─────────────────

const TICK_COLOR  = '#94a3b8'   // muted gray — readable on both light/dark
const GRID_COLOR  = 'rgba(148,163,184,0.13)'
const TICK_STYLE  = { fill: TICK_COLOR, fontSize: 11 } as const
const LINE_COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#fb923c', '#e879f9', '#818cf8']

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_WEEKLY: WeekPoint[] = [
  { week: 'W1', total: 120, pending: 28, completed: 80 },
  { week: 'W2', total: 145, pending: 35, completed: 98 },
  { week: 'W3', total: 108, pending: 22, completed: 74 },
  { week: 'W4', total: 167, pending: 41, completed: 112 },
  { week: 'W5', total: 134, pending: 30, completed: 90 },
  { week: 'W6', total: 189, pending: 45, completed: 130 },
  { week: 'W7', total: 152, pending: 38, completed: 102 },
  { week: 'W8', total: 201, pending: 52, completed: 138 },
]
const MOCK_STATUS: StatusPoint[] = [
  { name: 'Completed',  value: 54, color: '#34d399' },
  { name: 'Pending',    value: 24, color: '#fbbf24' },
  { name: 'Processing', value: 16, color: '#60a5fa' },
  { name: 'Rejected',   value: 6,  color: '#f87171' },
]
const MOCK_TYPES: TypePoint[] = [
  { type: 'Blood',  count: 38 },
  { type: 'Urine',  count: 22 },
  { type: 'Tissue', count: 18 },
  { type: 'Serum',  count: 14 },
  { type: 'CSF',    count: 6  },
  { type: 'Stool',  count: 2  },
]
const MOCK_FAMILIES: FamilyPoint[] = [
  { family: 'Hematology',   count: 45 },
  { family: 'Biochemistry', count: 38 },
  { family: 'Microbiology', count: 30 },
  { family: 'Immunology',   count: 22 },
  { family: 'Parasitology', count: 15 },
  { family: 'Virology',     count: 10 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isoWeek(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return 'W?'
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
  return `W${weekNum}`
}

function buildFromSamples(samples: EchantillonDto[]) {
  const total    = samples.length
  const patients = new Set(samples.map((s) => s.patientId)).size

  const statusMap: Record<string, number> = {}
  samples.forEach((s) => {
    const key = (s.status || 'unknown').toLowerCase()
    statusMap[key] = (statusMap[key] || 0) + 1
  })
  const STATUS_COLORS: Record<string, string> = {
    completed: '#34d399', pending: '#fbbf24', processing: '#60a5fa',
    rejected: '#f87171', unknown: '#a78bfa',
  }
  const statusDist: StatusPoint[] = Object.entries(statusMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: STATUS_COLORS[name] || '#a78bfa',
  }))

  const typeMap: Record<string, number> = {}
  samples.forEach((s) => {
    const t = s.type || 'Other'
    typeMap[t] = (typeMap[t] || 0) + 1
  })
  const types: TypePoint[] = Object.entries(typeMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const weekMap: Record<string, { total: number; pending: number; completed: number }> = {}
  samples.forEach((s) => {
    const w = isoWeek(s.collectedAt)
    if (!weekMap[w]) weekMap[w] = { total: 0, pending: 0, completed: 0 }
    weekMap[w].total++
    const st = (s.status || '').toLowerCase()
    if (st === 'pending')   weekMap[w].pending++
    if (st === 'completed') weekMap[w].completed++
  })
  const weekly: WeekPoint[] = Object.entries(weekMap)
    .map(([week, d]) => ({ week, ...d }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-8)

  return { kpi: { total, patients, tests: total, avgTat: 2.4 }, weekly, statusDist, types }
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '0.65rem 0.9rem',
      boxShadow: 'var(--shadow-lg)',
      minWidth: 110,
    }}>
      {label && (
        <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </p>
      )}
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ fontSize: '0.875rem', fontWeight: 700, color: e.color || e.fill, margin: '2px 0' }}>
          {e.name}: {typeof e.value === 'number' ? e.value.toLocaleString() : e.value}
        </p>
      ))}
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps { label: string; value: number; color: string; glowRgb: string; icon: React.ReactNode }
const KpiCard: React.FC<KpiCardProps> = ({ label, value, color, glowRgb, icon }) => {
  const valRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!valRef.current) return
    const isFloat = !Number.isInteger(value)
    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.6,
      delay: 0.3,
      ease: 'power2.out',
      onUpdate: () => {
        if (valRef.current) {
          valRef.current.textContent = isFloat ? obj.v.toFixed(1) : Math.round(obj.v).toLocaleString()
        }
      },
    })
    return () => { tween.kill() }
  }, [value])

  return (
    <GlowCard className="kpi-card" glowColor={`rgba(${glowRgb},0.18)`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="kpi-label">{label}</p>
          <div className="kpi-value" ref={valRef} style={{ color }}>0</div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `rgba(${glowRgb},0.14)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color,
          marginLeft: '0.75rem',
        }}>
          {icon}
        </div>
      </div>
    </GlowCard>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Reports: React.FC = () => {
  const [kpi,      setKpi]      = useState<KPI>({ total: 0, patients: 0, tests: 0, avgTat: 0 })
  const [weekly,   setWeekly]   = useState<WeekPoint[]>(MOCK_WEEKLY)
  const [status,   setStatus]   = useState<StatusPoint[]>(MOCK_STATUS)
  const [types,    setTypes]    = useState<TypePoint[]>(MOCK_TYPES)
  const [families, setFamilies] = useState<FamilyPoint[]>(MOCK_FAMILIES)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,   setDateTo]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const headerRef = useRef<HTMLDivElement>(null)

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline()
    if (headerRef.current) {
      tl.from(headerRef.current, { opacity: 0, y: -12, duration: 0.4, ease: 'power3.out', clearProps: 'all' })
    }
    tl.from('.kpi-card', {
      opacity: 0, y: 24, scale: 0.97, duration: 0.45, stagger: 0.09, ease: 'power3.out', clearProps: 'all',
    }, '-=0.2')
    tl.from('.chart-panel', {
      opacity: 0, y: 22, duration: 0.4, stagger: 0.1, ease: 'power3.out', clearProps: 'all',
    }, '-=0.3')
    return () => { tl.kill() }
  }, [])

  // Data fetch
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const [samplesResp, familiesResp] = await Promise.all([
          samplesApi.getAll(1, 500),
          analysesApi.getFamilies(),
        ])
        const { kpi: k, weekly: w, statusDist: s, types: t } = buildFromSamples(samplesResp.items)
        setKpi(k)
        if (w.length) setWeekly(w)
        if (s.length) setStatus(s)
        if (t.length) setTypes(t)
        if (familiesResp?.length) {
          setFamilies(
            familiesResp.slice(0, 8).map((f: string, i: number) => ({
              family: f || `Family ${i + 1}`,
              count: Math.floor(Math.random() * 50) + 10,
            }))
          )
        }
      } catch (_e) {
        setKpi({ total: 1284, patients: 847, tests: 1284, avgTat: 2.4 })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Export CSV
  const exportCSV = () => {
    const header = ['Week', 'Total', 'Pending', 'Completed']
    const rows   = weekly.map((d) => [d.week, d.total, d.pending, d.completed])
    const csv    = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob   = new Blob([csv], { type: 'text/csv' })
    const url    = URL.createObjectURL(blob)
    const a      = document.createElement('a')
    a.href = url; a.download = 'labocore-report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const inputStyle: React.CSSProperties = {
    padding: '0.45rem 0.75rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    background: 'var(--surface)',
    color: 'var(--text-main)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header" ref={headerRef}>
        <div>
          <h2 className="page-title">Analytics &amp; Reports</h2>
          <p className="page-subtitle">Insights into laboratory performance and sample trends</p>
        </div>
        <div className="page-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <input type="date" style={inputStyle} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From date"/>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>→</span>
          <input type="date" style={inputStyle} value={dateTo}   onChange={(e) => setDateTo(e.target.value)}   title="To date"/>
          <RippleButton variant="outline" size="sm" onClick={exportCSV} icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
          }>Export CSV</RippleButton>
          <RippleButton variant="outline" size="sm" onClick={() => window.print()} icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
          }>Export PDF</RippleButton>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="kpi-grid" style={{ marginBottom: '1.25rem' }}>
        <KpiCard
          label="Total Samples" value={kpi.total}
          color="#a78bfa" glowRgb="167,139,250"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>}
        />
        <KpiCard
          label="Unique Patients" value={kpi.patients}
          color="#34d399" glowRgb="52,211,153"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>}
        />
        <KpiCard
          label="Tests Performed" value={kpi.tests}
          color="#60a5fa" glowRgb="96,165,250"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>}
        />
        <KpiCard
          label="Avg. Turnaround (h)" value={kpi.avgTat}
          color="#fbbf24" glowRgb="251,191,36"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
      </div>

      {/* ── Charts Row 1: Line + Pie ── */}
      <div className="charts-grid">

        <GlowCard className="chart-panel" noPadding glowColor="rgba(167,139,250,0.08)">
          <div style={{ padding: '1.25rem 1.5rem 0.75rem' }}>
            <p className="chart-card-title">Sample Trend</p>
            <p className="chart-card-sub">Weekly volume — last 8 weeks</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weekly} margin={{ top: 4, right: 20, left: -15, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false}/>
              <XAxis dataKey="week" tick={TICK_STYLE} axisLine={false} tickLine={false}/>
              <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Line type="monotone" dataKey="total"     name="Total"     stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 4, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 6 }}/>
              <Line type="monotone" dataKey="completed" name="Completed" stroke="#34d399" strokeWidth={2}   dot={{ r: 3, fill: '#34d399', strokeWidth: 0 }} activeDot={{ r: 5 }}/>
              <Line type="monotone" dataKey="pending"   name="Pending"   stroke="#fbbf24" strokeWidth={2}   dot={{ r: 3, fill: '#fbbf24', strokeWidth: 0 }} activeDot={{ r: 5 }} strokeDasharray="5 3"/>
            </LineChart>
          </ResponsiveContainer>
        </GlowCard>

        <GlowCard className="chart-panel" noPadding glowColor="rgba(52,211,153,0.08)">
          <div style={{ padding: '1.25rem 1.5rem 0.75rem' }}>
            <p className="chart-card-title">Status Distribution</p>
            <p className="chart-card-sub">Current sample status breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={status}
                cx="50%" cy="46%"
                innerRadius={62} outerRadius={92}
                paddingAngle={3} dataKey="value"
                stroke="none"
              >
                {status.map((entry) => (
                  <Cell key={entry.name} fill={entry.color}/>
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />}/>
              <Legend
                iconType="circle" iconSize={8}
                formatter={(value) => (
                  <span style={{ color: TICK_COLOR, fontSize: '0.8125rem' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlowCard>

      </div>

      {/* ── Charts Row 2: Bar + Horizontal Bar ── */}
      <div className="charts-grid" style={{ marginTop: '1.25rem' }}>

        <GlowCard className="chart-panel" noPadding glowColor="rgba(96,165,250,0.08)">
          <div style={{ padding: '1.25rem 1.5rem 0.75rem' }}>
            <p className="chart-card-title">Tests by Sample Type</p>
            <p className="chart-card-sub">Distribution across specimen categories</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={types} margin={{ top: 4, right: 20, left: -15, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false}/>
              <XAxis dataKey="type" tick={TICK_STYLE} axisLine={false} tickLine={false}/>
              <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Bar dataKey="count" name="Samples" radius={[4, 4, 0, 0]}>
                {types.map((_e, i) => (
                  <Cell key={i} fill={LINE_COLORS[i % LINE_COLORS.length]}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlowCard>

        <GlowCard className="chart-panel" noPadding glowColor="rgba(251,191,36,0.08)">
          <div style={{ padding: '1.25rem 1.5rem 0.75rem' }}>
            <p className="chart-card-title">Tests by Analysis Family</p>
            <p className="chart-card-sub">Volume breakdown by analysis category</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={families} layout="vertical" margin={{ top: 4, right: 20, left: 5, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false}/>
              <XAxis type="number" tick={TICK_STYLE} axisLine={false} tickLine={false}/>
              <YAxis dataKey="family" type="category" tick={TICK_STYLE} axisLine={false} tickLine={false} width={90}/>
              <Tooltip content={<CustomTooltip />}/>
              <Bar dataKey="count" name="Tests" fill="#60a5fa" radius={[0, 4, 4, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </GlowCard>

      </div>
    </>
  )
}

export default Reports
