import { MovieInput } from "@/schemas/movie.schema";
import { MovieService } from "@/services/movie.service";
import { MovieParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const MOVIE_QUERY_KEY = ["movies"];

export const useMovieList = (params: MovieParams) => {
    return useQuery({
        queryKey: [...MOVIE_QUERY_KEY, params],
        queryFn: async () => {
            const res = await MovieService.getList(params);
            return res.data;
        },
    });
};

export const useAdminMovieList = (params: MovieParams) => {
    return useQuery({
        queryKey: [...MOVIE_QUERY_KEY, params],
        queryFn: async () => {
            const res = await MovieService.getAdminList(params);
            return res.data;
        },
    });
};

export const useMovieActors = (movieId: string | undefined, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: [...MOVIE_QUERY_KEY, "actors", movieId],
        queryFn: async () => {
            if (!movieId) return null;
            const res = await MovieService.getActors(movieId);
            return res.data;
        },
        enabled: options?.enabled !== false && !!movieId,
    });
};

export const useMovieDetail = (id: string | undefined) => {
    return useQuery({
        queryKey: [...MOVIE_QUERY_KEY, id],
        queryFn: async () => {
            if (!id) return null;
            const res = await MovieService.getDetail(id);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useCreateMovie = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: MovieService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: MOVIE_QUERY_KEY }),
    });
};

export const useUpdateMovie = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MovieInput }) =>
            MovieService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: MOVIE_QUERY_KEY }),
    });
};

export const useDeleteMovie = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: MovieService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: MOVIE_QUERY_KEY }),
    });
};

export const useFavouriteMovies = () => {
    return useQuery({
        queryKey: [...MOVIE_QUERY_KEY, "favourite"],
        queryFn: async () => {
            const res = await MovieService.getFavouriteMovies();
            return res.data;
        },
    });
};

export const useWatchedMovies = () => {
    return useQuery({
        queryKey: [...MOVIE_QUERY_KEY, "watched"],
        queryFn: async () => {
            const res = await MovieService.getWatchedMovies();
            return res.data;
        },
    });
};

export const useToggleLikeMovie = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: MovieService.toggleLikeMovie,
        onSuccess: (res) => {
            qc.invalidateQueries({ queryKey: MOVIE_QUERY_KEY });
        },
    });
};