import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import DataTable, { Column } from '../components/DataTable'
import Badge from '../components/Badge'
import {
  fournisseursApi,
  FournisseurDto,
  FournisseurSaveRequest
} from '../services/api'

const PAGE_SIZE = 5

const Suppliers: React.FC = () => {
  // ── Shared UI State ────────────────────────────────────────────────────────
  const [successMsg, setSuccessMsg] = useState('')
  const [apiError, setApiError] = useState('')

  const flash = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // ── Supplier State ─────────────────────────────────────────────────────────
  const [suppliers, setSuppliers] = useState<FournisseurDto[]>([])
  const [supPage, setSupPage] = useState(1)
  const [supTotal, setSupTotal] = useState(0)
  const [supSearch, setSupSearch] = useState('')
  const [supLoading, setSupLoading] = useState(false)
  
  const [showSupModal, setShowSupModal] = useState(false)
  const [supEditTarget, setSupEditTarget] = useState<FournisseurDto | null>(null)
  const [supForm, setSupForm] = useState<FournisseurSaveRequest>({
    code: '',
    raisonSociale: '',
    telephone: '',
    email: '',
    adresse: ''
  })
  const [supSaving, setSupSaving] = useState(false)
  const [supDeleteConfirm, setSupDeleteConfirm] = useState<FournisseurDto | null>(null)

  // ── Styles ─────────────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.5rem 0.75rem',
    border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem', fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem', fontWeight: 600,
    marginBottom: '0.25rem', color: 'var(--text-muted)',
  }

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
  }

  // ── API Handlers ───────────────────────────────────────────────────────────
  
  const fetchSuppliers = useCallback(async () => {
    setSupLoading(true)
    try {
      const res = await fournisseursApi.getAll(supPage, PAGE_SIZE, supSearch)
      setSuppliers(res.items)
      setSupTotal(res.total)
    } catch (err: any) {
      setApiError(err?.message || 'Failed to fetch suppliers')
    } finally {
      setSupLoading(false)
    }
  }, [supPage, supSearch])

  useEffect(() => { fetchSuppliers() }, [fetchSuppliers])

  // ── Supplier Handlers ──────────────────────────────────────────────────────

  const handleSupSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSupSaving(true)
    setApiError('')
    try {
      if (supEditTarget) {
        await fournisseursApi.update(supEditTarget.id, supForm)
        flash('Supplier updated successfully.')
      } else {
        await fournisseursApi.create(supForm)
        flash('Supplier created successfully.')
      }
      setShowSupModal(false)
      fetchSuppliers()
    } catch (err: any) {
      setApiError(err?.message || 'Save failed.')
    } finally {
      setSupSaving(false)
    }
  }

  const handleSupDelete = async () => {
    if (!supDeleteConfirm) return
    try {
      await fournisseursApi.delete(supDeleteConfirm.id)
      flash('Supplier deleted.')
      setSupDeleteConfirm(null)
      fetchSuppliers()
    } catch (err: any) {
      setApiError(err?.message || 'Delete failed.')
    }
  }

  const openSupModal = (sup?: FournisseurDto) => {
    setApiError('')
    if (sup) {
      setSupEditTarget(sup)
      setSupForm({
        code: sup.code,
        raisonSociale: sup.raisonSociale,
        telephone: sup.telephone || '',
        email: sup.email || '',
        adresse: sup.adresse || ''
      })
    } else {
      setSupEditTarget(null)
      setSupForm({ code: '', raisonSociale: '', telephone: '', email: '', adresse: '' })
    }
    setShowSupModal(true)
  }

  // ── Table Columns ──────────────────────────────────────────────────────────

  const supColumns: Column<FournisseurDto>[] = [
    { header: 'Code', accessor: (row) => <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{row.code}</span> },
    { header: 'Raison Sociale', accessor: 'raisonSociale' },
    { header: 'Telephone', accessor: 'telephone' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      accessor: (row) => <Badge variant={row.actif ? 'success' : 'danger'}>{row.actif ? 'Active' : 'Inactive'}</Badge> 
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => openSupModal(row)}>Edit</button>
          <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => setSupDeleteConfirm(row)}>Delete</button>
        </div>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
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

      {/* ── Suppliers Section ──────────────────────────────────────────────── */}
      <div>
        <div className="page-header">
          <div>
            <h2 className="page-title">Suppliers</h2>
            <p className="page-subtitle">Manage laboratory suppliers</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => openSupModal()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '0.5rem' }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Supplier
            </button>
          </div>
        </div>
        
        <Card noPadding>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="search-input-modern" style={{ maxWidth: '400px', flex: 1 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input 
                type="text" 
                placeholder="Search by code or name..." 
                value={supSearch}
                onChange={(e) => { setSupSearch(e.target.value); setSupPage(1); }}
              />
            </div>
          </div>
          
          <div className="table-container">
            {supLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading suppliers...</div>
            ) : (
              <DataTable data={suppliers} columns={supColumns} keyExtractor={(row) => row.id.toString()} />
            )}
          </div>

          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>Showing <strong>{suppliers.length}</strong> of <strong>{supTotal}</strong> suppliers</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={supPage === 1} onClick={() => setSupPage(p => p - 1)}>Previous</button>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 600, color: 'var(--text-main)' }}>{supPage} / {Math.ceil(supTotal / PAGE_SIZE) || 1}</div>
              <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} disabled={supPage * PAGE_SIZE >= supTotal} onClick={() => setSupPage(p => p + 1)}>Next</button>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Supplier Modal ─────────────────────────────────────────── */}
      {showSupModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card noPadding style={{ width: '100%', maxWidth: '580px', boxShadow: 'var(--shadow-floating)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>{supEditTarget ? 'Edit Supplier' : 'Add New Supplier'}</h3>
              <button onClick={() => setShowSupModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <form onSubmit={handleSupSave}>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {apiError && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500 }}>{apiError}</div>}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Code *</label>
                    <input className="form-control" value={supForm.code} onChange={e => setSupForm({ ...supForm, code: e.target.value })} required disabled={!!supEditTarget} placeholder="SUP001" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Raison Sociale *</label>
                    <input className="form-control" value={supForm.raisonSociale} onChange={e => setSupForm({ ...supForm, raisonSociale: e.target.value })} required placeholder="Company Name" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Telephone</label>
                    <input className="form-control" value={supForm.telephone} onChange={e => setSupForm({ ...supForm, telephone: e.target.value })} placeholder="+213..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" value={supForm.email} onChange={e => setSupForm({ ...supForm, email: e.target.value })} placeholder="contact@company.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse</label>
                  <input className="form-control" value={supForm.adresse} onChange={e => setSupForm({ ...supForm, adresse: e.target.value })} placeholder="123 Street, City" />
                </div>
              </div>
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowSupModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={supSaving} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                  {supSaving ? 'Saving...' : supEditTarget ? 'Save Changes' : 'Create Supplier'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ── Delete Confirmations ──────────────────────────────────────── */}
      {supDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card style={{ maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-floating)' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', 
              color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Supplier?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9375rem', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>{supDeleteConfirm.raisonSociale}</strong>?<br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSupDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleSupDelete}>Delete Supplier</button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}

export default Suppliers
