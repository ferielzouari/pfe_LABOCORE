import React from 'react'
import Card from '../components/Card'
import DataTable, { Column } from '../components/DataTable'
import Badge from '../components/Badge'

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  supplier: string;
}

const mockInventory: InventoryItem[] = [
  { id: 'INV-001', name: 'Ethanol 70%', category: 'Solvents', stock: 45, unit: 'L', status: 'In Stock', supplier: 'ChemSupply' },
  { id: 'INV-002', name: 'PCR Tubes 0.2ml', category: 'Consumables', stock: 120, unit: 'Boxes', status: 'In Stock', supplier: 'BioPlast' },
  { id: 'INV-003', name: 'Taq Polymerase', category: 'Reagents', stock: 5, unit: 'Vials', status: 'Low Stock', supplier: 'GeneTech' },
  { id: 'INV-004', name: 'Nitrile Gloves (M)', category: 'Safety', stock: 0, unit: 'Boxes', status: 'Out of Stock', supplier: 'SafeMed' },
  { id: 'INV-005', name: 'Agarose Powder', category: 'Reagents', stock: 12, unit: 'kg', status: 'In Stock', supplier: 'ChemSupply' },
]

const Inventory: React.FC = () => {
  const columns: Column<InventoryItem>[] = [
    { 
      header: 'Item', 
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: 600, display: 'block', color: 'var(--text-main)', marginBottom: '2px' }}>{row.name}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.id}</span>
        </div>
      ) 
    },
    { header: 'Category', accessor: 'category', className: 'table-desktop-only' },
    { 
      header: 'Stock', 
      accessor: (row) => <span style={{ fontWeight: 500 }}>{row.stock} {row.unit}</span> 
    },
    { 
      header: 'Status', 
      accessor: (row) => {
        const variantMap: Record<string, any> = {
          'In Stock': 'success',
          'Low Stock': 'warning',
          'Out of Stock': 'danger'
        }
        return <Badge variant={variantMap[row.status]}>{row.status}</Badge>
      }
    },
    { header: 'Supplier', accessor: 'supplier', className: 'table-desktop-only' },
    { 
      header: 'Actions', 
      accessor: (row) => (
        <button 
          className="btn btn-outline" 
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: row.status === 'Out of Stock' ? 'var(--primary-color)' : 'inherit' }}
        >
          {row.status === 'Out of Stock' ? 'Reorder' : 'Update'}
        </button>
      ) 
    }
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Inventory</h2>
          <p className="page-subtitle">Track reagents, consumables, and lab supplies</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             Add Item
          </button>
        </div>
      </div>

      <div className="grid-cols-3 mb-6">
        <Card>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Items</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>842</div>
        </Card>
        <Card style={{ borderColor: 'var(--warning-bg)', backgroundColor: 'var(--warning-bg)' }}>
          <div style={{ color: 'var(--warning)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Low Stock Alerts</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--warning)' }}>24</div>
        </Card>
        <Card style={{ borderColor: 'var(--danger-bg)', backgroundColor: 'var(--danger-bg)' }}>
          <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Out of Stock</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--danger)' }}>5</div>
        </Card>
      </div>

      <Card noPadding>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="search-input" style={{ width: '280px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--text-muted)"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
               <input type="text" placeholder="Search inventory..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }}>Filter</button>
          </div>
        </div>
        <DataTable data={mockInventory} columns={columns} keyExtractor={r => r.id} />
      </Card>
    </>
  )
}

export default Inventory
