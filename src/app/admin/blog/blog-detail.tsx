import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useBlogDetail } from "@/queries/useBlogQuery"

interface Props {
  open: boolean
  id?: string
  onClose: () => void
}

export function BlogDetail({ open, id, onClose }: Props) {
  const { data, isPending } = useBlogDetail(id, open)
  const blog = data?.data

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl bg-neutral-900 text-white border-neutral-800 p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 border-b border-neutral-800 flex-shrink-0">
          <DialogTitle className="text-xl font-bold">{blog?.title}</DialogTitle>
        </DialogHeader>

        {/* Khu vực nội dung có Scroll */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-custom">
          {isPending ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div
              className="prose prose-invert max-w-none 
                prose-img:rounded-xl prose-img:mx-auto
                prose-headings:text-white prose-a:text-blue-400"
              dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}