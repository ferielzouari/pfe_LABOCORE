import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import DataTable, { Column } from '../components/DataTable'
import { articlesApi, ArticleDetailsDto, ArticleSaveRequest, ApiError } from '../services/api'

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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.5rem 0.75rem',
    border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem', fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem', fontWeight: 600,
    marginBottom: '0.25rem', color: 'var(--text-muted)',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--surface-color)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', margin: 0 }}>{initial ? 'Edit Article' : 'New Article'}</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.25rem' }}>✕</button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Code *</label>
              <input style={inputStyle} value={form.codeArticle} onChange={set('codeArticle')} disabled={!!initial} placeholder="ART001" />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <input style={inputStyle} value={form.type} onChange={set('type')} placeholder="Consommable" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Désignation (FR) *</label>
            <input style={inputStyle} value={form.designationFr} onChange={set('designationFr')} placeholder="Tube EDTA" />
          </div>
          <div>
            <label style={labelStyle}>Designation (EN)</label>
            <input style={inputStyle} value={form.designationEn} onChange={set('designationEn')} placeholder="EDTA Tube" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Unité</label>
              <input style={inputStyle} value={form.unite} onChange={set('unite')} placeholder="pcs" />
            </div>
            <div>
              <label style={labelStyle}>Mode de Gestion</label>
              <select style={inputStyle} value={form.modeGestion} onChange={set('modeGestion')}>
                <option>Par unité</option>
                <option>Par lot</option>
                <option>Par poids</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Durée d'utilisation</label>
              <input style={inputStyle} value={form.dureUtilisation} onChange={set('dureUtilisation')} placeholder="30" />
            </div>
            <div>
              <label style={labelStyle}>Unité durée</label>
              <input style={inputStyle} value={form.uniteDure} onChange={set('uniteDure')} placeholder="Jours" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nb tests (UOM)</label>
              <input style={inputStyle} value={form.uom} onChange={set('uom')} placeholder="100" />
            </div>
            <div>
              <label style={labelStyle}>Rendement</label>
              <input style={inputStyle} value={form.yieldValue} onChange={set('yieldValue')} placeholder="95" />
            </div>
            <div>
              <label style={labelStyle}>Alerte avant (j)</label>
              <input style={inputStyle} value={form.alerteAvant} onChange={set('alerteAvant')} placeholder="7" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Examens * (codes séparés par virgule)</label>
            <input style={inputStyle} value={examensInput} onChange={e => setExamensInput(e.target.value)} placeholder="EX001, EX002, EX003" />
          </div>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-outline" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Article'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Settings Page ─────────────────────────────────────────────────────────

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('General')
  const tabs = ['General', 'Articles', 'Notifications', 'Security']

  // Articles state
  const [articles, setArticles] = useState<ArticleDetailsDto[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<ArticleDetailsDto | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')

  const PAGE_SIZE = 10

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setApiError('')
    try {
      const res = await articlesApi.getAll(page, PAGE_SIZE, search)
      setArticles(res.items)
      setTotal(res.total)
    } catch (err: any) {
      setApiError(err?.message || 'Failed to load articles.')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    if (activeTab === 'Articles') fetchArticles()
  }, [activeTab, fetchArticles])

  const flash = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleSave = async (data: ArticleSaveRequest) => {
    setSaving(true)
    try {
      if (editTarget) {
        await articlesApi.update(editTarget.codeArticle, data)
        flash('Article updated successfully.')
      } else {
        await articlesApi.create(data)
        flash('Article created successfully.')
      }
      setShowForm(false)
      setEditTarget(null)
      fetchArticles()
    } catch (err: any) {
      setApiError(err?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (code: string) => {
    try {
      await articlesApi.delete(code)
      flash('Article deleted.')
      setDeleteConfirm(null)
      fetchArticles()
    } catch (err: any) {
      setApiError(err?.message || 'Delete failed.')
    }
  }

  const columns: Column<ArticleDetailsDto>[] = [
    {
      header: 'Code',
      accessor: (row) => <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{row.codeArticle}</span>
    },
    {
      header: 'Désignation',
      accessor: (row) => (
        <div>
          <span style={{ display: 'block', fontWeight: 500 }}>{row.designationFr}</span>
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
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
            onClick={() => { setEditTarget(row); setShowForm(true) }}
          >
            Edit
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
            onClick={() => setDeleteConfirm(row.codeArticle)}
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  const totalPages = Math.ceil(total / PAGE_SIZE)

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
        <div className="grid-cols-2">
          <Card>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>General Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Laboratory Name</label>
                <input type="text" className="form-control" defaultValue="Central Diagnostic Lab" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input type="email" className="form-control" defaultValue="admin@centraldiag.com" />
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
            </div>
          </Card>
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === 'Articles' && (
        <>
          {successMsg && (
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>
              ✓ {successMsg}
            </div>
          )}
          {apiError && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {apiError}
            </div>
          )}

          <Card noPadding>
            {/* Toolbar */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div className="search-input" style={{ width: '300px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--text-muted)"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  type="text"
                  placeholder="Search by code or designation…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => { setEditTarget(null); setShowForm(true) }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Article
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading articles…</div>
            ) : (
              <DataTable data={articles} columns={columns} keyExtractor={r => r.codeArticle} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span>Showing {articles.length} of {total} articles</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <span style={{ padding: '0.25rem 0.5rem', alignSelf: 'center' }}>Page {page} of {totalPages}</span>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            )}
          </Card>

          {/* Delete Confirmation */}
          {deleteConfirm && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Card style={{ maxWidth: '400px', width: '100%' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Delete Article?</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  Are you sure you want to delete <strong>{deleteConfirm}</strong>? This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                  <button className="btn btn-primary" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Other Tabs */}
      {(activeTab === 'Notifications' || activeTab === 'Security') && (
        <div className="grid-cols-2">
          <Card>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{activeTab}</h3>
            <p style={{ color: 'var(--text-muted)' }}>This section is currently under development.</p>
          </Card>
        </div>
      )}

      {/* Article Form Modal */}
      {showForm && (
        <ArticleForm
          initial={editTarget}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null) }}
          saving={saving}
        />
      )}
    </>
  )
}

export default Settings
