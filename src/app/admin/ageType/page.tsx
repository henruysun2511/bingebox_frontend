"use client";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useAgeTypeList, useDeleteAgeType } from "@/queries/useAgeTypeQuery";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ageTypeColumns } from "./ageType-column";
import { AgeTypeDialog } from "./ageType-dialog";
import { AgeTypeFilter } from "./ageType-filter";

export default function AgeTypePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const debouncedName = useDebounce(name, 500);
  const debouncedAge = useDebounce(age, 500);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(undefined);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const { data, isPending } = useAgeTypeList({ 
    name: debouncedName, 
    age: debouncedAge,
  });
  
  const deleteMutation = useDeleteAgeType();

  const handleConfirmDelete = async () => {
    if (idToDelete) {
      await deleteMutation.mutateAsync(idToDelete)
        .then(() => {
          toast.success("Xóa thành công");
          setIdToDelete(null);
        })
        .catch(err => toast.error(err.message));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Độ tuổi</h1>
        <Button onClick={() => setOpen(true)} className="btn-custom">
          <Plus size={18} className="mr-2" /> Thêm Đối tượng
        </Button>
      </div>

      <AgeTypeFilter 
        searchName={name} setSearchName={setName} 
        searchAge={age} setSearchAge={setAge} 
      />

      <DataTable
        columns={ageTypeColumns(
          (item) => { setSelected(item); setOpen(true); },
          (id) => setIdToDelete(id)
        )}
        data={data?.data || []}
        loading={isPending}
      />

      <AgeTypeDialog
        open={open}
        ageType={selected}
        onClose={() => { setOpen(false); setSelected(undefined); }}
      />

      <ConfirmDialog
        open={!!idToDelete}
        onClose={() => setIdToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}