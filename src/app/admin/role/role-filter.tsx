import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export function RoleFilter({ search, setSearch }: Props) {
  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Tìm kiếm theo tên role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[300px] bg-neutral-900 border-neutral-800"
      />
    </div>
  );
}