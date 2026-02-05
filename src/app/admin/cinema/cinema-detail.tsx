import { ImagePreview } from "@/components/common/imagePreview/image-preview";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCinemaDetail } from "@/queries/useCinemaQuery";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar, Globe, Info, MapPin, Navigation } from "lucide-react";


interface Props {
    open: boolean;
    onClose: () => void;
    cinemaId?: string;
}

export function CinemaDetail({ open, onClose, cinemaId }: Props) {
    const { data, isLoading } = useCinemaDetail(cinemaId);
    const cinema = data?.data;
    console.log(cinema)

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogHeader className="sr-only">
                <DialogTitle>Chi tiết rạp chiếu phim</DialogTitle>
            </DialogHeader>
            <DialogContent className="!max-w-4xl bg-[#0a0a0a] text-white overflow-y-auto max-h-[95vh] border-neutral-800 p-0 overflow-hidden">
                {isLoading ? (
                    <div className="h-96 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : cinema ? (
                    <>
                        {/* Header với Background Image */}
                        <div className="relative h-64 w-full">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40 z-10" />
                            <img
                                src={cinema.image}
                                alt={cinema.name}
                                className="w-full h-full object-cover opacity-60 blur-[2px]"
                            />
                            <div className="absolute bottom-6 left-8 z-20 space-y-2">
                                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none px-3 py-1">
                                    <Globe size={12} className="mr-1" />
                                    {cinema.province}
                                </Badge>
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                                    {cinema.name}
                                </h2>
                            </div>
                        </div>

                        <div className="p-8 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {/* CỘT TRÁI */}
                                <div className="md:col-span-1 space-y-4 mt-4 z-30">
                                    <div className="rounded-xl overflow-hidden border-2 border-neutral-800 shadow-2xl bg-neutral-900">
                                        <ImagePreview
                                            src={cinema.image}
                                            alt={cinema.name}
                                            width="w-full"
                                            height="h-56"
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl backdrop-blur-md">
                                        <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Thông tin rạp</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                    <Navigation size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-neutral-500 uppercase font-semibold">Khu vực</p>
                                                    <p className="text-sm">{cinema.province}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                                    <Calendar size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-neutral-500 uppercase font-semibold">Trạng thái</p>
                                                    <p className="text-sm text-green-400 font-medium">Đang hoạt động</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CỘT PHẢI */}
                                <div className="md:col-span-2 space-y-8">
                                    <section className="space-y-3">
                                        <div className="flex items-center gap-2 text-blue-500">
                                            <MapPin size={18} />
                                            <span className="font-bold text-xs uppercase tracking-wider">Địa chỉ chính xác</span>
                                        </div>
                                        <p className="text-xl text-neutral-200 font-medium leading-relaxed">
                                            {cinema.location}
                                        </p>
                                    </section>

                                    <Separator className="bg-neutral-800" />

                                    <section className="space-y-3">
                                        <div className="flex items-center gap-2 text-blue-500">
                                            <Info size={18} />
                                            <span className="font-bold text-xs uppercase tracking-wider">Mô tả chi tiết</span>
                                        </div>
                                        <div className="bg-neutral-900/30 p-4 rounded-lg border-l-2 border-blue-500/50">
                                            <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap text-sm italic">
                                                {cinema.description || "Chào mừng bạn đến với trải nghiệm điện ảnh đỉnh cao..."}
                                            </p>
                                        </div>
                                    </section>

                                    <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-xl flex items-start gap-3">
                                        <Info className="text-blue-500 mt-1 shrink-0" size={16} />
                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                            Thông tin về suất chiếu và các phòng chiếu (2D, 3D, IMAX) sẽ được cập nhật liên tục tại trang quản lý phòng.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-10 text-center text-neutral-500">Không tìm thấy thông tin rạp.</div>
                )}
            </DialogContent>
        </Dialog>
    );
}