import { useState } from 'react'
import { Paper, SearchParams, Author, Subject, PaperStatus } from '@/types'
import { searchPapers } from '@/services/api'

interface Props {
  authors: Author[]
  subjects: Subject[]
  onViewPaper: (p: Paper) => void
}

export function SearchPanel({ authors, subjects, onViewPaper }: Props) {
  const [params, setParams] = useState<SearchParams>({})
  const [results, setResults] = useState<Paper[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const authorsList = Array.isArray(authors) ? authors : []
  const subjectsList = Array.isArray(subjects) ? subjects : []
  
  const search = async () => {
    setLoading(true)
    setSearched(true)
    try {
      const data = await searchPapers(params)
      console.log(data)
      setResults(data.results || [])
    } catch (e) {
      console.error(e)
      setResults([])
    }
    setLoading(false)
  }

  const clear = () => {
    setParams({})
    setResults([])
    setSearched(false)
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="search..."
            value={params.query || ''}
            onChange={(e) => setParams({ ...params, query: e.target.value || undefined })}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            className="h-8 flex-1 border-b bg-transparent px-0 text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <button onClick={search} disabled={loading} className="text-sm hover:underline disabled:opacity-50">
            go
          </button>
          {searched && (
            <button onClick={clear} className="text-sm text-muted-foreground hover:text-foreground">
              clear
            </button>
          )}
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-4">
          <select
            value={params.author || ''}
            onChange={(e) => setParams({ ...params, author: e.target.value || undefined })}
            className="h-8 border-b bg-transparent px-0 focus:outline-none"
          >
            <option value="">any author</option>
            {authors.map((a) => <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>

          <select
            value={params.subject || ''}
            onChange={(e) => setParams({ ...params, subject: e.target.value || undefined })}
            className="h-8 border-b bg-transparent px-0 focus:outline-none"
          >
            <option value="">any subject</option>
            {subjects.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>

          <select
            value={params.status || ''}
            onChange={(e) => setParams({ ...params, status: (e.target.value as PaperStatus) || undefined })}
            className="h-8 border-b bg-transparent px-0 focus:outline-none"
          >
            <option value="">any status</option>
            <option value="unread">unread</option>
            <option value="reading">reading</option>
            <option value="completed">completed</option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={params.date_from || ''}
              onChange={(e) => setParams({ ...params, date_from: e.target.value || undefined })}
              className="h-8 w-full border-b bg-transparent px-0 text-sm focus:outline-none"
            />
            <input
              type="date"
              value={params.date_to || ''}
              onChange={(e) => setParams({ ...params, date_to: e.target.value || undefined })}
              className="h-8 w-full border-b bg-transparent px-0 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {searched && (
        <div className="mt-8">
          <p className="mb-4 text-xs text-muted-foreground">
            {loading ? 'searching...' : `${results.length} result${results.length !== 1 ? 's' : ''}`}
          </p>

          {!loading && results.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">nothing found</p>
          ) : (
            <ul className="divide-y">
              {results.map((p) => (
                <li key={p.id} className="flex items-baseline justify-between gap-4 py-3">
                  <button onClick={() => onViewPaper(p)} className="min-w-0 flex-1 truncate text-left text-sm hover:underline">
                    {p.title}
                  </button>
                  <span className="shrink-0 text-xs text-muted-foreground">{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
