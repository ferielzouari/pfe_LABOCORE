import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import DataTable, { Column } from '../components/DataTable'
import { articlesApi, ArticleDetailsDto, ArticleSaveRequest, riskConditionsApi, FicheSecuriteDto, stockAlertsApi, NotificationLogDto, SchedulerStatusDto } from '../services/api'

// ── Risk Condition Form Modal ─────────────────────────────────────────────

interface RiskConditionFormProps {
  initial?: FicheSecuriteDto | null
  onSave: (data: FicheSecuriteDto) => Promise<void>
  onCancel: () => void
  saving: boolean
}

const RiskConditionForm: React.FC<RiskConditionFormProps> = ({ initial, onSave, onCancel, saving }) => {
  const [form, setForm] = useState<FicheSecuriteDto>(
    initial || { code: '', designation: '', designationAng: '' }
  )
  const [error, setError] = useState('')

  const set = (field: keyof FicheSecuriteDto) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.code.trim()) { setError('Code is required.'); return }
    if (!form.designation.trim()) { setError('Designation (FR) is required.'); return }
    setError('')
    await onSave(form)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
      <Card noPadding style={{ width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-floating)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>{initial ? 'Edit Risk Condition' : 'New Risk Condition'}</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500 }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Code *</label>
            <input className="form-control" value={form.code} onChange={set('code')} placeholder="e.g. RC001" />
          </div>
          <div className="form-group">
            <label className="form-label">Designation (FR) *</label>
            <input className="form-control" value={form.designation} onChange={set('designation')} placeholder="e.g. Toxique" />
          </div>
          <div className="form-group">
            <label className="form-label">Designation (EN)</label>
            <input className="form-control" value={form.designationAng} onChange={set('designationAng')} placeholder="e.g. Toxic" />
          </div>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
          <button className="btn btn-outline" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            {saving ? 'Saving...' : 'Save Condition'}
          </button>
        </div>
      </Card>
    </div>
  )
}

// ── Article Form Modal ────────────────────────────────────────────────────

interface ArticleFormProps {
  initial?: ArticleDetailsDto | null
  onSave: (data: ArticleSaveRequest) => Promise<void>
  onCancel: () => void
  saving: boolean
}

const EMPTY_FORM: ArticleSaveRequest = {
  codeArticle: '',
  designationFr: '',
  designationEn: '',
  unite: '',
  type: '',
  modeGestion: 'Par unité',
  dureUtilisation: '',
  uniteDure: '',
  uom: '',
  yieldValue: '',
  precisionValue: '',
  alerteAvant: '',
  examens: [],
}

