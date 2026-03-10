import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Props {
  open: boolean
  paperId: number | null
  onClose: () => void
  onConfirm: (id: number) => Promise<void>
}

export function DeleteConfirmDialog({ open, paperId, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (paperId === null) return
    setLoading(true)
    try {
      await onConfirm(paperId)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 sm:max-w-xs">
        <h2 className="text-sm font-semibold">delete paper?</h2>
        <p className="mt-2 text-sm text-muted-foreground">this cannot be undone.</p>

        <div className="mt-6 flex justify-end gap-4 text-sm">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">cancel</button>
          <button onClick={submit} disabled={loading} className="disabled:opacity-30">
            {loading ? 'deleting...' : 'delete'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
