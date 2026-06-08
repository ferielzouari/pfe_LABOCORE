// src/services/api.ts
const BASE_URL = 'http://localhost:8080/api'

// ── Types ─────────────────────────────────────────────────────────────────

export interface ArticleDetailsDto {
  codeArticle: string
  designationFr: string
  designationEn: string
  dureUtilisation: string
  uniteDure: string
  uom: string
  yieldValue: string
  unite: string
  precisionValue: string
  type: string
  modeGestion: string
  alerteAvant: string
  ficheSecuriteIds: number[]
  mentionRisqueIds: number[]
  prudenceIds: number[]
  examens: string[]
  automates: string[]
}

export interface ArticleSaveRequest {
  codeArticle: string
  designationFr: string
  designationEn?: string
  dureUtilisation?: string
  uniteDure?: string
  uom?: string
  yieldValue?: string
  unite?: string
  precisionValue?: string
  type?: string
  modeGestion?: string
  alerteAvant?: string
  ficheSecuriteIds?: number[]
  mentionRisqueIds?: number[]
  prudenceIds?: number[]
  examens: string[]
  automates?: string[]
}

export interface PagedResponse<T> {
  items: T[]
  page: number
  size: number
  total: number
}

export interface ApiError {
  status: number
  error: string
  message: string
  details: string[] | null
  timestamp: string
}

// ── Token helper ──────────────────────────────────────────────────────────

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('labocore_auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed.token || null
  } catch {
    return null
  }
}

// ── Helper ────────────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  })

  if (res.status === 401) {
    localStorage.removeItem('labocore_auth')
    window.location.href = '/login'
    throw new Error('Authorization failed. Please log in again.')
  }

  if (res.status === 204) {
    return undefined as T
  }

  // Read as text first to debug empty responses
  const text = await res.text()
  
  if (!text || text.trim() === '') {
    throw new Error(`Empty response from server for ${path}`)
  }

  const data = JSON.parse(text)
  if (!res.ok) throw data as ApiError
  return data as T
}

// ── Articles API ──────────────────────────────────────────────────────────

export const articlesApi = {
  getAll: (page = 1, size = 20, code = '', designation = '') =>
    request<PagedResponse<ArticleDetailsDto>>(
      `/articles?page=${page}&size=${size}&code=${encodeURIComponent(code)}&designation=${encodeURIComponent(designation)}`
    ),

  getOne: (codeArticle: string) =>
    request<ArticleDetailsDto>(`/articles/${encodeURIComponent(codeArticle)}`),

  create: (body: ArticleSaveRequest) =>
    request<ArticleDetailsDto>('/articles', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (codeArticle: string, body: ArticleSaveRequest) =>
    request<ArticleDetailsDto>(`/articles/${encodeURIComponent(codeArticle)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: (codeArticle: string) =>
    fetch(`${BASE_URL}/articles/${encodeURIComponent(codeArticle)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
    }).then(res => {
      if (!res.ok) return res.json().then(err => { throw err })
    }),
}

// ── Health API ────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => request<{ status: string }>('/health'),
}

// ── Samples API ───────────────────────────────────────────────────────────

export interface EchantillonDto {
  id: number
  sampleId: string
  patientId: string
  type: string
  priority: string
  collectedAt: string
  status: string
  notes?: string
}

export interface EchantillonSaveRequest {
  patientId: string
  type: string
  priority: string
  notes?: string
}

export const samplesApi = {
  getAll: (page = 1, size = 20, search = '', status = '') =>
    request<PagedResponse<EchantillonDto>>(
      `/samples?page=${page}&size=${size}&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`
    ),

  getOne: (id: number) =>
    request<EchantillonDto>(`/samples/${id}`),

  create: (body: EchantillonSaveRequest) =>
    request<EchantillonDto>('/samples', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateStatus: (id: number, status: string) =>
    request<EchantillonDto>(`/samples/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  delete: (id: number) =>
    fetch(`${BASE_URL}/samples/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
    }).then(res => {
      if (!res.ok) return res.json().then(err => { throw err })
    }),
}

// ── Risk Conditions API ───────────────────────────────────────────────────

export interface FicheSecuriteDto {
  id?: number
  code: string
  designation: string
  designationAng: string
}

