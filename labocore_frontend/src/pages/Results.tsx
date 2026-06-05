import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import DataTable, { Column } from '../components/DataTable'
import Badge from '../components/Badge'
import {
  echantillonAnalysesApi, EchantillonAnalyseDto, EchantillonAnalyseSaveRequest,
  samplesApi, EchantillonDto,
  analysesApi, DemandeAnalyseDto,
} from '../services/api'

const PAGE_SIZE = 20

function statutVariant(statut: string): 'warning' | 'info' | 'success' | 'danger' | 'default' {
  switch (statut) {
    case 'En attente': return 'warning'
    case 'En cours':   return 'info'
    case 'Terminé':    return 'success'
    case 'Annulé':     return 'danger'
    default:           return 'default'
  }
}

const Results: React.FC = () => {
  // ── Main list ─────────────────────────────────────────────────────────────
  const [data, setData] = useState<EchantillonAnalyseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statutFilter, setStatutFilter] = useState('')
  const [apiError, setApiError] = useState('')

  // ── Assign modal ──────────────────────────────────────────────────────────
  const [showAssign, setShowAssign] = useState(false)
  const [samples, setSamples] = useState<EchantillonDto[]>([])
  const [analyses, setAnalyses] = useState<DemandeAnalyseDto[]>([])
  const [sampleSearch, setSampleSearch] = useState('')
  const [analyseSearch, setAnalyseSearch] = useState('')
  const [assignForm, setAssignForm] = useState<EchantillonAnalyseSaveRequest>({ echantillonId: 0, codeDemande: '' })
  const [assignSaving, setAssignSaving] = useState(false)
  const [assignError, setAssignError] = useState('')

  // ── Result modal ──────────────────────────────────────────────────────────
  const [showResult, setShowResult] = useState(false)
  const [resultTarget, setResultTarget] = useState<EchantillonAnalyseDto | null>(null)
  const [resultStatut, setResultStatut] = useState('En cours')
  const [resultText, setResultText] = useState('')
  const [resultSaving, setResultSaving] = useState(false)
  const [resultError, setResultError] = useState('')

  // ── Fetch list ────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true)
    setApiError('')
    try {
      const res = await echantillonAnalysesApi.getAll(page, PAGE_SIZE, undefined, statutFilter)
      setData(res.items)
      setTotal(res.total)
    } catch (err: any) {
      setApiError(err?.message || err?.error || 'Failed to load analyses.')
    } finally {
      setLoading(false)
    }
  }, [page, statutFilter])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Assign modal ──────────────────────────────────────────────────────────
  const openAssign = async () => {
    setAssignForm({ echantillonId: 0, codeDemande: '' })
    setSampleSearch('')
    setAnalyseSearch('')
    setAssignError('')
    setShowAssign(true)
    try {
      const [samplesRes, analysesRes] = await Promise.all([
        samplesApi.getAll(1, 200),
        analysesApi.getAll(1, 500),
      ])
      setSamples(samplesRes.items)
      setAnalyses(analysesRes.items)
    } catch {
      // non-fatal; user will see empty dropdowns
    }
  }

  const handleAssignSubmit = async () => {
    if (!assignForm.echantillonId) { setAssignError('Please select a sample.'); return }
    if (!assignForm.codeDemande)   { setAssignError('Please select an analysis.'); return }
    setAssignSaving(true)
    setAssignError('')
    try {
      await echantillonAnalysesApi.create(assignForm)
      setShowAssign(false)
      fetchData()
    } catch (err: any) {
      setAssignError(err?.message || err?.error || 'Failed to assign analysis.')
    } finally {
      setAssignSaving(false)
    }
  }

  // ── Result modal ──────────────────────────────────────────────────────────
  const openResult = (row: EchantillonAnalyseDto) => {
    setResultTarget(row)
    setResultStatut('En cours')
    setResultText(row.resultat || '')
    setResultError('')
    setShowResult(true)
  }

  const handleResultSubmit = async () => {
    if (!resultTarget) return
    if (resultStatut === 'Terminé' && !resultText.trim()) {
      setResultError('Result is required when status is Terminé.')
      return
    }
    setResultSaving(true)
    setResultError('')
    try {
      await echantillonAnalysesApi.updateStatut(resultTarget.id, resultStatut, resultText || undefined)
      setShowResult(false)
      fetchData()
    } catch (err: any) {
      setResultError(err?.message || err?.error || 'Failed to update result.')
    } finally {
      setResultSaving(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this analysis assignment? This action cannot be undone.')) return
    setApiError('')
    try {
      await echantillonAnalysesApi.delete(id)
      fetchData()
    } catch (err: any) {
      setApiError(err?.message || err?.error || 'Failed to delete analysis.')
    }
  }

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns: Column<EchantillonAnalyseDto>[] = [
    {
      header: 'Sample ID',
      accessor: (row) => <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{row.sampleId}</span>,
    },
    { header: 'Patient ID', accessor: 'patientId' },
    {
      header: 'Analysis Code',
      accessor: (row) => <span style={{ fontWeight: 600 }}>{row.codeDemande}</span>,
    },
    { header: 'Analysis Designation', accessor: 'designationAnalyse', className: 'table-desktop-only' },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant={statutVariant(row.statut)}>{row.statut}</Badge>
      ),
    },
    { header: 'Result', accessor: (row) => row.resultat || '—', className: 'table-desktop-only' },
    {
      header: 'Assignment Date',
      accessor: (row) => new Date(row.dateAssignation).toLocaleDateString(),
      className: 'table-desktop-only',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-outline"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => openResult(row)}
          >
            Enter Result
          </button>
          <button
            className="btn btn-outline"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const filteredSamples = samples.filter(s =>
    !sampleSearch ||
    s.sampleId.toLowerCase().includes(sampleSearch.toLowerCase()) ||
    s.patientId.toLowerCase().includes(sampleSearch.toLowerCase())
  )
  const filteredAnalyses = analyses.filter(a =>
    !analyseSearch ||
    a.codeDemande.toLowerCase().includes(analyseSearch.toLowerCase()) ||
    (a.designation || '').toLowerCase().includes(analyseSearch.toLowerCase())
  )

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Results Review</h2>
          <p className="page-subtitle">Manage and track sample analyses</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAssign}>+ Assign Analysis</button>
        </div>
      </div>

      {apiError && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {apiError}
        </div>
      )}

      {/* ── Main table ─────────────────────────────────────────────────────── */}
      <Card noPadding>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="btn btn-outline"
            style={{ padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', height: '42px', minWidth: '180px' }}
            value={statutFilter}
            onChange={e => { setStatutFilter(e.target.value); setPage(1) }}
          >
            <option value="">All Statuses</option>
            <option value="En attente">En attente</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading analyses…</div>
        ) : (
          <DataTable data={data} columns={columns} keyExtractor={r => String(r.id)} />
        )}

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <span>Showing <strong>{data.length}</strong> of <strong>{total}</strong> analyses</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)}>Previous</button>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 600, color: 'var(--text-main)' }}>{page} / {totalPages || 1}</div>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={page === totalPages || totalPages === 0 || loading} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </Card>

      {/* ── Assign Analysis Modal ───────────────────────────────────────────── */}
      {showAssign && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card noPadding style={{ width: '100%', maxWidth: '520px', boxShadow: 'var(--shadow-floating)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Assign Analysis to Sample</h3>
              <button onClick={() => setShowAssign(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {assignError && (
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {assignError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Sample *</label>
                <input
                  className="form-control"
                  placeholder="Search by sample ID or patient ID…"
                  value={sampleSearch}
                  onChange={e => setSampleSearch(e.target.value)}
                  style={{ marginBottom: '0.5rem' }}
                />
                <select
                  className="form-control"
                  size={4}
                  value={assignForm.echantillonId || ''}
                  onChange={e => setAssignForm(f => ({ ...f, echantillonId: Number(e.target.value) }))}
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <option value="">— Select a sample —</option>
                  {filteredSamples.map(s => (
                    <option key={s.id} value={s.id}>{s.sampleId} — {s.patientId}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Analysis *</label>
                <input
                  className="form-control"
                  placeholder="Search by code or designation…"
                  value={analyseSearch}
                  onChange={e => setAnalyseSearch(e.target.value)}
                  style={{ marginBottom: '0.5rem' }}
                />
                <select
                  className="form-control"
                  size={4}
                  value={assignForm.codeDemande}
                  onChange={e => setAssignForm(f => ({ ...f, codeDemande: e.target.value }))}
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <option value="">— Select an analysis —</option>
                  {filteredAnalyses.map(a => (
                    <option key={a.codeDemande} value={a.codeDemande}>{a.codeDemande} — {a.designation}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
              <button className="btn btn-outline" onClick={() => setShowAssign(false)} disabled={assignSaving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAssignSubmit} disabled={assignSaving} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                {assignSaving ? 'Saving...' : 'Assign'}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Enter Result Modal ──────────────────────────────────────────────── */}
      {showResult && resultTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card noPadding style={{ width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-floating)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Enter Result</h3>
              <button onClick={() => setShowResult(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {resultError && (
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {resultError}
                </div>
              )}

              <div style={{ background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Sample: </span><strong>{resultTarget.sampleId}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Patient: </span><strong>{resultTarget.patientId}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Analysis: </span><strong>{resultTarget.designationAnalyse}</strong></div>
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  className="form-control"
                  value={resultStatut}
                  onChange={e => setResultStatut(e.target.value)}
                >
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Result {resultStatut === 'Terminé' ? '*' : ''}
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={resultText}
                  onChange={e => setResultText(e.target.value)}
                  placeholder={resultStatut === 'Terminé' ? 'Enter the result (required)' : 'Optional notes'}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
              <button className="btn btn-outline" onClick={() => setShowResult(false)} disabled={resultSaving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleResultSubmit} disabled={resultSaving} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                {resultSaving ? 'Saving...' : 'Save Result'}
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default Results
