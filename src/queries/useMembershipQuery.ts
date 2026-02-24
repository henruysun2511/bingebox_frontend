import { MembershipInput } from "@/schemas/membership.schema";
import { MembershipService } from "@/services/membership.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const MEMBERSHIP_KEY = ["memberships"];

export const useMembershipList = () => {
    return useQuery({
        queryKey: [...MEMBERSHIP_KEY],
        queryFn: () => MembershipService.getList().then(res => res.data),
    });
};

export const useCreateMembership = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: MembershipService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: MEMBERSHIP_KEY }),
    });
};

export const useUpdateMembership = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MembershipInput }) => 
            MembershipService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: MEMBERSHIP_KEY }),
    });
};

export const useDeleteMembership = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: MembershipService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: MEMBERSHIP_KEY }),
    });
};