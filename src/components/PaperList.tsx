import { Paper, PaperStatus } from '@/types'

interface Props {
  papers: Paper[]
  loading: boolean
  skip: number
  limit: number
  statusFilter: PaperStatus | 'all'
  onSkipChange: (s: number) => void
  onStatusChange: (s: PaperStatus | 'all') => void
  onView: (p: Paper) => void
  onEdit: (p: Paper) => void
  onDelete: (id: number) => void
}

const filters: (PaperStatus | 'all')[] = ['all', 'unread', 'reading', 'completed']

export function PaperList({ papers, loading, skip, limit, statusFilter, onSkipChange, onStatusChange, onView, onEdit, onDelete }: Props) {
  if (loading) {
    return <p className="py-16 text-center text-sm text-muted-foreground">loading...</p>
  }

  const hasMore = papers.length === limit

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onStatusChange(f)}
            className={statusFilter === f ? 'underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'}
          >
            {f}
          </button>
        ))}
      </div>

      {papers.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">no papers</p>
      ) : (
        <ul className="divide-y">
          {papers.map((paper) => (
            <li key={paper.id} className="group py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <button onClick={() => onView(paper)} className="text-left text-sm font-medium hover:underline">
                    {paper.title}
                  </button>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
                    <span className="mx-1">/</span>
                    {paper.published_date}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                  <span>{paper.status}</span>
                  <span className="hidden gap-2 group-hover:flex">
                    <button onClick={() => onEdit(paper)} className="hover:text-foreground">edit</button>
                    <button onClick={() => onDelete(paper.id)} className="hover:text-foreground">del</button>
                  </span>
                </div>
              </div>
              {paper.abstract && (
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{paper.abstract}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {(skip > 0 || hasMore) && (
        <div className="mt-8 flex items-center justify-between text-sm">
          <button
            onClick={() => onSkipChange(Math.max(0, skip - limit))}
            disabled={skip === 0}
            className="disabled:opacity-30"
          >
            prev
          </button>
          <button
            onClick={() => onSkipChange(skip + limit)}
            disabled={!hasMore}
            className="disabled:opacity-30"
          >
            next
          </button>
        </div>
      )}
    </div>
  )
}
