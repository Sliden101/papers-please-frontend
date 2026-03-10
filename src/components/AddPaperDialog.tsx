import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (arxivId: string) => Promise<void>
}

export function AddPaperDialog({ open, onClose, onAdd }: Props) {
  const [loading, setLoading] = useState(false)
  const [arxivId, setArxivId] = useState('')
  const [error, setError] = useState('')

  const submit = async () => {
    const id = arxivId.trim()
      .replace(/^(https?:\/\/)?(www\.)?arxiv\.org\/(abs|pdf)\//, '')
      .replace(/\.pdf$/, '')
    if (!id) {
      setError('enter an arxiv id')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onAdd(id)
      setArxivId('')
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to add paper')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 sm:max-w-sm">
        <h2 className="mb-4 text-sm font-medium">add paper</h2>
        <label className="block text-sm">
          <span className="text-xs text-muted-foreground">arxiv id or url</span>
          <input
            value={arxivId}
            onChange={(e) => setArxivId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && submit()}
            placeholder="2301.07041"
            autoFocus
            className="mt-1 block w-full border-b bg-transparent py-1 focus:outline-none"
          />
        </label>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-4 text-sm">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">cancel</button>
          <button onClick={submit} disabled={loading} className="disabled:opacity-30">
            {loading ? 'adding...' : 'add'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
