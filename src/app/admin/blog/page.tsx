"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { DataPagination } from "@/components/admin/pagination/data-pagination"
import { DataTable } from "@/components/admin/table/data-table"
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog"
import { Button } from "@/components/ui/button"

import { useDebounce } from "@/hooks/useDebounce"
import { useBlogList, useChangePublishStatus, useDeleteBlog } from "@/queries/useBlogQuery"
import { Blog } from "@/types/object"
import { handleError } from "@/utils/error"

import { blogColumns } from "./blog-column"
import { BlogDetail } from "./blog-detail"
import { BlogDialog } from "./blog-dialog"
import { BlogFilter } from "./blog-filter"

export default function BlogPage() {
  const [title, setTitle] = useState("")
  const [isPublished, setIsPublished] = useState("all")
  const [page, setPage] = useState(1)

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Blog>()
  const [detailId, setDetailId] = useState<string>()
  const [deleteId, setDeleteId] = useState<string>()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const debouncedTitle = useDebounce(title, 500)

  const { data, isPending } = useBlogList({
    page,
    limit: 10,
    title: debouncedTitle,
    isPublished:
      isPublished === "all" ? undefined : isPublished,
  })

  const blogs = data?.data ?? []
  const pagination = data?.pagination

  const deleteBlog = useDeleteBlog()
  const changePublish = useChangePublishStatus()

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteBlog.mutateAsync(deleteId)
      toast.success("Xóa thành công")
      setConfirmOpen(false)
    } catch (err) {
      handleError(err)
    }
  }

  const handleChangePublish = async (id: string, val: boolean) => {
    try {
      await changePublish.mutateAsync({ id, isPublished: val })
      toast.success("Cập nhật thành công")
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-white">Bài viết</h1>
        <Button className="btn-custom" onClick={() => { setSelected(undefined); setOpen(true) }}>
          <Plus size={16} className="mr-2" />
          Thêm Blog
        </Button>
      </div>

      <BlogFilter
        title={title}
        setTitle={setTitle}
        isPublished={isPublished}
        setIsPublished={setIsPublished}
        setPage={setPage}
      />

      <DataTable
        data={blogs}
        columns={blogColumns(
          (blog) => { setSelected(blog); setOpen(true) },
          (id) => { setDeleteId(id); setConfirmOpen(true) },
          (id) => setDetailId(id),
          handleChangePublish
        )}
        loading={isPending}
      />

      <DataPagination
        page={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <BlogDialog
        open={open}
        blog={selected}
        onClose={() => setOpen(false)}
      />

      <BlogDetail
        open={!!detailId}
        id={detailId}
        onClose={() => setDetailId(undefined)}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteBlog.isPending}
      />
    </div>
  )
}