const ArticleForm: React.FC<ArticleFormProps> = ({ initial, onSave, onCancel, saving }) => {
  const [form, setForm] = useState<ArticleSaveRequest>(
    initial
      ? {
        codeArticle: initial.codeArticle,
        designationFr: initial.designationFr,
        designationEn: initial.designationEn,
        unite: initial.unite,
        type: initial.type,
        modeGestion: initial.modeGestion,
        dureUtilisation: initial.dureUtilisation,
        uniteDure: initial.uniteDure,
        uom: initial.uom,
        yieldValue: initial.yieldValue,
        precisionValue: initial.precisionValue,
        alerteAvant: initial.alerteAvant,
        examens: initial.examens,
      }
      : EMPTY_FORM
  )
  const [examensInput, setExamensInput] = useState(
    initial ? initial.examens.join(', ') : ''
  )
  const [error, setError] = useState('')

  const set = (field: keyof ArticleSaveRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.codeArticle.trim()) { setError('Code is required.'); return }
    if (!form.designationFr.trim()) { setError('French designation is required.'); return }
    const examens = examensInput.split(',').map(s => s.trim()).filter(Boolean)
    if (examens.length === 0) { setError('At least one exam code is required.'); return }
    setError('')
    await onSave({ ...form, examens })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
      <Card noPadding style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-floating)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>{initial ? 'Edit Article' : 'New Article'}</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Code *</label>
              <input className="form-control" value={form.codeArticle} onChange={set('codeArticle')} disabled={!!initial} placeholder="e.g. ART001" />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <input className="form-control" value={form.type} onChange={set('type')} placeholder="e.g. Consommable" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Désignation (FR) *</label>
            <input className="form-control" value={form.designationFr} onChange={set('designationFr')} placeholder="e.g. Tube EDTA" />
          </div>
          <div className="form-group">
            <label className="form-label">Designation (EN)</label>
            <input className="form-control" value={form.designationEn} onChange={set('designationEn')} placeholder="e.g. EDTA Tube" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Unité</label>
              <input className="form-control" value={form.unite} onChange={set('unite')} placeholder="e.g. pcs" />
            </div>
            <div className="form-group">
              <label className="form-label">Mode de Gestion</label>
              <select className="form-control" value={form.modeGestion} onChange={set('modeGestion')}>
                <option>Par unité</option>
                <option>Par lot</option>
                <option>Par poids</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Durée d'utilisation</label>
              <input className="form-control" value={form.dureUtilisation} onChange={set('dureUtilisation')} placeholder="e.g. 30" />
            </div>
            <div className="form-group">
              <label className="form-label">Unité durée</label>
              <input className="form-control" value={form.uniteDure} onChange={set('uniteDure')} placeholder="e.g. Jours" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Nb tests (UOM)</label>
              <input className="form-control" value={form.uom} onChange={set('uom')} placeholder="100" />
            </div>
            <div className="form-group">
              <label className="form-label">Rendement</label>
              <input className="form-control" value={form.yieldValue} onChange={set('yieldValue')} placeholder="95" />
            </div>
            <div className="form-group">
              <label className="form-label">Alerte avant (j)</label>
              <input className="form-control" value={form.alerteAvant} onChange={set('alerteAvant')} placeholder="7" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Examens * (codes séparés par virgule)</label>
            <input className="form-control" value={examensInput} onChange={e => setExamensInput(e.target.value)} placeholder="e.g. EX001, EX002" />
          </div>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
          <button className="btn btn-outline" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            {saving ? 'Saving...' : initial ? 'Save Changes' : 'Create Article'}
          </button>
        </div>
      </Card>
    </div>
  )
}

