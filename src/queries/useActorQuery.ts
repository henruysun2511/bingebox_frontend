import { ActorService } from "@/services/actor.service";
import { ActorParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ACTOR_QUERY_KEY = ["actors"];

export const useActorList = (params: ActorParams) => {
    return useQuery({
        queryKey: [...ACTOR_QUERY_KEY, params],
        queryFn: async () => {
            const res = await ActorService.getList(params);
            return res.data;
        },
    });
};

export const useActorDetail = (id: string | undefined) => {
    return useQuery({
        queryKey: [...ACTOR_QUERY_KEY, id], 
        queryFn: async () => {
            if (!id) return null;
            const res = await ActorService.getDetail(id);
            return res.data;
        },
        enabled: !!id, 
    });
};

export const useActorMovies = (id: string | undefined) => {
    return useQuery({
        queryKey: [...ACTOR_QUERY_KEY, id, "movies"], 
        queryFn: async () => {
            if (!id) return null;
            const res = await ActorService.getActorMovie(id);
            return res.data;
        },
        enabled: !!id, 
    });
};

export const useCreateActor = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ActorService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: ACTOR_QUERY_KEY }),
    });
};

export const useUpdateActor = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            ActorService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ACTOR_QUERY_KEY }),
    });
};

export const useDeleteActor = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ActorService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: ACTOR_QUERY_KEY }),
    });
};