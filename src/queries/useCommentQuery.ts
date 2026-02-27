import { CommentInput } from "@/schemas/comment.schema";
import { CommentService } from "@/services/comment.service";
import { Pagination } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const COMMENT_QUERY_KEY = ["comments"];

export const useCommentListByMovie = (movieId: string | undefined, params: Pagination) => {
    return useQuery({
        queryKey: [...COMMENT_QUERY_KEY, "movie", movieId, params],
        queryFn: async () => {
            if (!movieId) return [];
            const res = await CommentService.getListByMovie(movieId, params);
            return res.data;
        },
        enabled: !!movieId,
    });
};

export const useCommentReplies = (parentId: string | undefined, params?: Pagination) => {
    return useQuery({
        queryKey: [...COMMENT_QUERY_KEY, "replies", parentId, params],
        queryFn: async () => {
            if (!parentId) return [];
            const res = await CommentService.getReplies(parentId, params);
            return res.data;
        },
        enabled: !!parentId,
    });
};

export const useCreateComment = (movieId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: CommentService.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [...COMMENT_QUERY_KEY, "movie", movieId] });
        },
    });
};

export const useUpdateComment = (movieId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CommentInput }) => 
            CommentService.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [...COMMENT_QUERY_KEY, "movie", movieId] });
        },
    });
};

export const useDeleteComment = (movieId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: CommentService.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [...COMMENT_QUERY_KEY, "movie", movieId] });
        },
    });
};

export const useToggleLikeComment = (movieId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: CommentService.toggleLike,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [...COMMENT_QUERY_KEY, "movie", movieId] });
        },
    });
};