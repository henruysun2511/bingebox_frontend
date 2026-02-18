"use client";

import SectionTitle from "@/components/common/title/section-title";
import { cn } from "@/lib/utils";
import { useMovieDetail } from "@/queries/useMovieQuery";
import { useShowtimesByMovie } from "@/queries/useShowtimeQuery";
import { addDays, format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar1, Clock1 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function MovieDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: movieData, isLoading } = useMovieDetail(id);
    const movie = movieData?.data;

    //Lấy data ngày chiếu của phim
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { data: showtimeData, isLoading: isShowtimeLoading } = useShowtimesByMovie(id, {
        date: selectedDate
    });
    const showtimes = showtimeData?.data ?? [];
    console.log(showtimeData);

    //Select ngày
    const dateTabs = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

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
                    <div className="container mx-auto px-6 text-white pb-20">
                        <SectionTitle title="Lịch chiếu" />

                        {/* DATE TABS */}
                        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                            {dateTabs.map((date, index) => {
                                const isSelected = isSameDay(date, selectedDate);
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(date)}
                                        className={cn(
                                            "flex flex-col items-center min-w-[80px] py-3 rounded-xl transition-all",
                                            isSelected
                                                ? "bg-blue shadow-lg shadow-blue-500/20"
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        <span className="text-[10px] uppercase opacity-60">
                                            {index === 0 ? "Hôm nay" : format(date, "EEEE", { locale: vi })}
                                        </span>
                                        <span className="text-lg font-bold">
                                            {format(date, "dd/MM")}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* CINEMA LIST */}
                        <div className="space-y-6">
                            {isShowtimeLoading ? (
                                <div className="text-center py-10 text-gray-400">Đang tải lịch chiếu...</div>
                            ) : showtimes.length > 0 ? (
                                showtimes.map((cinema: any) => (
                                    <div key={cinema._id} className="border border-white/10 rounded-2xl overflow-hidden">
                                        {/* Cinema Header */}
                                        <div className="p-4 bg-white/5 border-b border-white/10">
                                            <h3 className="font-bold text-lg text-blue">{cinema.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1 italic">{cinema.address}</p>
                                        </div>

                                        {/* Formats (Mỗi format một dòng) */}
                                        <div className="p-4 space-y-6">
                                            {cinema.formats.map((f: any, fIdx: number) => (
                                                <div key={fIdx} className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                                                            {f.format}
                                                        </span>
                                                        <div className="h-[1px] flex-1 bg-white/5" />
                                                    </div>

                                                    {/* Showtime Buttons */}
                                                    <div className="flex flex-wrap gap-3">
                                                        {f.showtimes.map((st: any) => (
                                                            <Link
                                                                key={st._id}
                                                                href={`/booking/${st._id}`}
                                                                className="group relative bg-neutral-800 hover:bg-blue-600 border border-white/10 hover:border-blue-500 rounded-lg px-4 py-2 transition-all"
                                                            >
                                                                <div className="text-sm font-bold group-hover:text-white">
                                                                    {format(new Date(st.startTime), "HH:mm")}
                                                                </div>
                                                                <div className="text-[10px] text-gray-500 group-hover:text-blue-200">
                                                                    ~{format(new Date(st.endTime), "HH:mm")}
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 text-gray-500">
                                    Rất tiếc, không có suất chiếu nào cho ngày này.
                                </div>
                            )}
                        </div>
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