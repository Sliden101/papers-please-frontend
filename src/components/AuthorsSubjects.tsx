import { Author, Subject } from '@/types'

interface Props {
  authors: Author[]
  subjects: Subject[]
  loading: boolean
}

export function AuthorsSubjects({ authors, subjects, loading }: Props) {
  if (loading) {
    return <p className="py-16 text-center text-sm text-muted-foreground">loading...</p>
  }

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div>
        <h2 className="mb-4 text-xs uppercase tracking-wide text-muted-foreground">
          Authors ({authors.length})
        </h2>
        <ul className="space-y-1 text-sm">
          {authors.map((a) => (
            <li key={a.name} className="flex justify-between">
              <span>{a.name}</span>
              <span className="text-muted-foreground">{a.paper_count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-4 text-xs uppercase tracking-wide text-muted-foreground">
          Subjects ({subjects.length})
        </h2>
        <ul className="space-y-1 text-sm">
          {subjects.map((s) => (
            <li key={s.name} className="flex justify-between">
              <span>{s.name}</span>
              <span className="text-muted-foreground">{s.paper_count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