export const riskConditionsApi = {
  getAll: (page = 1, size = 10, search = '') =>
    request<PagedResponse<FicheSecuriteDto>>(
      `/risk-conditions?page=${page}&size=${size}&search=${encodeURIComponent(search)}`
    ),

  getOne: (id: number) =>
    request<FicheSecuriteDto>(`/risk-conditions/${id}`),

  create: (body: FicheSecuriteDto) =>
    request<FicheSecuriteDto>('/risk-conditions', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  update: (id: number, body: FicheSecuriteDto) =>
    request<FicheSecuriteDto>(`/risk-conditions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: (id: number) =>
    fetch(`${BASE_URL}/risk-conditions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
    }).then(res => {
      if (!res.ok) return res.json().then(err => { throw err })
    }),
}

// ── Stock API ─────────────────────────────────────────────────────────────

export interface StockDto {
  codart: string
  desart: string
  unimes: string
  stkDep: number
  stkMin: number
  stkMax: number
  famArt: string
  actif: boolean
  stockStatus: string
}

export const stockApi = {
  getAll: (page = 1, size = 20, search = '', famArt = '') =>
    request<PagedResponse<StockDto>>(
      `/stock?page=${page}&size=${size}&search=${encodeURIComponent(search)}&famArt=${encodeURIComponent(famArt)}`
    ),
}

// ── Fournisseur API ───────────────────────────────────────────────────────

export interface FournisseurDto {
  id: number
  code: string
  raisonSociale: string
  telephone?: string
  email?: string
  adresse?: string
  actif: boolean
}

export interface FournisseurSaveRequest {
  code: string
  raisonSociale: string
  telephone?: string
  email?: string
  adresse?: string
}

export const fournisseursApi = {
  getAll: (page = 1, size = 20, search = '') =>
    request<PagedResponse<FournisseurDto>>(
      `/fournisseurs?page=${page}&size=${size}&search=${encodeURIComponent(search)}`
    ),
  getAllNoPagination: () => request<FournisseurDto[]>('/fournisseurs/all'),
  getOne: (id: number) => request<FournisseurDto>(`/fournisseurs/${id}`),
  create: (body: FournisseurSaveRequest) =>
    request<FournisseurDto>('/fournisseurs', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (id: number, body: FournisseurSaveRequest) =>
    request<FournisseurDto>(`/fournisseurs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: (id: number) =>
    fetch(`${BASE_URL}/fournisseurs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
    }).then(r => {
      if (!r.ok) return r.json().then(e => { throw e })
    }),
}

// ── BonReception API ──────────────────────────────────────────────────────

export interface BonReceptionDto {
  id: number
  numBon: string
  dateBon: string
  codFrs: string
  raisonSociale: string
  depot?: string
  nbArticles: number
}

export interface BonReceptionLigneRequest {
  codart: string
  desart?: string
  numLot?: string
  datePeremption?: string
  qteCmd: number
  qteRec?: number
}

export interface BonReceptionSaveRequest {
  codFrs: string
  depot?: string
  lignes: BonReceptionLigneRequest[]
}

