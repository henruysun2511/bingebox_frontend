import { RoleInput } from "@/schemas/role.schema";
import { RoleService } from "@/services/role.service";
import { RoleParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ROLE_QUERY_KEY = ["roles"];

export const useRoleList = (params: RoleParams) => {
  return useQuery({
    queryKey: [...ROLE_QUERY_KEY, params],
    queryFn: async () => {
      const data = await RoleService.getList(params);;
      return data.data;
    }
  });
};

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RoleService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ROLE_QUERY_KEY }),
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoleInput }) => RoleService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROLE_QUERY_KEY }),
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RoleService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ROLE_QUERY_KEY }),
  });
};