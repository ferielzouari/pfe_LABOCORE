import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import DataTable, { Column } from '../components/DataTable'
import {
  fournisseursApi,
  bonReceptionApi,
  FournisseurDto,
  BonReceptionDto,
  BonReceptionSaveRequest,
  BonReceptionLigneRequest
} from '../services/api'

const PAGE_SIZE = 5

const GoodsReception: React.FC = () => {
  // ── Shared UI State ────────────────────────────────────────────────────────
  const [successMsg, setSuccessMsg] = useState('')
  const [apiError, setApiError] = useState('')

  const flash = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // ── Bon Reception State ────────────────────────────────────────────────────
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

  // ── API Handlers ───────────────────────────────────────────────────────────

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

  // ── Bon Handlers ───────────────────────────────────────────────────────────

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

  // ── Table Columns ──────────────────────────────────────────────────────────

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
  )
}

export default GoodsReception
