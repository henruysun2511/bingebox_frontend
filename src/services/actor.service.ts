import { ActorInput } from "@/schemas/actor.schema";
import { ApiResponse } from "@/types/body";
import { Actor, Movie } from "@/types/object";
import { ActorParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "actors";

export const ActorService = {
    getList(params: ActorParams) {
        return http.get<ApiResponse<Actor[]>>(`/${prefix}`, { params });
    },

    getDetail(id: string) {
        return http.get<ApiResponse<Actor>>(`/${prefix}/${id}`);
    },

    getActorMovie(id: string) {
        return http.get<ApiResponse<Movie[]>>(`/${prefix}/movies/${id}`);
    },

    create(payload: ActorInput) {
        return http.post<ApiResponse<Actor>>(`/${prefix}`, payload);
    },

    update(id: string, payload: ActorInput) {
        return http.patch<ApiResponse<Actor>>(`/${prefix}/${id}`, payload);
    },

    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
};