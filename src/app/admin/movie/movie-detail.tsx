import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useMovieActors } from "@/queries/useMovieQuery";
import { Movie } from "@/types/object";
import { formatDate } from "@/utils/formatDate";
import { Calendar, Clock, Film, Globe, Info, Tag, User } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    movie?: Movie;
}

export function MovieDetail({ open, onClose, movie }: Props) {
    const { data: movieActorsRes } = useMovieActors(movie?._id, {
        enabled: open && !!movie?._id
    });

    if (!movie) return null;

   return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-4xl bg-neutral-950 text-white border-neutral-800 p-0 overflow-hidden max-h-[90vh] flex flex-col shadow-2xl">
                {/* Banner Profile */}
                <div className="relative h-72 w-full flex-shrink-0">
                    <img 
                        src={movie.banner} 
                        alt="Banner" 
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-8 flex gap-8 items-end">
                        <img 
                            src={movie.poster} 
                            alt="Poster" 
                            className="w-40 h-56 rounded-xl border-4 border-neutral-900 shadow-2xl object-cover"
                        />
                        <div className="mb-2 space-y-2">
                            <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-3">
                                {movie.agePermission}
                            </Badge>
                            <h2 className="text-4xl font-bold tracking-tight">{movie.name}</h2>
                            <p className="text-neutral-400 flex items-center gap-3 text-sm">
                                <span className="flex items-center gap-1"><Clock size={16} /> {movie.duration} phút</span>
                                <span>|</span>
                                <span>{movie.subtitle}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid grid-cols-12 gap-10">
                        {/* Cột trái: Thông tin chính (8 cột) */}
                        <div className="col-span-8 space-y-8">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-500 mb-3">
                                    <Info size={16} /> Mô tả nội dung
                                </h3>
                                <p className="text-neutral-300 leading-relaxed text-lg font-light italic">
                                    "{movie.description || "Chưa có mô tả cho phim này."}"
                                </p>
                            </div>

                            <Separator className="bg-neutral-800" />

                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-500 mb-4">
                                    <User size={16} /> Diễn viên tham gia
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {movieActorsRes?.data?.length ? (
                                        movieActorsRes.data.map((actor: any) => (
                                            <div key={actor._id} className="flex items-center gap-3 bg-neutral-900/40 p-2 rounded-lg border border-neutral-800 shadow-sm">
                                                <img src={actor.avatar} className="w-10 h-10 rounded-full object-cover border border-neutral-700" alt={actor.name} />
                                                <span className="text-sm font-medium">{actor.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-neutral-500 text-sm italic col-span-2">Đang tải danh sách diễn viên...</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-500 mb-3">Link Trailer</h3>
                                <a 
                                    href={movie.trailer} 
                                    target="_blank" 
                                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm underline truncate block"
                                >
                                    {movie.trailer}
                                </a>
                            </div>
                        </div>

                        {/* Cột phải: Thông số chi tiết (4 cột) */}
                        <div className="col-span-4 space-y-6">
                            <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-6 shadow-inner">
                                <div className="space-y-2">
                                    <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest flex items-center gap-2">
                                        <Tag size={14} /> Thể loại
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {/* HIỂN THỊ CATEGORIES TRỰC TIẾP TỪ OBJECT */}
                                        {(movie.categories as any).map((cat: any) => (
                                            <Badge key={cat._id} variant="secondary" className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-none px-2 py-0">
                                                {cat.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest flex items-center gap-2">
                                        <Calendar size={14} /> Khởi chiếu
                                    </span>
                                    <p className="text-sm font-semibold text-neutral-200">
                                        {formatDate(movie.releaseDate)}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest flex items-center gap-2">
                                        <Globe size={14} /> Quốc gia & Đạo diễn
                                    </span>
                                    <p className="text-sm font-semibold text-neutral-200 uppercase tracking-tight">
                                        {movie.nationality || "N/A"}
                                    </p>
                                    <p className="text-xs text-neutral-400 italic">
                                        ĐD: {movie.director || "Chưa cập nhật"}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest flex items-center gap-2">
                                        <Film size={14} /> Định dạng
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.format?.map(f => (
                                            <Badge key={f} className="bg-blue-600/10 text-blue-400 border-blue-500/20 text-[10px]">
                                                {f}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="bg-neutral-800" />
                                
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-neutral-600 uppercase">Trạng thái</span>
                                        <span className="text-[10px] text-emerald-500 font-bold">{movie.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-neutral-600 uppercase">Lượt thích</span>
                                        <span className="text-[10px] text-neutral-300 font-bold">{movie.likeCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}