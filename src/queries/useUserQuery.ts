import { UserService } from "@/services/user.service";
import { UserParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const USER_QUERY_KEY = ["users"];

export const useGetMe = () => {
    return useQuery({
        queryKey: ["get-me"],
        queryFn: async () => {
            const res = await UserService.getMe(); // Đồng bộ sử dụng UserService
            return res.data;
        },
    });
};


export const useUpdateMe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: any) => UserService.updateMe(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-me"] });
        },
    });
};

export const useUserList = (params: UserParams) => {
    return useQuery({
        queryKey: [...USER_QUERY_KEY, params],
        queryFn: async () => {
            const res = await UserService.getUsers(params);
            return res.data;
        },
    });
};

export const useAssignRole = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, roleId }: { id: string; roleId: string }) => UserService.assignRole(id, roleId),
        onSuccess: () => qc.invalidateQueries({ queryKey: USER_QUERY_KEY }),
    });
};

export const useToggleBlockUser = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) => UserService.toggleBlock(id, isBlocked),
        onSuccess: () => qc.invalidateQueries({ queryKey: USER_QUERY_KEY }),
    });
};

export const useRedeemPoints = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, points }: { id: string; points: number }) => UserService.redeemPoints(id, points),
        onSuccess: () => qc.invalidateQueries({ queryKey: USER_QUERY_KEY }),
    });
};

