export type PaperStatus = 'unread' | 'reading' | 'completed' | 'archived'

export interface Paper {
  id: number
  arxiv_id: string
  title: string
  authors: string[]
  abstract: string
  subjects: string[]
  published_date: string
  pdf_url: string
  arxiv_url: string
  status: PaperStatus
  note: string | null
  created_at: string
  updated_at: string
}

export interface Author {
  name: string
  paper_count: number
}

export interface Subject {
  name: string
  paper_count: number
}

export interface Stats {
  total_papers: number
  papers_by_status: {
    reading: number
    unread: number
    completed: number
  }
  top_authors: Array<{
    name: string
    paper_count: number
  }>
  top_subjects: Array<{
    name: string
    paper_count: number
  }>
  recent_papers: Array<{
    id: string
    title: string
    status: PaperStatus
  }>
}

export interface PaginationParams {
  skip?: number
  limit?: number
  status?: PaperStatus
}

export interface SearchParams {
  query?: string
  author?: string
  subject?: string
  status?: PaperStatus
  date_from?: string
  date_to?: string
}