export const bonReceptionApi = {
  getAll: (page = 1, size = 20, search = '') =>
    request<PagedResponse<BonReceptionDto>>(
      `/bon-reception-articles/list?page=${page}&size=${size}&search=${encodeURIComponent(search)}`
    ),
  getOne: (numBon: string) => request<BonReceptionDto>(`/bon-reception-articles/${encodeURIComponent(numBon)}`),
  create: (body: BonReceptionSaveRequest) =>
    request<BonReceptionDto>('/bon-reception-articles', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  delete: (numBon: string) =>
    fetch(`${BASE_URL}/bon-reception-articles/${encodeURIComponent(numBon)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
    }).then(r => {
      if (!r.ok) return r.json().then(e => { throw e })
    }),
}

// ── DemandeAnalyse API ────────────────────────────────────────────────────

export interface DemandeAnalyseDto {
  codeDemande: string
  designation: string
  designationAnglais?: string
  codeFamille?: string
  type?: number
  nbrAnalyseConst?: number
  actif?: boolean
  numOrdreExam?: number
}

export const analysesApi = {
  getAll: (page = 1, size = 20, search = '', famille = '', actif?: boolean) =>
    request<PagedResponse<DemandeAnalyseDto>>(
      `/analyses?page=${page}&size=${size}&search=${encodeURIComponent(search)}&famille=${encodeURIComponent(famille)}${actif !== undefined ? `&actif=${actif}` : ''}`
    ),
  getFamilies: () => request<string[]>('/analyses/families'),
}

// ── Technicien API ────────────────────────────────────────────────────────

export interface TechnicienDto {
  id: number
  matricule: string
  nom: string
  prenom: string
  specialite?: string
  telephone?: string
  email?: string
  service?: string
  actif: boolean
  dateEntree?: string
}

export interface TechnicienSaveRequest {
  matricule: string
  nom: string
  prenom: string
  specialite?: string
  telephone?: string
  email?: string
  service?: string
  dateEntree?: string
}

export const techniciensApi = {
  getAll: (page = 1, size = 12, search = '', service = '') =>
    request<PagedResponse<TechnicienDto>>(`/techniciens?page=${page}&size=${size}&search=${encodeURIComponent(search)}&service=${encodeURIComponent(service)}`),
  getOne: (id: number) => request<TechnicienDto>(`/techniciens/${id}`),
  getServices: () => request<string[]>('/techniciens/services'),
  create: (body: TechnicienSaveRequest) => request<TechnicienDto>('/techniciens', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: TechnicienSaveRequest) => request<TechnicienDto>(`/techniciens/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: number) => fetch(`${BASE_URL}/techniciens/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) } }).then(r => { if (!r.ok) return r.json().then(e => { throw e }) }),
}

// ── MouvementStock API ────────────────────────────────────────────────────

export interface MouvementStockDto {
  id: number
  codart: string
  typeMouvement: string
  quantite: number
  numLot?: string
  datePeremption?: string
  dateMouvement: string
  motif?: string
  utilisateur?: string
}

export interface MouvementStockSaveRequest {
  codart: string
  typeMouvement: 'SORTIE' | 'ENTREE' | 'AJUSTEMENT'
  quantite: number
  numLot?: string
  datePeremption?: string
  motif?: string
  utilisateur?: string
}

export const mouvementsApi = {
  getAll: (page = 1, size = 20, codart = '', type = '') =>
    request<PagedResponse<MouvementStockDto>>(
      `/mouvements?page=${page}&size=${size}&codart=${encodeURIComponent(codart)}&type=${encodeURIComponent(type)}`
    ),
  create: (body: MouvementStockSaveRequest) =>
    request<MouvementStockDto>('/mouvements', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id: number) =>
    fetch(`${BASE_URL}/mouvements/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) }
    }).then(r => { if (!r.ok) return r.json().then(e => { throw e }) }),
}

// ── Stock Alerts API ──────────────────────────────────────────────────────

export interface StockAlertDto {
  codart: string
  desart: string
  stkDep: number
  stkMin: number
  famArt: string
  supplierEmail?: string
  supplierName?: string
}

export interface NotificationLogDto {
  codart: string
  desart: string
  supplierName: string
  supplierEmail: string
  stockLevel: number
  sentAt: string
  status: string
}

export const stockAlertsApi = {
  getAlerts: () =>
    request<StockAlertDto[]>('/stock-alerts'),
  notifySupplier: (alert: StockAlertDto) =>
    request<{ message: string }>('/stock-alerts/notify', {
      method: 'POST',
      body: JSON.stringify(alert),
    }),
  getLogs: () =>
    request<NotificationLogDto[]>('/stock-alerts/logs'),
}

// ── EchantillonAnalyse API ────────────────────────────────────────────────

export interface EchantillonAnalyseDto {
  id: number
  echantillonId: number
  sampleId: string
  patientId: string
  codeDemande: string
  designationAnalyse: string
  statut: string
  resultat?: string
  dateAssignation: string
}

export interface EchantillonAnalyseSaveRequest {
  echantillonId: number
  codeDemande: string
  statut?: string
}

export const echantillonAnalysesApi = {
  getAll: (page = 1, size = 20, echantillonId?: number, statut = '') =>
    request<PagedResponse<EchantillonAnalyseDto>>(
      `/echantillon-analyses?page=${page}&size=${size}${echantillonId ? `&echantillonId=${echantillonId}` : ''}&statut=${encodeURIComponent(statut)}`
    ),
  getBySample: (echantillonId: number) =>
    request<EchantillonAnalyseDto[]>(`/echantillon-analyses/sample/${echantillonId}`),
  create: (body: EchantillonAnalyseSaveRequest) =>
    request<EchantillonAnalyseDto>('/echantillon-analyses', { method: 'POST', body: JSON.stringify(body) }),
  updateStatut: (id: number, statut: string, resultat?: string) =>
    request<EchantillonAnalyseDto>(`/echantillon-analyses/${id}/statut`, {
      method: 'PATCH', body: JSON.stringify({ statut, resultat })
    }),
  delete: (id: number) =>
    fetch(`${BASE_URL}/echantillon-analyses/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) }
    }).then(r => { if (!r.ok) return r.json().then(e => { throw e }) }),
}