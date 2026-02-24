import { FoodService } from "@/services/food.service";
import { FoodParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const FOOD_KEY = ["foods"];

export const useFoodList = (params: FoodParams) => {
    return useQuery({
        queryKey: [...FOOD_KEY, params],
        queryFn: () => FoodService.getList(params).then(res => res.data),
    });
};

export const useCreateFood = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: FoodService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: FOOD_KEY }),
    });
};

export const useUpdateFood = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => FoodService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: FOOD_KEY }),
    });
};

export const useDeleteFood = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: FoodService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: FOOD_KEY }),
    });
};