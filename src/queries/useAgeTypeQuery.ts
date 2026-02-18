import { AgeTypeInput } from "@/schemas/ageType.schema";
import { AgeTypeService } from "@/services/ageType.service";
import { AgeTypeParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const AGE_TYPE_QUERY_KEY = ["age-types"];

export const useAgeTypeList = (params: AgeTypeParams) => {
  return useQuery({
    queryKey: [...AGE_TYPE_QUERY_KEY, params],
    queryFn: () => AgeTypeService.getList(params).then(res => res.data),
  });
};

export const useCreateAgeType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AgeTypeService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: AGE_TYPE_QUERY_KEY }),
  });
};

export const useUpdateAgeType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AgeTypeInput }) => AgeTypeService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: AGE_TYPE_QUERY_KEY }),
  });
};

export const useDeleteAgeType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AgeTypeService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: AGE_TYPE_QUERY_KEY }),
  });
};