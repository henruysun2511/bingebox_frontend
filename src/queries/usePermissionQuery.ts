import { PermissionService } from "@/services/permission.service";
import { PermissionParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PERMISSION_KEY = ["permissions"];

export const usePermissionList = (params: PermissionParams) => {
    return useQuery({
        queryKey: [...PERMISSION_KEY, params],
        queryFn: async () => {
            const data = await PermissionService.getList(params);
            return data.data;
        }
    });
};

export const useCreatePermission = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: PermissionService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: PERMISSION_KEY }),
    });
};

export const useUpdatePermission = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => PermissionService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: PERMISSION_KEY }),
    });
};

export const useDeletePermission = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: PermissionService.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PERMISSION_KEY });
        },
    });
};