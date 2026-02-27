import { CommentInput } from "@/schemas/comment.schema";
import { ApiResponse } from "@/types/body";
import { Comment } from "@/types/object";
import { Pagination } from "@/types/param";
import http from "@/utils/http";


const prefix = "comments";

export const CommentService = {
    // Lấy danh sách bình luận của phim
    getListByMovie(movieId: string, params: Pagination) {
        return http.get<ApiResponse<Comment[]>>(`/${prefix}/movies/${movieId}`, { params });
    },

    // Lấy danh sách trả lời bình luận
    getReplies(parentId: string, params?: Pagination) {
        return http.get<ApiResponse<Comment[]>>(`/${prefix}/replies/${parentId}`, { params });
    },

    create(payload: CommentInput) {
        return http.post<ApiResponse<Comment>>(`/${prefix}`, payload);
    },

    update(id: string, payload: CommentInput) {
        return http.patch<ApiResponse<Comment>>(`/${prefix}/${id}`, payload);
    },

    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },

    toggleLike(id: string) {
        return http.post<ApiResponse<Comment>>(`/${prefix}/likes/${id}`);
    },
};