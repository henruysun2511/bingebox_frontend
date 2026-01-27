import { CategoryService } from "@/services/category.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const CATEGORY_QUERY_KEY = ["categories"];

export const useCategoryList = () => {
    return useQuery({
        queryKey: [...CATEGORY_QUERY_KEY],
        queryFn: async () => {
            const res = await CategoryService.getList();
            return res.data;
        },
    });
};

export const useCreateCategory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: CategoryService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY }),
    });
};

export const useUpdateCategory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
            CategoryService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY }),
    });
};

export const useDeleteCategory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: CategoryService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY }),
    });
};