// ── Settings Page ─────────────────────────────────────────────────────────

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('General')
  const tabs = ['General', 'Articles', 'Risk Conditions', 'Notifications', 'Security']

  const [successMsg, setSuccessMsg] = useState('')
  const [apiError, setApiError] = useState('')
  const flash = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // Articles state
  const [articles, setArticles] = useState<ArticleDetailsDto[]>([])
  const [artTotal, setArtTotal] = useState(0)
  const [artPage, setArtPage] = useState(1)
  const [artSearch, setArtSearch] = useState('')
  const [artLoading, setArtLoading] = useState(false)
  const [showArtForm, setShowArtForm] = useState(false)
  const [artEditTarget, setArtEditTarget] = useState<ArticleDetailsDto | null>(null)
  const [artSaving, setArtSaving] = useState(false)
  const [artDeleteConfirm, setArtDeleteConfirm] = useState<string | null>(null)
  const PAGE_SIZE = 10

  // Notification logs state
  const [notifLogs, setNotifLogs] = useState<NotificationLogDto[]>([])
  const [notifLoading, setNotifLoading] = useState(false)

  // Autonomous agent scheduler status
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatusDto | null>(null)

  // Risk Conditions state
  const [risks, setRisks] = useState<FicheSecuriteDto[]>([])
  const [riskTotal, setRiskTotal] = useState(0)
  const [riskPage, setRiskPage] = useState(1)
  const [riskSearch, setRiskSearch] = useState('')
  const [riskLoading, setRiskLoading] = useState(false)
  const [showRiskForm, setShowRiskForm] = useState(false)
  const [riskEditTarget, setRiskEditTarget] = useState<FicheSecuriteDto | null>(null)
  const [riskSaving, setRiskSaving] = useState(false)
  const [riskDeleteConfirm, setRiskDeleteConfirm] = useState<number | null>(null)

  const fetchArticles = useCallback(async () => {
    setArtLoading(true)
    setApiError('')
    try {
      const res = await articlesApi.getAll(artPage, PAGE_SIZE, artSearch)
      setArticles(res.items)
      setArtTotal(res.total)
    } catch (err: any) {
      setApiError(err?.message || err?.error || JSON.stringify(err) || 'Failed to load articles.')
    } finally {
      setArtLoading(false)
    }
  }, [artPage, artSearch])

  const fetchRisks = useCallback(async () => {
    setRiskLoading(true)
    setApiError('')
    try {
      const res = await riskConditionsApi.getAll(riskPage, PAGE_SIZE, riskSearch)
      setRisks(res.items)
      setRiskTotal(res.total)
    } catch (err: any) {
      setApiError(err?.message || err?.error || JSON.stringify(err) || 'Failed to load risk conditions.')
    } finally {
      setRiskLoading(false)
    }
  }, [riskPage, riskSearch])

  const fetchNotifLogs = useCallback(async () => {
    setNotifLoading(true)
    try {
      const data = await stockAlertsApi.getLogs()
      setNotifLogs(data)
    } catch {
      setNotifLogs([])
    } finally {
      setNotifLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'Articles') fetchArticles()
    if (activeTab === 'Risk Conditions') fetchRisks()
    if (activeTab === 'Notifications') fetchNotifLogs()
  }, [activeTab, fetchArticles, fetchRisks, fetchNotifLogs])

  useEffect(() => {
    stockAlertsApi.getSchedulerStatus().then(setSchedulerStatus).catch(() => {})
  }, [])

  // Handlers for Articles
  const handleArtSave = async (data: ArticleSaveRequest) => {
    setArtSaving(true)
    try {
      if (artEditTarget) {
        await articlesApi.update(artEditTarget.codeArticle, data)
        flash('Article updated successfully.')
      } else {
        await articlesApi.create(data)
        flash('Article created successfully.')
      }
      setShowArtForm(false)
      setArtEditTarget(null)
      fetchArticles()
    } catch (err: any) {
      setApiError(err?.message || err?.error || JSON.stringify(err) || 'Save failed.')
    } finally {
      setArtSaving(false)
    }
  }

  const handleArtDelete = async (code: string) => {
    try {
      await articlesApi.delete(code)
      flash('Article deleted.')
      setArtDeleteConfirm(null)
      fetchArticles()
    } catch (err: any) {
      setApiError(err?.message || err?.error || JSON.stringify(err) || 'Delete failed.')
    }
  }

  // Handlers for Risk Conditions
  const handleRiskSave = async (data: FicheSecuriteDto) => {
    setRiskSaving(true)
    try {
      if (riskEditTarget && riskEditTarget.id) {
        await riskConditionsApi.update(riskEditTarget.id, data)
        flash('Risk Condition updated successfully.')
      } else {
        await riskConditionsApi.create(data)
        flash('Risk Condition created successfully.')
      }
      setShowRiskForm(false)
      setRiskEditTarget(null)
      fetchRisks()
    } catch (err: any) {
      setApiError(err?.message || err?.error || JSON.stringify(err) || 'Save failed.')
    } finally {
      setRiskSaving(false)
    }
  }

  const handleRiskDelete = async (id: number) => {
    try {
      await riskConditionsApi.delete(id)
      flash('Risk Condition deleted.')
      setRiskDeleteConfirm(null)
      fetchRisks()
    } catch (err: any) {
      setApiError(err?.message || err?.error || JSON.stringify(err) || 'Delete failed.')
    }
  }

  const artColumns: Column<ArticleDetailsDto>[] = [
    {
      header: 'Code',
      accessor: (row) => <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{row.codeArticle}</span>
    },
    {
      header: 'Désignation',
      accessor: (row) => (
        <div>
          <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)' }}>{row.designationFr}</span>
          {row.designationEn && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.designationEn}</span>}
        </div>
      )
    },
    { header: 'Type', accessor: 'type', className: 'table-desktop-only' },
    { header: 'Unité', accessor: 'unite', className: 'table-desktop-only' },
    {
      header: 'Gestion',
      accessor: (row) => <Badge variant="info">{row.modeGestion}</Badge>,
      className: 'table-desktop-only'
    },
    {
      header: 'Examens',
      accessor: (row) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {row.examens.length} exam{row.examens.length !== 1 ? 's' : ''}
        </span>
      ),
      className: 'table-desktop-only'
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-outline"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            onClick={() => { setArtEditTarget(row); setShowArtForm(true) }}
          >
            Edit
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            onClick={() => setArtDeleteConfirm(row.codeArticle)}
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  const riskColumns: Column<FicheSecuriteDto>[] = [
    {
      header: 'Code',
      accessor: (row) => <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{row.code}</span>
    },
    {
      header: 'Designation (FR)',
      accessor: 'designation'
    },
    {
      header: 'Designation (EN)',
      accessor: 'designationAng'
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-outline"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            onClick={() => { setRiskEditTarget(row); setShowRiskForm(true) }}
          >
            Edit
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            onClick={() => setRiskDeleteConfirm(row.id!)}
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  const artTotalPages = Math.ceil(artTotal / PAGE_SIZE)
  const riskTotalPages = Math.ceil(riskTotal / PAGE_SIZE)

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Manage lab configuration and articles</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none', border: 'none', padding: '0.5rem 0', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: activeTab === tab ? 600 : 500,
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
              marginBottom: '-1px', transition: 'var(--transition)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'General' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-main)' }}>General Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Laboratory Name</label>
                <input type="text" className="form-control" defaultValue="Central Diagnostic Lab" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input type="email" className="form-control" defaultValue="admin@centraldiag.com" />
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>Save Changes</button>
            </div>
          </Card>
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === 'Articles' && (
        <>
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

          <Card noPadding>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="search-input-modern" style={{ maxWidth: '400px', flex: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  type="text"
                  placeholder="Search articles by code or designation…"
                  value={artSearch}
                  onChange={e => { setArtSearch(e.target.value); setArtPage(1) }}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => { setArtEditTarget(null); setShowArtForm(true) }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Article
              </button>
            </div>

            <div className="table-container">
              {artLoading ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading articles…</div>
              ) : (
                <DataTable data={articles} columns={artColumns} keyExtractor={r => r.codeArticle} />
              )}
            </div>

            {artTotalPages > 0 && (
              <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span>Showing <strong>{articles.length}</strong> of <strong>{artTotal}</strong> articles</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={artPage === 1} onClick={() => setArtPage(p => p - 1)}>Previous</button>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 600, color: 'var(--text-main)' }}>{artPage} / {artTotalPages || 1}</div>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={artPage === artTotalPages || artTotalPages === 0} onClick={() => setArtPage(p => p + 1)}>Next</button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Risk Conditions Tab */}
      {activeTab === 'Risk Conditions' && (
        <>
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

          <Card noPadding>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="search-input-modern" style={{ maxWidth: '400px', flex: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  type="text"
                  placeholder="Search risks by code or designation…"
                  value={riskSearch}
                  onChange={e => { setRiskSearch(e.target.value); setRiskPage(1) }}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => { setRiskEditTarget(null); setShowRiskForm(true) }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Risk Condition
              </button>
            </div>

            <div className="table-container">
              {riskLoading ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading risk conditions…</div>
              ) : (
                <DataTable data={risks} columns={riskColumns} keyExtractor={r => r.id!.toString()} />
              )}
            </div>

            {riskTotalPages > 0 && (
              <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span>Showing <strong>{risks.length}</strong> of <strong>{riskTotal}</strong> conditions</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={riskPage === 1} onClick={() => setRiskPage(p => p - 1)}>Previous</button>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 600, color: 'var(--text-main)' }}>{riskPage} / {riskTotalPages || 1}</div>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={riskPage === riskTotalPages || riskTotalPages === 0} onClick={() => setRiskPage(p => p + 1)}>Next</button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Delete Confirmation Modals */}
      {artDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card style={{ maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-floating)' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', 
              color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Article?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9375rem', lineHeight: '1.5' }}>
              Are you sure you want to delete article <strong>{artDeleteConfirm}</strong>?<br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setArtDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleArtDelete(artDeleteConfirm)}>Delete Article</button>
            </div>
          </Card>
        </div>
      )}

      {riskDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card style={{ maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-floating)' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', 
              color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Condition?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9375rem', lineHeight: '1.5' }}>
              Are you sure you want to delete this risk condition?<br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setRiskDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleRiskDelete(riskDeleteConfirm!)}>Delete Condition</button>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'Notifications' && (
        <>
          {/* Autonomous Agent Status */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>Autonomous Agent Status</h3>
              <span style={{
                fontSize: '0.6875rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px',
                background: 'rgba(34,197,94,0.12)', color: '#22c55e',
              }}>
                {schedulerStatus?.status || 'Active'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Last Run', value: schedulerStatus?.lastRunAt ? new Date(schedulerStatus.lastRunAt).toLocaleString() : 'Not yet run' },
                { label: 'Next Run', value: schedulerStatus?.nextRunAt ? new Date(schedulerStatus.nextRunAt).toLocaleString() : '—' },
                { label: 'Emails Sent Today', value: schedulerStatus?.totalSentToday ?? 0 },
                { label: 'Emails Skipped Today', value: schedulerStatus?.totalSkippedToday ?? 0 },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Email Configuration */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-main)' }}>Email Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'From Address', value: 'labocore.alerts@gmail.com' },
                { label: 'SMTP Server', value: 'smtp.gmail.com:587' },
                { label: 'Trigger Condition', value: 'Stock level ≤ 5 units' },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notification Logs */}
          <Card noPadding>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>Email Notification Log</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>History of all stock alert emails sent to suppliers</div>
              </div>
              <button
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}
                onClick={fetchNotifLogs}
                disabled={notifLoading}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                {notifLoading ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>

            {notifLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading logs…</div>
            ) : notifLogs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No notifications have been sent yet.
              </div>
            ) : (
              <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--surface-hover)' }}>
                      {['Article Code', 'Article Name', 'Supplier', 'Email Sent To', 'Stock Level', 'Sent At', 'Status'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {notifLogs.map((log, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary-color)' }}>{log.codart}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>{log.desart}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>{log.supplierName || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{log.supplierEmail || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#ef4444', fontWeight: 600 }}>{log.stockLevel}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(log.sentAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                            background: log.status === 'Sent' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                            color: log.status === 'Sent' ? '#22c55e' : '#ef4444',
                          }}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Security Tab */}
      {activeTab === 'Security' && (
        <div className="grid-cols-2">
          <Card>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Security</h3>
            <p style={{ color: 'var(--text-muted)' }}>This section is currently under development.</p>
          </Card>
        </div>
      )}

      {/* Article Form Modal */}
      {showArtForm && (
        <ArticleForm
          initial={artEditTarget}
          onSave={handleArtSave}
          onCancel={() => { setShowArtForm(false); setArtEditTarget(null) }}
          saving={artSaving}
        />
      )}

      {/* Risk Condition Form Modal */}
      {showRiskForm && (
        <RiskConditionForm
          initial={riskEditTarget}
          onSave={handleRiskSave}
          onCancel={() => { setShowRiskForm(false); setRiskEditTarget(null) }}
          saving={riskSaving}
        />
      )}
    </>
  )
}

export default Settings
