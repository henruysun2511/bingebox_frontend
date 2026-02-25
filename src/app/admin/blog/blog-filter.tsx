import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
  title: string
  setTitle: (val: string) => void
  isPublished: string
  setIsPublished: (val: string) => void
  setPage: (val: number) => void
}

export function BlogFilter({
  title,
  setTitle,
  isPublished,
  setIsPublished,
  setPage,
}: Props) {
  return (
    <div className="flex gap-4 flex-wrap">
      <Input
        placeholder="Tìm theo tiêu đề..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          setPage(1)
        }}
        className="w-[250px] bg-neutral-900 border-neutral-800"
      />

      <Select
        value={isPublished}
        onValueChange={(val) => {
          setIsPublished(val)
          setPage(1)
        }}
      >
        <SelectTrigger className="w-[180px] bg-neutral-900 border-neutral-800">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="true">Đã xuất bản</SelectItem>
          <SelectItem value="false">Chưa xuất bản</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}