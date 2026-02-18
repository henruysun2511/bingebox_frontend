import { Input } from "@/components/ui/input";

interface Props {
  searchName: string;
  setSearchName: (v: string) => void;
  searchAge: string;
  setSearchAge: (v: string) => void;
}

export function AgeTypeFilter({ searchName, setSearchName, searchAge, setSearchAge }: Props) {
  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Tìm theo tên đối tượng..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        className="w-[250px] bg-neutral-900 border-neutral-800"
      />
      <Input
        type="number"
        placeholder="Tìm theo độ tuổi cụ thể..."
        value={searchAge}
        onChange={(e) => setSearchAge(e.target.value)}
        className="w-[200px] bg-neutral-900 border-neutral-800"
      />
    </div>
  );
}