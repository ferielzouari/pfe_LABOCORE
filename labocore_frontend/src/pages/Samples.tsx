import React, { useState, useEffect, useCallback } from 'react'
import GlowCard from '../components/ui/GlowCard'
import PremiumModal from '../components/ui/PremiumModal'
import RippleButton from '../components/ui/RippleButton'
import DataTable, { Column } from '../components/DataTable'
import Badge from '../components/Badge'
import { samplesApi, EchantillonDto, EchantillonSaveRequest } from '../services/api'

const EMPTY_FORM: EchantillonSaveRequest = {
  patientId: '',
  type: 'Blood',
  priority: 'Routine',
  notes: '',
}

// ── Register Modal Content ────────────────────────────────────────────────

interface RegisterFormBodyProps {
  form: EchantillonSaveRequest
  onChange: (field: keyof EchantillonSaveRequest, value: string) => void
  error: string
}

const RegisterFormBody: React.FC<RegisterFormBodyProps> = ({ form, onChange, error }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
    {error && (
      <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {error}
      </div>
    )}

    <div className="form-group">
      <label className="form-label">Patient ID <span style={{ color: 'var(--danger)' }}>*</span></label>
      <input
        className="form-control"
        value={form.patientId}
        onChange={(e) => onChange('patientId', e.target.value)}
        placeholder="e.g. PT-8832"
        autoFocus
      />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div className="form-group">
        <label className="form-label">Type <span style={{ color: 'var(--danger)' }}>*</span></label>
        <div className="select-wrapper">
          <select className="form-control" value={form.type} onChange={(e) => onChange('type', e.target.value)}>
            {['Blood','Urine','Swab','Tissue','Serum','Plasma'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Priority <span style={{ color: 'var(--danger)' }}>*</span></label>
        <div className="select-wrapper">
          <select className="form-control" value={form.priority} onChange={(e) => onChange('priority', e.target.value)}>
            <option>Routine</option>
            <option>Urgent</option>
            <option>Stat</option>
          </select>
        </div>
      </div>
    </div>

    <div className="form-group">
      <label className="form-label">Notes</label>
      <textarea
        className="form-control"
        style={{ resize: 'vertical', minHeight: '84px' }}
        value={form.notes}
        onChange={(e) => onChange('notes', e.target.value)}
        placeholder="Any special handling instructions…"
      />
    </div>
  </div>
)

// ── Samples Page ──────────────────────────────────────────────────────────

const Samples: React.FC = () => {
  const [samples, setSamples]           = useState<EchantillonDto[]>([])
  const [total, setTotal]               = useState(0)
  const [page, setPage]                 = useState(1)
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading]           = useState(false)
  const [apiError, setApiError]         = useState('')
  const [successMsg, setSuccessMsg]     = useState('')
  const [showForm, setShowForm]         = useState(false)
  const [form, setForm]                 = useState<EchantillonSaveRequest>(EMPTY_FORM)
  const [formError, setFormError]       = useState('')
  const [saving, setSaving]             = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [isExporting, setIsExporting]   = useState(false)

  const PAGE_SIZE = 20

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

  const flash = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const openForm = () => {
    setForm(EMPTY_FORM)
    setFormError('')
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.patientId.trim()) { setFormError('Patient ID is required.'); return }
    if (!form.type.trim())      { setFormError('Type is required.'); return }
    setFormError('')
    setSaving(true)
    try {
      await samplesApi.create(form)
      flash('Sample registered successfully.')
      setShowForm(false)
      fetchSamples()
    } catch (err: any) {
      setFormError(err?.message || 'Failed to register sample.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await samplesApi.delete(id)
      flash('Sample deleted.')
      setDeleteTarget(null)
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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('fr-FR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })

  const handleExport = async () => {
    setIsExporting(true)
    setApiError('')
    try {
      const res  = await samplesApi.getAll(1, 1000, search, statusFilter)
      const data = res.items
      if (!data.length) { alert('No data to export.'); return }

      const headers = ['Sample ID','Patient ID','Type','Priority','Date','Status','Notes']
      const rows    = data.map((r: any) => [
        `"${r.sampleId || ''}"`,
        `"${r.patientId || ''}"`,
        `"${r.type || ''}"`,
        `"${r.priority || ''}"`,
        `"${r.collectedAt ? formatDate(r.collectedAt) : ''}"`,
        `"${r.status || ''}"`,
        `"${(r.notes || '').replace(/"/g,'""')}"`,
      ])

      const csv  = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `samples_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      flash('Export complete.')
    } catch (err: any) {
      setApiError(err?.message || 'Failed to export.')
    } finally {
      setIsExporting(false)
    }
  }

  const PRIORITY_COLOR: Record<string, string> = {
    Stat: 'var(--danger)', Urgent: 'var(--warning)',
  }

  const STATUS_VARIANT: Record<string, any> = {
    Completed: 'success', Processing: 'info', Pending: 'warning', Rejected: 'danger',
  }

  const columns: Column<EchantillonDto>[] = [
    {
      header: 'Sample ID',
      accessor: (row) => <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{row.sampleId}</span>,
    },
    {
      header: 'Patient',
      accessor: (row) => <span style={{ fontWeight: 500 }}>{row.patientId}</span>,
      className: 'table-desktop-only',
    },
    { header: 'Type', accessor: 'type' },
    {
      header: 'Priority',
      accessor: (row) => (
        <span style={{ color: PRIORITY_COLOR[row.priority] ?? 'var(--text-muted)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: (row) => <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{formatDate(row.collectedAt)}</span>,
      className: 'table-desktop-only',
    },
    {
      header: 'Status',
      accessor: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? 'default'}>{row.status}</Badge>,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {row.status === 'Pending' && (
            <RippleButton size="xs" variant="outline" onClick={() => handleStatusChange(row.id, 'Processing')}>
              Process
            </RippleButton>
          )}
          {row.status === 'Processing' && (
            <RippleButton size="xs" variant="success" onClick={() => handleStatusChange(row.id, 'Completed')}>
              Complete
            </RippleButton>
          )}
          <RippleButton size="xs" variant="danger" onClick={() => setDeleteTarget(row.id)}>
            Delete
          </RippleButton>
        </div>
      ),
    },
  ]

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Samples</h2>
          <p className="page-subtitle">Manage and track sample collections and processing</p>
        </div>
        <div className="page-actions">
          <RippleButton
            variant="outline"
            loading={isExporting}
            onClick={handleExport}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>}
          >
            Export CSV
          </RippleButton>

          <RippleButton
            variant="primary"
            magnetic
            onClick={openForm}
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
          >
            Register Sample
          </RippleButton>
        </div>
      </div>

      {/* ── Banners ── */}
      {successMsg && (
        <div className="alert alert-success mb-5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {successMsg}
        </div>
      )}
      {apiError && (
        <div className="alert alert-error mb-5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {apiError}
        </div>
      )}

      {/* ── Table Card ── */}
      <GlowCard noPadding noGlow>
        {/* Filters */}
        <div style={{ padding: '1.125rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="search-input-modern" style={{ maxWidth: '380px', flex: 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="search-icon">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by Sample or Patient ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <div className="select-wrapper" style={{ minWidth: '170px' }}>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Loading samples…
            </div>
          ) : (
            <DataTable data={samples} columns={columns} keyExtractor={(r) => String(r.id)} />
          )}
        </div>

        {/* Pagination */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <span>Showing <strong style={{ color: 'var(--text-main)' }}>{samples.length}</strong> of <strong style={{ color: 'var(--text-main)' }}>{total}</strong> samples</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <RippleButton size="sm" variant="outline" disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)}>← Prev</RippleButton>
            <span style={{ padding: '0 0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{page} / {totalPages || 1}</span>
            <RippleButton size="sm" variant="outline" disabled={page >= totalPages || totalPages === 0 || loading} onClick={() => setPage(p => p + 1)}>Next →</RippleButton>
          </div>
        </div>
      </GlowCard>

      {/* ── Register Modal ── */}
      <PremiumModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Register New Sample"
        subtitle="Fill in sample details to add to the queue"
        size="md"
        footer={
          <>
            <RippleButton variant="outline" onClick={() => setShowForm(false)} disabled={saving}>Cancel</RippleButton>
            <RippleButton variant="primary" onClick={handleSave} loading={saving} magnetic>
              Register Sample
            </RippleButton>
          </>
        }
      >
        <RegisterFormBody
          form={form}
          onChange={(field, value) => setForm(f => ({ ...f, [field]: value }))}
          error={formError}
        />
      </PremiumModal>

      {/* ── Delete Confirm Modal ── */}
      <PremiumModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Sample?"
        size="sm"
        footer={
          <>
            <RippleButton variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</RippleButton>
            <RippleButton variant="danger" onClick={() => deleteTarget !== null && handleDelete(deleteTarget)}>
              Delete Permanently
            </RippleButton>
          </>
        }
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
            This sample will be permanently removed from the system.<br/>
            <strong style={{ color: 'var(--text-main)' }}>This action cannot be undone.</strong>
          </p>
        </div>
      </PremiumModal>
    </>
  )
}

export default Samples
