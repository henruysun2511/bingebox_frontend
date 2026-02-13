import { MovieStatusEnum } from "@/constants/enum";
import { useMovieList } from "@/queries/useMovieQuery";
import MovieCard from "./movie-card";

export default function MovieComingSoonList() {
    const { data, isLoading } = useMovieList({
        limit: 20,
        status: MovieStatusEnum.COMING_SOON
    });

    if (isLoading) {
        return <div className="text-white text-center py-10">Đang tải phim...</div>;
    }

    const movies = data?.data || [];

    return (
        <div className="flex flex-wrap gap-6 justify-start">
            {movies.length > 0 ? (
                movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))
            ) : (
                <div className="text-white">Chưa có phim sắp chiếu</div>
            )}
        </div>
    );
}