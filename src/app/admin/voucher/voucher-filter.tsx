import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BaseStatusEnum } from "@/constants/enum"

interface VoucherFilterType {
  name: string
  code: string
  status: string
}

interface Props {
  filters: VoucherFilterType
  setFilters: React.Dispatch<React.SetStateAction<VoucherFilterType>>
}

export function VoucherFilter({ filters, setFilters }: Props) {
  const handleChange = (field: keyof VoucherFilterType, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: field === "status" && value === "ALL" ? "" : value,
    }))
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Input
        placeholder="Tên voucher..."
        value={filters.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="form-input-custom !w-[180px]"
      />

      <Input
        placeholder="Mã code..."
        value={filters.code}
        onChange={(e) => handleChange("code", e.target.value)}
        className="form-input-custom !w-[180px]"
      />

      <Select
        value={filters.status || "ALL"}
        onValueChange={(val) => handleChange("status", val)}
      >
        <SelectTrigger className="select-trigger-custom !w-[180px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>

        <SelectContent className="select-content-custom">
          <SelectItem className="select-item-custom" value="ALL">Tất cả</SelectItem>
          <SelectItem className="select-item-custom" value={BaseStatusEnum.ACTIVE}>Đang hoạt động</SelectItem>
          <SelectItem className="select-item-custom" value={BaseStatusEnum.INACTIVE}>Ngừng hoạt động</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}