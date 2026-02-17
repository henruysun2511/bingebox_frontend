"use client";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useDeleteRole, useRoleList } from "@/queries/useRoleQuery";
import { Role } from "@/types/object";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { roleColumns } from "./role-column";
import { RoleDialog } from "./role-dialog";
import { RoleFilter } from "./role-filter";

export default function RolePage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Role | undefined>();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const { data, isPending } = useRoleList({ name: debouncedSearch });
  const roles = data?.data ?? [];
  const deleteRole = useDeleteRole();

  const handleConfirmDelete = async () => {
    if (idToDelete) {
      try {
        await deleteRole.mutateAsync(idToDelete);
        toast.success("Xóa role thành công");
        setIdToDelete(null);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Quản lý Vai trò (Role)</h1>
        <Button onClick={() => setOpen(true)} className="btn-custom">
          <Plus size={18} className="mr-2" /> Thêm Role
        </Button>
      </div>

      <RoleFilter search={search} setSearch={setSearch} />

      <DataTable
        columns={roleColumns(
          (role) => { setSelected(role); setOpen(true); },
          (id) => setIdToDelete(id)
        )}
        data={roles || []}
        loading={isPending}
      />

      <RoleDialog
        open={open}
        role={selected}
        onClose={() => { setOpen(false); setSelected(undefined); }}
      />

      <ConfirmDialog
        open={!!idToDelete}
        onClose={() => setIdToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteRole.isPending}
      />
    </div>
  );
}