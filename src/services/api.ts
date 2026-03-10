import { Paper, Author, Subject, Stats, PaginationParams, SearchParams, PaperStatus } from '@/types'

//const API_BASE = 'http://localhost:8000/api'
const API_BASE = import.meta.API_BASE;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || 'Request failed')
  }
  return res.json()
}

// Health Check - GET /api/health
export async function checkHealth(): Promise<{ status: string }> {
  return request('/health')
}

// Add Paper - POST /api/v1/add_paper
export async function addPaper(arxiv_id: string): Promise<Paper> {
  return request('/v1/add_paper', {
    method: 'POST',
    body: JSON.stringify({ arxiv_id }),
  })
}

// List Papers - GET /api/v1/papers
export async function listPapers(params: PaginationParams = {}): Promise<Paper[]> {
  const searchParams = new URLSearchParams()
  if (params.skip !== undefined) searchParams.set('skip', String(params.skip))
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit))
  if (params.status) searchParams.set('status', params.status)
  
  const query = searchParams.toString()
  return request(`/v1/papers${query ? `?${query}` : ''}`)
}

// Get Paper - GET /api/v1/papers/{paper_id}
export async function getPaper(paperId: number): Promise<Paper> {
  return request(`/v1/papers/${paperId}`)
}

// Update Paper - PUT /api/v1/papers/{paper_id}
export async function updatePaper(
  paperId: number,
  updates: { status?: PaperStatus; notes?: string }
): Promise<Paper> {
  return request(`/v1/papers/${paperId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

// Delete Paper - DELETE /api/v1/papers/{paper_id}
export async function deletePaper(paperId: number): Promise<Paper> {
  return request(`/v1/papers/${paperId}`, { method: 'DELETE' })
}

// Search - GET /api/v1/search
export async function searchPapers(params: SearchParams): Promise<{query: string; count: number; results: Paper[]}> {
  const searchParams = new URLSearchParams()
  if (params.query) searchParams.set('q', params.query)
  if (params.author) searchParams.set('author', params.author)
  if (params.subject) searchParams.set('subject', params.subject)
  if (params.status) searchParams.set('status', params.status)
  //if (params.date_from) searchParams.set('date_from', params.date_from)
  //if (params.date_to) searchParams.set('date_to', params.date_to)
  
  const query = searchParams.toString()
  return request(`/v1/search${query ? `?${query}` : ''}`)
}

// Statistics - GET /api/v1/stats
export async function getStats(): Promise<Stats> {
  return request('/v1/stats')
}

// List Authors - GET /api/v1/authors
export async function listAuthors(): Promise<Author[]> {
  return request('/v1/authors')
}

// List Subjects - GET /api/v1/subjects
export async function listSubjects(): Promise<Subject[]> {
  return request('/v1/subjects')
}
