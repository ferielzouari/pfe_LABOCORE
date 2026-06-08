import React, { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import StatCard from '../components/StatCard'
import GlowCard from '../components/ui/GlowCard'
import RippleButton from '../components/ui/RippleButton'
import Badge from '../components/Badge'
import DataTable, { Column } from '../components/DataTable'
import Card from '../components/Card'
import { bonReceptionApi, BonReceptionDto, BonReceptionSaveRequest,
BonReceptionLigneRequest, fournisseursApi, FournisseurDto } from '../services/api'

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

const PAGE_SIZE = 5

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

  // ── Goods Reception: Shared UI State ───────────────────────────────────────
  const [successMsg, setSuccessMsg] = useState('')
  const [apiError, setApiError] = useState('')

  const flash = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // ── Goods Reception: Bon Reception State ───────────────────────────────────
  const [bons, setBons] = useState<BonReceptionDto[]>([])
  const [bonPage, setBonPage] = useState(1)
  const [bonTotal, setBonTotal] = useState(0)
  const [bonSearch, setBonSearch] = useState('')
  const [bonLoading, setBonLoading] = useState(false)

  const [showBonModal, setShowBonModal] = useState(false)
  const [allSuppliers, setAllSuppliers] = useState<FournisseurDto[]>([])
  const [bonForm, setBonForm] = useState<BonReceptionSaveRequest>({
    codFrs: '',
    depot: '',
    lignes: [{ codart: '', desart: '', qteCmd: 1, qteRec: 0 }]
  })
  const [bonSaving, setBonSaving] = useState(false)
  const [bonDeleteConfirm, setBonDeleteConfirm] = useState<string | null>(null)

  // ── Goods Reception: API Handlers ──────────────────────────────────────────

  const fetchBons = useCallback(async () => {
    setBonLoading(true)
    try {
      const res = await bonReceptionApi.getAll(bonPage, PAGE_SIZE, bonSearch)
      setBons(res.items)
      setBonTotal(res.total)
    } catch (err: any) {
      setApiError(err?.message || 'Failed to fetch reception bons')
    } finally {
      setBonLoading(false)
    }
  }, [bonPage, bonSearch])

  useEffect(() => { fetchBons() }, [fetchBons])
  useEffect(() => {
    fournisseursApi.getAllNoPagination().then(setAllSuppliers).catch(console.error)
  }, [])

  // ── Goods Reception: Bon Handlers ──────────────────────────────────────────

  const handleBonSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bonForm.codFrs) { setApiError('Please select a supplier'); return }
    if (bonForm.lignes.some(l => !l.codart || !l.qteCmd)) { setApiError('Please fill all required article fields'); return }

    setBonSaving(true)
    setApiError('')
    try {
      await bonReceptionApi.create(bonForm)
      flash('Reception bon created successfully.')
      setShowBonModal(false)
      fetchBons()
      setBonForm({ codFrs: '', depot: '', lignes: [{ codart: '', desart: '', qteCmd: 1, qteRec: 0 }] })
    } catch (err: any) {
      setApiError(err?.message || 'Failed to save reception bon.')
    } finally {
      setBonSaving(false)
    }
  }

  const handleBonDelete = async () => {
    if (!bonDeleteConfirm) return
    try {
      await bonReceptionApi.delete(bonDeleteConfirm)
      flash('Reception bon deleted.')
      setBonDeleteConfirm(null)
      fetchBons()
    } catch (err: any) {
      setApiError(err?.message || 'Delete failed.')
    }
  }

  const addLine = () => {
    setBonForm({
      ...bonForm,
      lignes: [...bonForm.lignes, { codart: '', desart: '', qteCmd: 1, qteRec: 0 }]
    })
  }

  const removeLine = (index: number) => {
    if (bonForm.lignes.length === 1) return
    const newLignes = [...bonForm.lignes]
    newLignes.splice(index, 1)
    setBonForm({ ...bonForm, lignes: newLignes })
  }

  const updateLine = (index: number, field: keyof BonReceptionLigneRequest, value: any) => {
    const newLignes = [...bonForm.lignes]
    newLignes[index] = { ...newLignes[index], [field]: value }
    setBonForm({ ...bonForm, lignes: newLignes })
  }

  // ── Goods Reception: Table Columns ─────────────────────────────────────────

  const bonColumns: Column<BonReceptionDto>[] = [
    { header: 'N° Bon', accessor: (row) => <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{row.numBon}</span> },
    { header: 'Date', accessor: (row) => new Date(row.dateBon).toLocaleDateString() },
    { header: 'Supplier', accessor: 'raisonSociale' },
    { header: 'Depot', accessor: (row) => row.depot || '-' },
    { header: 'Nb Articles', accessor: 'nbArticles' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => setBonDeleteConfirm(row.numBon)}>Delete</button>
        </div>
      )
    }
  ]

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

      {/* ── Goods Reception (merged from GoodsReception page) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>

        {/* Success/Error Messages */}
        {successMsg && (
          <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
            {successMsg}
          </div>
        )}
        {apiError && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {apiError}
          </div>
        )}

        {/* ── Goods Reception Section ────────────────────────────────────────── */}
        <div>
          <div className="page-header">
            <div>
              <h2 className="page-title">Goods Reception</h2>
              <p className="page-subtitle">Manage article reception bons</p>
            </div>
            <div className="page-actions">
              <button className="btn btn-primary" onClick={() => { setApiError(''); setShowBonModal(true) }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.5rem' }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                New Reception
              </button>
            </div>
          </div>

          <Card noPadding>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="search-input-modern" style={{ maxWidth: '400px', flex: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  type="text"
                  placeholder="Search bons or suppliers..."
                  value={bonSearch}
                  onChange={(e) => { setBonSearch(e.target.value); setBonPage(1); }}
                />
              </div>
            </div>

            <div className="table-container">
              {bonLoading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading reception bons...</div>
              ) : (
                <DataTable data={bons} columns={bonColumns} keyExtractor={(row) => row.numBon} />
              )}
            </div>

            <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>Showing <strong>{bons.length}</strong> of <strong>{bonTotal}</strong> bons</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={bonPage === 1} onClick={() => setBonPage(p => p - 1)}>Previous</button>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 600, color: 'var(--text-main)' }}>{bonPage} / {Math.ceil(bonTotal / PAGE_SIZE) || 1}</div>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={bonPage * PAGE_SIZE >= bonTotal} onClick={() => setBonPage(p => p + 1)}>Next</button>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Bon Modal ──────────────────────────────────────────────── */}
        {showBonModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
            <Card noPadding style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-floating)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>New Goods Reception</h3>
                <button onClick={() => setShowBonModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <form onSubmit={handleBonSave}>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {apiError && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500 }}>{apiError}</div>}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Supplier *</label>
                      <select className="form-control" value={bonForm.codFrs} onChange={e => setBonForm({ ...bonForm, codFrs: e.target.value })} required>
                        <option value="">Select Supplier...</option>
                        {allSuppliers.map(s => <option key={s.id} value={s.code}>{s.raisonSociale} ({s.code})</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Depot</label>
                      <input className="form-control" value={bonForm.depot} onChange={e => setBonForm({ ...bonForm, depot: e.target.value })} placeholder="Main Warehouse" />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.025em' }}>Reception Lines</h4>
                      <button type="button" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }} onClick={addLine}>+ Add Article</button>
                    </div>
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
                          <tr>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Code Article*</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Designation</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Lot N°</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', width: '100px' }}>Qty Cmd*</th>
                            <th style={{ padding: '0.75rem', width: '50px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {bonForm.lignes.map((line, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.5rem' }}><input className="form-control" style={{ padding: '0.4rem 0.6rem' }} value={line.codart} onChange={e => updateLine(idx, 'codart', e.target.value)} required /></td>
                              <td style={{ padding: '0.5rem' }}><input className="form-control" style={{ padding: '0.4rem 0.6rem' }} value={line.desart} onChange={e => updateLine(idx, 'desart', e.target.value)} /></td>
                              <td style={{ padding: '0.5rem' }}><input className="form-control" style={{ padding: '0.4rem 0.6rem' }} value={line.numLot} onChange={e => updateLine(idx, 'numLot', e.target.value)} /></td>
                              <td style={{ padding: '0.5rem' }}><input type="number" className="form-control" style={{ padding: '0.4rem 0.6rem' }} value={line.qteCmd} onChange={e => updateLine(idx, 'qteCmd', parseFloat(e.target.value))} required min="1" /></td>
                              <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                <button type="button" style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem', opacity: bonForm.lignes.length === 1 ? 0.3 : 1 }} onClick={() => removeLine(idx)} disabled={bonForm.lignes.length === 1}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowBonModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={bonSaving} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    {bonSaving ? 'Saving...' : 'Complete Reception'}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* ── Delete Confirmation ──────────────────────────────────────── */}
        {bonDeleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
            <Card style={{ maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-floating)' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Reception?</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9375rem', lineHeight: '1.5' }}>
                Are you sure you want to delete reception bon <strong>{bonDeleteConfirm}</strong>?<br/>Inventory will not be automatically reverted.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setBonDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleBonDelete}>Delete Bon</button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard
