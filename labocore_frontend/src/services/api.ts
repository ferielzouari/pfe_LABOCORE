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
    throw new Error('Session expired. Please log in again.')
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T
  }

  const data = await res.json()
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