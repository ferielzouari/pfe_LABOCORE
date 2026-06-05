import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import DataTable, { Column } from '../components/DataTable'
import Badge from '../components/Badge'
import { stockApi, StockDto, mouvementsApi, MouvementStockDto, MouvementStockSaveRequest } from '../services/api'

const Inventory: React.FC = () => {
  const [stock, setStock] = useState<StockDto[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [famArtFilter, setFamArtFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const PAGE_SIZE = 20
  const MV_PAGE_SIZE = 20

  // ── Mouvements state ────────────────────────────────────────────────────
  const [mouvements, setMouvements] = useState<MouvementStockDto[]>([])
  const [mvTotal, setMvTotal] = useState(0)
  const [mvPage, setMvPage] = useState(1)
  const [mvCodart, setMvCodart] = useState('')
  const [mvType, setMvType] = useState('')
  const [mvLoading, setMvLoading] = useState(false)
  const [mvError, setMvError] = useState('')
  const [showMvModal, setShowMvModal] = useState(false)
  const [mvSaving, setMvSaving] = useState(false)
  const [mvForm, setMvForm] = useState<MouvementStockSaveRequest>({
    codart: '', typeMouvement: 'SORTIE', quantite: 0,
  })

  const fetchStock = useCallback(async () => {
    setLoading(true)
    setApiError('')
    try {
      const res = await stockApi.getAll(page, PAGE_SIZE, search, famArtFilter)
      setStock(res.items)
      setTotal(res.total)
    } catch (err: any) {
      setApiError(err?.message || err?.error || JSON.stringify(err) || 'Failed to load inventory.')
    } finally {
      setLoading(false)
    }
  }, [page, search, famArtFilter])

  useEffect(() => {
    fetchStock()
  }, [fetchStock])

  const fetchMouvements = useCallback(async () => {
    setMvLoading(true)
    setMvError('')
    try {
      const res = await mouvementsApi.getAll(mvPage, MV_PAGE_SIZE, mvCodart, mvType)
      setMouvements(res.items)
      setMvTotal(res.total)
    } catch (err: any) {
      setMvError(err?.message || err?.error || 'Failed to load movements.')
    } finally {
      setMvLoading(false)
    }
  }, [mvPage, mvCodart, mvType])

  useEffect(() => {
    fetchMouvements()
  }, [fetchMouvements])

  // ── Export ──────────────────────────────────────────────────────────────

  const handleExport = async () => {
    setIsExporting(true)
    setApiError('')
    try {
      const res = await stockApi.getAll(1, 10000, search, famArtFilter) // large limit
      const data = res.items

      const headers = ['Code', 'Designation', 'Unit', 'Current Stock', 'Min Stock', 'Max Stock', 'Family', 'Status']
      const rows = data.map((row) => [
        `"${row.codart || ''}"`,
        `"${(row.desart || '').replace(/"/g, '""')}"`,
        `"${row.unimes || ''}"`,
        `"${row.stkDep ?? ''}"`,
        `"${row.stkMin ?? ''}"`,
        `"${row.stkMax ?? ''}"`,
        `"${row.famArt || ''}"`,
        `"${row.stockStatus || ''}"`
      ])

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      const dateStr = new Date().toISOString().split('T')[0]
      link.href = url
      link.setAttribute('download', `inventory_export_${dateStr}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setApiError(err?.message || 'Failed to export inventory.')
    } finally {
      setIsExporting(false)
    }
  }

  // ── Mouvement modal helpers ─────────────────────────────────────────────

  const openMvModal = () => {
    setMvForm({ codart: '', typeMouvement: 'SORTIE', quantite: 0 })
    setMvError('')
    setShowMvModal(true)
  }

  const handleMvCreate = async () => {
    if (!mvForm.codart.trim()) { setMvError('Article Code is required.'); return }
    if (!mvForm.quantite || mvForm.quantite <= 0) { setMvError('Quantity must be greater than 0.'); return }
    setMvSaving(true)
    setMvError('')
    try {
      await mouvementsApi.create(mvForm)
      setShowMvModal(false)
      fetchMouvements()
    } catch (err: any) {
      setMvError(err?.message || err?.error || 'Failed to create movement.')
    } finally {
      setMvSaving(false)
    }
  }

  const handleMvDelete = async (id: number) => {
    if (!window.confirm('Delete this movement? This action cannot be undone.')) return
    setMvError('')
    try {
      await mouvementsApi.delete(id)
      fetchMouvements()
    } catch (err: any) {
      setMvError(err?.message || err?.error || 'Failed to delete movement.')
    }
  }

  // ── Stock columns ───────────────────────────────────────────────────────

  const columns: Column<StockDto>[] = [
    {
      header: 'Code',
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{row.codart}</span>
      )
    },
    {
      header: 'Designation',
      accessor: (row) => <span style={{ fontWeight: 500 }}>{row.desart}</span>
    },
    { header: 'Unit', accessor: 'unimes', className: 'table-desktop-only' },
    {
      header: 'Current Stock',
      accessor: (row) => <span style={{ fontWeight: 600 }}>{row.stkDep}</span>
    },
    {
      header: 'Min Stock',
      accessor: 'stkMin',
      className: 'table-desktop-only'
    },
    {
      header: 'Max Stock',
      accessor: 'stkMax',
      className: 'table-desktop-only'
    },
    { header: 'Family', accessor: 'famArt', className: 'table-desktop-only' },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.stockStatus === 'Critical' ? 'danger' : 'success'}>
          {row.stockStatus}
        </Badge>
      )
    }
  ]

  // ── Mouvement columns ───────────────────────────────────────────────────

  const mvColumns: Column<MouvementStockDto>[] = [
    {
      header: 'Article Code',
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{row.codart}</span>
      )
    },
    {
      header: 'Type',
      accessor: (row) => (
        <Badge variant={row.typeMouvement === 'SORTIE' ? 'danger' : row.typeMouvement === 'ENTREE' ? 'success' : 'info'}>
          {row.typeMouvement}
        </Badge>
      )
    },
    {
      header: 'Quantity',
      accessor: (row) => <span style={{ fontWeight: 600 }}>{String(row.quantite)}</span>
    },
    { header: 'Lot N°', accessor: (row) => row.numLot || '—', className: 'table-desktop-only' },
    {
      header: 'Expiry Date',
      accessor: (row) => row.datePeremption ? new Date(row.datePeremption).toLocaleDateString() : '—',
      className: 'table-desktop-only'
    },
    {
      header: 'Movement Date',
      accessor: (row) => new Date(row.dateMouvement).toLocaleString()
    },
    { header: 'Motif', accessor: (row) => row.motif || '—', className: 'table-desktop-only' },
    { header: 'User', accessor: (row) => row.utilisateur || '—', className: 'table-desktop-only' },
    {
      header: '',
      accessor: (row) => (
        <button
          className="btn btn-outline"
          style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          onClick={() => handleMvDelete(row.id)}
        >
          Delete
        </button>
      )
    }
  ]

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const mvTotalPages = Math.ceil(mvTotal / MV_PAGE_SIZE)

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Inventory</h2>
          <p className="page-subtitle">Track reagents, consumables, and lab supplies</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-outline"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {apiError && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {apiError}
        </div>
      )}

      <Card noPadding>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div className="search-input" style={{ width: '280px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', display: 'flex' }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--text-muted)"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             <input
               type="text"
               placeholder="Search by code or designation..."
               value={search}
               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
             />
          </div>

          <select
            className="form-control"
            style={{ width: '160px', borderRadius: 'var(--radius-full)' }}
            value={famArtFilter}
            onChange={e => { setFamArtFilter(e.target.value); setPage(1) }}
          >
            <option value="">All Families</option>
            <option value="REACTIFS">REACTIFS</option>
            <option value="CONSOMMABLES">CONSOMMABLES</option>
            <option value="DIVERS">DIVERS</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading inventory…</div>
        ) : (
          <DataTable data={stock} columns={columns} keyExtractor={r => r.codart} />
        )}

        {totalPages > 1 && (
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>Showing {stock.length} of {total} items</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '0.25rem 0.5rem', alignSelf: 'center' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Stock Movements Section ─────────────────────────────────────────── */}

      <div className="page-header" style={{ marginTop: '2rem' }}>
        <div>
          <h2 className="page-title">Stock Movements</h2>
          <p className="page-subtitle">Track reagent consumption, reception and adjustments</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openMvModal}>+ Add Movement</button>
        </div>
      </div>

      {mvError && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {mvError}
        </div>
      )}

      <Card noPadding>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-input" style={{ width: '240px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', display: 'flex' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--text-muted)"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Filter by article code..."
              value={mvCodart}
              onChange={e => { setMvCodart(e.target.value); setMvPage(1) }}
            />
          </div>
          <select
            className="form-control"
            style={{ width: '180px', borderRadius: 'var(--radius-full)' }}
            value={mvType}
            onChange={e => { setMvType(e.target.value); setMvPage(1) }}
          >
            <option value="">All Types</option>
            <option value="SORTIE">SORTIE</option>
            <option value="ENTREE">ENTREE</option>
            <option value="AJUSTEMENT">AJUSTEMENT</option>
          </select>
        </div>

        {mvLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading movements…</div>
        ) : (
          <DataTable data={mouvements} columns={mvColumns} keyExtractor={r => String(r.id)} />
        )}

        {mvTotalPages > 1 && (
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>Showing {mouvements.length} of {mvTotal} movements</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }} disabled={mvPage === 1} onClick={() => setMvPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '0.25rem 0.5rem', alignSelf: 'center' }}>Page {mvPage} of {mvTotalPages}</span>
              <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }} disabled={mvPage === mvTotalPages} onClick={() => setMvPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Add Movement Modal ──────────────────────────────────────────────── */}

      {showMvModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)', overflowY: 'auto' }}>
          <Card noPadding style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-floating)', margin: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>New Stock Movement</h3>
              <button onClick={() => setShowMvModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {mvError && (
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {mvError}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Article Code *</label>
                <input
                  className="form-control"
                  value={mvForm.codart}
                  onChange={e => setMvForm(f => ({ ...f, codart: e.target.value }))}
                  placeholder="e.g. ART001"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select
                  className="form-control"
                  value={mvForm.typeMouvement}
                  onChange={e => setMvForm(f => ({ ...f, typeMouvement: e.target.value as MouvementStockSaveRequest['typeMouvement'] }))}
                >
                  <option value="SORTIE">SORTIE</option>
                  <option value="ENTREE">ENTREE</option>
                  <option value="AJUSTEMENT">AJUSTEMENT</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="0.001"
                  value={mvForm.quantite}
                  onChange={e => setMvForm(f => ({ ...f, quantite: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lot N°</label>
                <input
                  className="form-control"
                  value={mvForm.numLot || ''}
                  onChange={e => setMvForm(f => ({ ...f, numLot: e.target.value || undefined }))}
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  className="form-control"
                  type="datetime-local"
                  value={mvForm.datePeremption || ''}
                  onChange={e => setMvForm(f => ({ ...f, datePeremption: e.target.value || undefined }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Motif</label>
                <input
                  className="form-control"
                  value={mvForm.motif || ''}
                  onChange={e => setMvForm(f => ({ ...f, motif: e.target.value || undefined }))}
                  placeholder="Optional reason"
                />
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
              <button className="btn btn-outline" onClick={() => setShowMvModal(false)} disabled={mvSaving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleMvCreate} disabled={mvSaving} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                {mvSaving ? 'Saving...' : 'Save Movement'}
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default Inventory
