import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Paper } from '@/types'

interface Props {
  paper: Paper | null
  open: boolean
  onClose: () => void
}

export function PaperDetailDialog({ paper, open, onClose }: Props) {
  if (!paper) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-lg">
        <h2 className="text-sm font-semibold leading-snug">{paper.title}</h2>

        <div className="mt-1 text-xs text-muted-foreground">
          {paper.status} &middot; {paper.arxiv_id} &middot; {paper.published_date}
        </div>

        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">authors</dt>
            <dd className="mt-1">{paper.authors.join(', ')}</dd>
          </div>

          {paper.abstract && (
            <div>
              <dt className="text-xs text-muted-foreground">abstract</dt>
              <dd className="mt-1 leading-relaxed">{paper.abstract}</dd>
            </div>
          )}

          {paper.subjects.length > 0 && (
            <div>
              <dt className="text-xs text-muted-foreground">subjects</dt>
              <dd className="mt-1">{paper.subjects.join(', ')}</dd>
            </div>
          )}

          {paper.note && (
            <div>
              <dt className="text-xs text-muted-foreground">notes</dt>
              <dd className="mt-1 leading-relaxed">{paper.note}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>added {new Date(paper.created_at).toLocaleDateString()}</span>
          <div className="flex gap-3">
            {paper.pdf_url && (
              <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                pdf
              </a>
            )}
            {paper.arxiv_url && (
              <a href={paper.arxiv_url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                arxiv
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
