import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import DataTable, { Column } from '../components/DataTable'
import Badge from '../components/Badge'
import { samplesApi, EchantillonDto, EchantillonSaveRequest } from '../services/api'

// ── Register Sample Modal ─────────────────────────────────────────────────

interface RegisterFormProps {
  onSave: (data: EchantillonSaveRequest) => Promise<void>
  onCancel: () => void
  saving: boolean
}

const EMPTY_FORM: EchantillonSaveRequest = {
  patientId: '',
  type: 'Blood',
  priority: 'Routine',
  notes: '',
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSave, onCancel, saving }) => {
  const [form, setForm] = useState<EchantillonSaveRequest>(EMPTY_FORM)
  const [error, setError] = useState('')

  const set = (field: keyof EchantillonSaveRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.patientId.trim()) { setError('Patient ID is required.'); return }
    if (!form.type.trim()) { setError('Type is required.'); return }
    setError('')
    await onSave(form)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
      <Card noPadding style={{ width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-floating)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Register New Sample</h3>
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
            <label className="form-label">Patient ID *</label>
            <input className="form-control" value={form.patientId} onChange={set('patientId')} placeholder="e.g. PT-8832" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select className="form-control" value={form.type} onChange={set('type')}>
                <option>Blood</option>
                <option>Urine</option>
                <option>Swab</option>
                <option>Tissue</option>
                <option>Serum</option>
                <option>Plasma</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select className="form-control" value={form.priority} onChange={set('priority')}>
                <option>Routine</option>
                <option>Urgent</option>
                <option>Stat</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              style={{ resize: 'vertical', minHeight: '80px' }}
              value={form.notes}
              onChange={set('notes')}
              placeholder="Any special handling instructions..."
            />
          </div>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
          <button className="btn btn-outline" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            {saving ? 'Registering...' : 'Register Sample'}
          </button>
        </div>
      </Card>
    </div>
  )
}

// ── Samples Page ──────────────────────────────────────────────────────────

const Samples: React.FC = () => {
  const [samples, setSamples]         = useState<EchantillonDto[]>([])
  const [total, setTotal]             = useState(0)
  const [page, setPage]               = useState(1)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading]         = useState(false)
  const [apiError, setApiError]       = useState('')
  const [successMsg, setSuccessMsg]   = useState('')
  const [showForm, setShowForm]       = useState(false)
  const [saving, setSaving]           = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const PAGE_SIZE = 20

  // ── Fetch ───────────────────────────────────────────────────────────────

  const fetchSamples = useCallback(async () => {
    setLoading(true)
    setApiError('')
    try {
      const res = await samplesApi.getAll(page, PAGE_SIZE, search, statusFilter)
      setSamples(res.items)
      setTotal(res.total)
    } catch (err: any) {
      setApiError(err?.message || 'Failed to load samples.')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { fetchSamples() }, [fetchSamples])

  // ── Helpers ─────────────────────────────────────────────────────────────

  const flash = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleSave = async (data: EchantillonSaveRequest) => {
    setSaving(true)
    try {
      await samplesApi.create(data)
      flash('Sample registered successfully.')
      setShowForm(false)
      fetchSamples()
    } catch (err: any) {
      setApiError(err?.message || 'Failed to register sample.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await samplesApi.delete(id)
      flash('Sample deleted.')
      setDeleteConfirm(null)
      fetchSamples()
    } catch (err: any) {
      setApiError(err?.message || 'Delete failed.')
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await samplesApi.updateStatus(id, status)
      flash('Status updated.')
      fetchSamples()
    } catch (err: any) {
      setApiError(err?.message || 'Status update failed.')
    }
  }

  // ── Format date ─────────────────────────────────────────────────────────

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('fr-FR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  }

  // ── Export ──────────────────────────────────────────────────────────────

  const handleExport = async () => {
    setIsExporting(true)
    setApiError('')
    try {
      const res = await samplesApi.getAll(1, 1000, search, statusFilter)
      const data = res.items
      
      const headers = ['Sample ID', 'Patient ID', 'Type', 'Priority', 'Date', 'Status', 'Notes']
      const rows = data.map((row: any) => [
        `"${row.sampleId || ''}"`,
        `"${row.patientId || ''}"`,
        `"${row.type || ''}"`,
        `"${row.priority || ''}"`,
        `"${row.collectedAt ? formatDate(row.collectedAt) : ''}"`,
        `"${row.status || ''}"`,
        `"${(row.notes || '').replace(/"/g, '""')}"`
      ])
      
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      const dateStr = new Date().toISOString().split('T')[0]
      link.href = url
      link.setAttribute('download', `samples_export_${dateStr}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setApiError(err?.message || 'Failed to export samples.')
    } finally {
      setIsExporting(false)
    }
  }

  // ── Columns ─────────────────────────────────────────────────────────────

  const columns: Column<EchantillonDto>[] = [
    {
      header: 'Sample ID',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
          {row.sampleId}
        </span>
      )
    },
    {
      header: 'Patient',
      accessor: (row) => <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{row.patientId}</span>,
      className: 'table-desktop-only'
    },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Priority',
      accessor: (row) => {
        const color = row.priority === 'Stat'
          ? 'var(--danger)'
          : row.priority === 'Urgent'
            ? 'var(--warning)'
            : 'var(--text-muted)'
        return <span style={{ color, fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{row.priority}</span>
      }
    },
    {
      header: 'Date',
      accessor: (row) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{formatDate(row.collectedAt)}</span>,
      className: 'table-desktop-only'
    },
    {
      header: 'Status',
      accessor: (row) => {
        const variantMap: Record<string, any> = {
          Completed: 'success',
          Processing: 'info',
          Pending: 'warning',
          Rejected: 'danger',
        }
        return (
          <Badge variant={variantMap[row.status] || 'default'}>
            {row.status}
          </Badge>
        )
      }
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {row.status === 'Pending' && (
            <button
              className="btn btn-outline"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 600 }}
              onClick={() => handleStatusChange(row.id, 'Processing')}
            >Process</button>
          )}
          {row.status === 'Processing' && (
            <button
              className="btn btn-outline"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
              onClick={() => handleStatusChange(row.id, 'Completed')}
            >Complete</button>
          )}
          <button
            className="btn btn-outline"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            onClick={() => setDeleteConfirm(row.id)}
          >Delete</button>
        </div>
      )
    }
  ]

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Samples</h2>
          <p className="page-subtitle">Manage and track sample collections and processing</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-outline" 
            onClick={handleExport}
            disabled={isExporting}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Register Sample
          </button>
        </div>
      </div>

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
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="search-input-modern" style={{ maxWidth: '400px', flex: 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by Sample or Patient ID..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Filter:</span>
            <select
              className="btn btn-outline"
              style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', height: '42px', minWidth: '160px' }}
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading samples...</div>
          ) : (
            <DataTable
              data={samples}
              columns={columns}
              keyExtractor={r => String(r.id)}
            />
          )}
        </div>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <span>Showing <strong>{samples.length}</strong> of <strong>{total}</strong> samples</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)}>Previous</button>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 600, color: 'var(--text-main)' }}>{page} / {totalPages || 1}</div>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={page === totalPages || totalPages === 0 || loading} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </Card>

      {deleteConfirm !== null && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card style={{ maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-floating)' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', 
              color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Sample?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9375rem', lineHeight: '1.5' }}>
              Are you sure you want to delete this sample?<br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleDelete(deleteConfirm)}>Delete Sample</button>
            </div>
          </Card>
        </div>
      )}

      {showForm && (
        <RegisterForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          saving={saving}
        />
      )}
    </>
  )
}

export default Samples