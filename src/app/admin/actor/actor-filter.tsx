import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActorFilterProps {
  search: string;
  setSearch: (val: string) => void;
  sort: string;
  setSort: (val: any) => void;
  setPage: (page: number) => void;
}

export function ActorFilter({ search, setSearch, sort, setSort, setPage }: ActorFilterProps) {
  return (
    <div className="flex gap-3 justify-between">
      <Input
        placeholder="Tìm theo tên..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset trang về 1 khi tìm kiếm
        }}
        className="max-w-xs form-input-custom"
      />

      <Select
        value={sort}
        onValueChange={(value) => {
          setSort(value);
          setPage(1); // Reset trang về 1 khi đổi sắp xếp
        }}

      >
        <SelectTrigger className="select-trigger-custom">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent className="select-content-custom">
          <SelectItem className="select-item-custom" value="createdAt">Mới nhất</SelectItem>
          <SelectItem className="select-item-custom" value="name">Tên A → Z</SelectItem>
          <SelectItem className="select-item-custom" value="-name">Tên Z → A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}