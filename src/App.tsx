import { useState, useEffect, useCallback } from 'react'
import { PaperList } from '@/components/PaperList'
import { SearchPanel } from '@/components/SearchPanel'
import { AuthorsSubjects } from '@/components/AuthorsSubjects'
import { AddPaperDialog } from '@/components/AddPaperDialog'
import { PaperDetailDialog } from '@/components/PaperDetailDialog'
import { EditPaperDialog } from '@/components/EditPaperDialog'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { Paper, Stats, Author, Subject, PaperStatus } from '@/types'
import {
  listPapers,
  getStats,
  listAuthors,
  listSubjects,
  addPaper,
  updatePaper,
  deletePaper,
  checkHealth,
} from '@/services/api'

type View = 'list' | 'search' | 'browse'

function App() {
  const [view, setView] = useState<View>('list')
  const [health, setHealth] = useState<'ok' | 'err' | 'pending'>('pending')

  const [papers, setPapers] = useState<Paper[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [authors, setAuthors] = useState<Author[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  const [loading, setLoading] = useState(true)
  const [skip, setSkip] = useState(0)
  const [statusFilter, setStatusFilter] = useState<PaperStatus | 'all'>('all')
  const limit = 20

  const [addOpen, setAddOpen] = useState(false)
  const [selected, setSelected] = useState<Paper | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toDelete, setToDelete] = useState<number | null>(null)

  useEffect(() => {
    checkHealth().then(() => setHealth('ok')).catch(() => setHealth('err'))
    const i = setInterval(() => {
      checkHealth().then(() => setHealth('ok')).catch(() => setHealth('err'))
    }, 30000)
    return () => clearInterval(i)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [papersRes, statsRes, authorsRes, subjectsRes] = await Promise.all([
        listPapers({ skip, limit, status: statusFilter === 'all' ? undefined : statusFilter }),
        getStats(),
        listAuthors(),
        listSubjects(),
      ])
      setPapers(papersRes)
      setStats(statsRes)
      setAuthors(authorsRes)
      setSubjects(subjectsRes)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [skip, statusFilter])

  useEffect(() => { load() }, [load])

  const handleAdd = async (arxivId: string) => {
    await addPaper(arxivId)
    load()
  }

  const handleUpdate = async (id: number, updates: { status?: PaperStatus; notes?: string }) => {
    await updatePaper(id, updates)
    load()
  }

  const handleDelete = async (id: number) => {
    await deletePaper(id)
    load()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <div className="flex items-baseline justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Papers Please</h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${health === 'ok' ? 'bg-green-600' : health === 'err' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              {health === 'ok' ? 'connected' : health === 'err' ? 'offline' : '...'}
            </span>
            <button onClick={() => setAddOpen(true)} className="text-sm underline underline-offset-2 hover:no-underline">
              + add
            </button>
          </div>
        </div>

        {stats && (
          <p className="mt-1 text-sm text-muted-foreground">
          {stats.total_papers} papers &middot; 
          {stats.papers_by_status.unread} unread &middot; 
          {stats.papers_by_status.reading} reading &middot; 
          {stats.papers_by_status.completed} done
        </p>
        )}

        <nav className="mt-6 flex gap-4 text-sm">
          {(['list', 'search', 'browse'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={view === v ? 'underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'}
            >
              {v}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {view === 'list' && (
          <PaperList
            papers={papers}
            loading={loading}
            skip={skip}
            limit={limit}
            statusFilter={statusFilter}
            onSkipChange={setSkip}
            onStatusChange={(s) => { setStatusFilter(s); setSkip(0) }}
            onView={(p) => { setSelected(p); setDetailOpen(true) }}
            onEdit={(p) => { setSelected(p); setEditOpen(true) }}
            onDelete={(id) => { setToDelete(id); setDeleteOpen(true) }}
          />
        )}
        {view === 'search' && (
          <SearchPanel
            authors={authors}
            subjects={subjects}
            onViewPaper={(p) => { setSelected(p); setDetailOpen(true) }}
          />
        )}
        {view === 'browse' && (
          <AuthorsSubjects authors={authors} subjects={subjects} loading={loading} />
        )}
      </main>

      <AddPaperDialog open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      <PaperDetailDialog paper={selected} open={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null) }} />
      <EditPaperDialog paper={selected} open={editOpen} onClose={() => { setEditOpen(false); setSelected(null) }} onUpdate={handleUpdate} />
      <DeleteConfirmDialog open={deleteOpen} paperId={toDelete} onClose={() => { setDeleteOpen(false); setToDelete(null) }} onConfirm={handleDelete} />
    </div>
  )
}

export default App
