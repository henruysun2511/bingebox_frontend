"use client";

import SectionTitle from "@/components/common/title/section-title";
import { useMovieDetail } from "@/queries/useMovieQuery";
import { Calendar1, Clock1 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function MovieDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useMovieDetail(id);
    console.log(data);
    const movie = data?.data;
    const [showTrailer, setShowTrailer] = useState(false);

    if (isLoading) return <div className="text-white p-10">Loading...</div>;
    if (!movie) return <div className="text-white p-10">Movie not found</div>;

    const formatDate = (date?: string) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    return (
        <>
            {/* SECTION 1 - BANNER */}
            <div className="mt-16">
                <div className="relative h-[620px] w-full overflow-hidden">
                    <img
                        src={movie.banner || "/fallback.jpg"}
                        alt={movie.name}
                        className="w-full h-full object-cover scale-105"
                    />

                    {/* overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

                    {/* play button */}
                    <div
                        onClick={() => setShowTrailer(true)}
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    >
                        <div className="text-white text-7xl hover:scale-110 transition duration-300">
                            ▶
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-80">
                {/* SECTION 2 - INFO */}
                <div className="relative -mt-25 z-10 mb-20">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col items-end lg:flex-row gap-10 text-white">

                            {/* Poster */}
                            <div className="w-[280px] shrink-0">
                                <img
                                    src={movie.poster || "/fallback.jpg"}
                                    alt={movie.name}
                                    className="w-full h-[400px] object-cover rounded-xl shadow-2xl"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold mb-4">
                                    {movie.name || "N/A"}
                                </h2>

                                {/* Basic Info */}
                                <div className="flex flex-wrap gap-8 mb-4 text-sm text-white/80">
                                    <div className="flex items-center gap-2">
                                        <Clock1 className="w-4 h-4" />
                                        {movie.duration || "N/A"} phút
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar1 className="w-4 h-4" />
                                        {formatDate(movie.releaseDate)}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-white/80">
                                    <p>Đạo diễn: {movie.director || "N/A"}</p>
                                    <p>Quốc gia: {movie.nationality || "N/A"}</p>
                                </div>

                                {/* Category */}
                                <div className="flex flex-wrap items-center gap-2 mt-4">
                                    <span className="text-white/70">Thể loại:</span>

                                    {movie.categories?.length ? (
                                        movie.categories.map((c: any) => (
                                            <span
                                                key={c._id}
                                                className="px-3 py-1 bg-white/10 rounded-full text-xs"
                                            >
                                                {c.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </div>

                                {/* Age */}
                                <div className="mt-4">
                                    <span className="px-3 py-1 bg-yellow-500 text-black font-semibold rounded-md text-sm">
                                        {movie.agePermission || "N/A"}
                                    </span>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => setShowTrailer(true)}
                                        className="px-6 py-2 rounded-full bg-blue hover:opacity-90 transition font-semibold"
                                    >
                                        TRAILER
                                    </button>

                                    <Link
                                        href={`/booking/${movie._id}`}
                                        className="px-6 py-2 rounded-full bg-red-500 hover:opacity-90 transition font-semibold"
                                    >
                                        ĐẶT VÉ
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3 - DESCRIPTION */}
                <div className="mb-20">
                    <div className="container mx-auto px-6 text-white">
                        <SectionTitle title="Nội dung" />

                        <p className="mt-6 text-white/80 leading-relaxed max-w-4xl">
                            {movie.description || "N/A"}
                        </p>
                    </div>
                </div>

                {/* SECTION 4 - ACTORS */}
                <div className="mb-24">
                    <div className="container mx-auto px-6 text-white">
                        <SectionTitle title="Diễn viên" />

                        <div className="flex gap-8 mt-8">
                            {movie.actors?.length ? (
                                movie.actors.map((actor: any) => (
                                    <Link
                                        key={actor._id}
                                        className="flex flex-col items-center group cursor-pointer"
                                        href={`/actor/${actor._id}`}
                                    >
                                        <div className="w-[110px] h-[110px] rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition duration-300">
                                            <img
                                                src={actor.avatar || "/avatar-fallback.png"}
                                                alt={actor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="mt-3 text-sm text-center text-white/80">
                                            {actor.name || "N/A"}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p>N/A</p>
                            )}
                        </div>
                    </div>
                </div>


                <div className="mb-20">
                    <div className="container mx-auto px-6 text-white">
                        <SectionTitle title="Lịch chiếu" />

                        
                    </div>
                </div>
            </div>



            {/* TRAILER MODAL */}
            {showTrailer && (
                <>
                    <div
                        className="fixed inset-0 bg-black/70 z-40"
                        onClick={() => setShowTrailer(false)}
                    />
                    <div className="fixed top-[20%] left-[25%] z-50">
                        <iframe
                            width="860"
                            height="515"
                            src={movie.trailer}
                            allowFullScreen
                        />
                    </div>
                </>
            )}
        </>
    );
}