import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Paper, PaperStatus } from '@/types'

interface Props {
  paper: Paper | null
  open: boolean
  onClose: () => void
  onUpdate: (id: number, updates: { status?: PaperStatus; note?: string }) => Promise<void>
}

export function EditPaperDialog({ paper, open, onClose, onUpdate }: Props) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<PaperStatus>('unread')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (paper) {
      setStatus(paper.status)
      setNote(paper.note || '')
    }
  }, [paper])

  const submit = async () => {
    if (!paper) return
    setLoading(true)
    try {
      await onUpdate(paper.id, { status, note: note || undefined })
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!paper) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 sm:max-w-md">
        <h2 className="mb-1 text-sm font-semibold">edit paper</h2>
        <p className="line-clamp-1 text-xs text-muted-foreground">{paper.title}</p>

        <div className="mt-6 space-y-4 text-sm">
          <label className="block">
            <span className="text-xs text-muted-foreground">status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PaperStatus)}
              className="mt-1 block w-full border-b bg-transparent py-1 focus:outline-none"
            >
              <option value="unread">unread</option>
              <option value="reading">reading</option>
              <option value="completed">completed</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-muted-foreground">note</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="mt-1 block w-full resize-none border-b bg-transparent py-1 focus:outline-none"
            />
          </label>

          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">cancel</button>
            <button onClick={submit} disabled={loading} className="disabled:opacity-30">
              {loading ? 'saving...' : 'save'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
