import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import DataTable, { Column } from '../components/DataTable'
import Badge from '../components/Badge'
import { stockApi, StockDto } from '../services/api'

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

  const totalPages = Math.ceil(total / PAGE_SIZE)

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
    </>
  )
}

export default Inventory
