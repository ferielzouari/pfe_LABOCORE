import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { techniciensApi, TechnicienDto, TechnicienSaveRequest } from '../services/api'

const PAGE_SIZE = 12

const Technicians: React.FC = () => {
  const [data, setData] = useState<TechnicienDto[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [service, setService] = useState('')
  const [services, setServices] = useState<string[]>([])
  
  // Modals
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedTech, setSelectedTech] = useState<TechnicienDto | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<TechnicienSaveRequest>({
    matricule: '',
    nom: '',
    prenom: '',
    specialite: '',
    telephone: '',
    email: '',
    service: '',
    dateEntree: ''
  })
  
  const [apiError, setApiError] = useState('')
  const [apiSuccess, setApiSuccess] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await techniciensApi.getAll(page, PAGE_SIZE, search, service)
      setData(res.items)
      setTotal(res.total)
    } catch (err) {
      console.error('Failed to fetch technicians', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, service])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    techniciensApi.getServices().then(setServices).catch(console.error)
  }, [])

  useEffect(() => {
    if (apiSuccess) {
      const timer = setTimeout(() => setApiSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [apiSuccess])

  const handleAdd = () => {
    setSelectedTech(null)
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      specialite: '',
      telephone: '',
      email: '',
      service: '',
      dateEntree: ''
    })
    setApiError('')
    setShowForm(true)
  }

  const handleEdit = (tech: TechnicienDto) => {
    setSelectedTech(tech)
    setFormData({
      matricule: tech.matricule,
      nom: tech.nom,
      prenom: tech.prenom,
      specialite: tech.specialite || '',
      telephone: tech.telephone || '',
      email: tech.email || '',
      service: tech.service || '',
      dateEntree: tech.dateEntree || ''
    })
    setApiError('')
    setShowForm(true)
    setShowDetail(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    try {
      if (selectedTech) {
        await techniciensApi.update(selectedTech.id, formData)
        setApiSuccess('Staff member updated successfully.')
      } else {
        await techniciensApi.create(formData)
        setApiSuccess('Staff member added successfully.')
      }
      setShowForm(false)
      fetchData()
    } catch (err: any) {
      setApiError(err?.message || 'Failed to save staff member.')
    }
  }

  const handleDelete = async () => {
    if (!selectedTech) return
    try {
      await techniciensApi.delete(selectedTech.id)
      setApiSuccess('Staff member deleted successfully.')
      setShowDelete(false)
      fetchData()
    } catch (err: any) {
      setApiError(err?.message || 'Failed to delete staff member.')
    }
  }

  const getInitials = (nom: string, prenom: string) => {
    return (nom[0] || '').toUpperCase() + (prenom[0] || '').toUpperCase()
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Lab Staff</h2>
          <p className="page-subtitle">Manage technicians and roles</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Staff
          </button>
        </div>
      </div>

      {apiSuccess && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
          {apiSuccess}
        </div>
      )}

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-input-modern" style={{ flex: '1', maxWidth: '400px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or matricule..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select
          className="form-control"
          style={{ width: 'auto', minWidth: '200px' }}
          value={service}
          onChange={(e) => { setService(e.target.value); setPage(1) }}
        >
          <option value="">All Services</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '6rem' }}>
          <div style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
            <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0110 10" /></svg>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Loading staff members...</p>
        </div>
      ) : data.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface-color)', borderStyle: 'dashed', borderWidth: '2px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--surface-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
            color: 'var(--text-light)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No staff members found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem' }}>We couldn't find any technicians matching your current filters.</p>
          <button className="btn btn-primary" onClick={handleAdd}>Add New Staff Member</button>
        </Card>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {data.map(tech => (
              <Card key={tech.id} style={{ 
                position: 'relative', display: 'flex', flexDirection: 'column', padding: '1.5rem',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }} className="tech-card-hover">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(109, 40, 217, 0.2)'
                  }}>
                    {getInitials(tech.nom, tech.prenom)}
                  </div>
                  <Badge variant={tech.actif ? 'success' : 'danger'} style={{ fontSize: '0.625rem' }}>
                    {tech.actif ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {tech.prenom} {tech.nom}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    {tech.matricule}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                      {tech.service || 'No Service'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      {tech.specialite || 'Generalist'}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 1, fontSize: '0.8125rem', fontWeight: 600 }}
                    onClick={() => { setSelectedTech(tech); setShowDetail(true); }}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '0.5rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => handleEdit(tech)}
                    title="Edit Profile"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1-1-4 9.5-9.5z" /></svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Showing <strong>{data.length}</strong> of <strong>{total}</strong> staff members
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }}
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {page} / {totalPages || 1}
              </div>
              <button 
                className="btn btn-outline" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }}
                disabled={page === totalPages || totalPages === 0} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card noPadding style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-floating)' }}>
            {/* Modal Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                {selectedTech ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave}>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {apiError && (
                  <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500 }}>
                    {apiError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Matricule *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.matricule}
                      onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                      placeholder="e.g. TECH001"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Specialite</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.specialite}
                      onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                      placeholder="e.g. Hematology"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nom *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Last name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prénom *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      placeholder="First name"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Service</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      placeholder="e.g. Core Lab"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      placeholder="+216 ..."
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@clinisys.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Entrée</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dateEntree}
                      onChange={(e) => setFormData({ ...formData, dateEntree: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                  {selectedTech ? 'Save Changes' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedTech && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card noPadding style={{ width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-floating)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Staff Profile</h3>
              <button onClick={() => setShowDetail(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(109, 40, 217, 0.3)'
                }}>
                  {getInitials(selectedTech.nom, selectedTech.prenom)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {selectedTech.prenom} {selectedTech.nom}
                  </h4>
                  <Badge variant={selectedTech.actif ? 'success' : 'danger'}>
                    {selectedTech.actif ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Matricule</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{selectedTech.matricule}</p>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Service</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{selectedTech.service || '-'}</p>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Specialité</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{selectedTech.specialite || '-'}</p>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Téléphone</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{selectedTech.telephone || '-'}</p>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Email</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{selectedTech.email || '-'}</p>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.25rem' }}>Date Entrée</label>
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>{selectedTech.dateEntree || '-'}</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', justifyContent: 'space-between', background: 'var(--surface-hover)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
              <button 
                className="btn btn-outline" 
                style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                onClick={() => setShowDelete(true)}
              >
                Delete Member
              </button>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-outline" onClick={() => setShowDetail(false)}>Close</button>
                <button className="btn btn-primary" onClick={() => handleEdit(selectedTech)}>Edit Profile</button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && selectedTech && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: 'var(--shadow-floating)' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', 
              color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Delete Staff Member?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9375rem', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>{selectedTech.prenom} {selectedTech.nom}</strong>?<br/>This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleDelete}>Delete Member</button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default Technicians
