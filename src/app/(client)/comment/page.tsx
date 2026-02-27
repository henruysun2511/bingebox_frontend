"use client";

import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MovieStatusEnum } from "@/constants/enum";
import { useCommentListByMovie, useCreateComment, useDeleteComment, useToggleLikeComment, useUpdateComment } from "@/queries/useCommentQuery";
import { useMovieDetail, useMovieList } from "@/queries/useMovieQuery";
import { useGetMe } from "@/queries/useUserQuery";
import { createCommentSchema } from "@/schemas/comment.schema";
import { handleError } from "@/utils/error";
import { Edit2, Film, Loader2, MessageCircle, MoreVertical, Send, Star, ThumbsUp, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ReplyDialog } from "./reply-comment-dialog";

export default function CommentPage() {
    // Lấy thông tin người dùng (để check quyền sửa/xóa)
    const { data: meRes } = useGetMe();
    const currentUser = meRes?.data;

    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [rating, setRating] = useState<number>(5);
    const [page, setPage] = useState(1);
    const [replyingComment, setReplyingComment] = useState<any | null>(null);

    // State cho việc chỉnh sửa
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

    // 1. Queries
    const { data: moviesRes, isLoading: isLoadingList } = useMovieList({ page: 1, limit: 10, status: MovieStatusEnum.NOW_SHOWING });
    const movies = moviesRes?.data || [];

    const { data: movieDetailRes } = useMovieDetail(selectedMovieId || undefined);
    const movieDetail = movieDetailRes?.data || null;

    const { data: commentRes, isLoading: isLoadingComments, refetch: refetchComments } = useCommentListByMovie(selectedMovieId || undefined, { page, limit: 10 });
    const comments = (commentRes as any)?.data || [];
    const pagination = (commentRes as any)?.pagination || null;

    // 2. Mutations
    const createCommentMutation = useCreateComment(selectedMovieId || "");
    const updateCommentMutation = useUpdateComment(selectedMovieId || "");
    const deleteCommentMutation = useDeleteComment(selectedMovieId || "");
    const toggleLikeMutation = useToggleLikeComment(selectedMovieId || "");

    const handleSelectMovie = (id: string) => {
        setSelectedMovieId(id);
        cancelEdit();
        setPage(1);
    };


    // Bật chế độ sửa
    const handleEditClick = (comment: any) => {
        setEditingCommentId(comment._id);
        setCommentContent(comment.content);
        setRating(comment.rating);
        // Cuộn xuống box comment
        document.getElementById("comment-box")?.scrollIntoView({ behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setCommentContent("");
        setRating(5);
    };

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
            deleteCommentMutation.mutate(id, {
                onSuccess: () => {
                    toast.success("Đã xóa bình luận");
                    refetchComments();
                }
            });
        }
    };

    const handleToggleLike = (id: string) => {
        toggleLikeMutation.mutate(id, {
            onSuccess: () => {
                toast.success("Đã cập nhật thích bình luận");
                refetchComments()
            }
        });
    };

    const handleSubmitComment = () => {
        if (!commentContent.trim() || !selectedMovieId) return;

        // 1. Chuẩn bị dữ liệu cho Zod validation
        const payload = {
            movie: selectedMovieId,
            content: commentContent,
            rating: rating,
        };

        const validation = createCommentSchema.safeParse(payload);

        if (!validation.success) {
            toast.error(validation.error.issues[0].message);
            return;
        }

        if (editingCommentId) {
            updateCommentMutation.mutate(
                {
                    id: editingCommentId,
                    data: validation.data
                },
                {
                    onSuccess: () => {
                        toast.success("Cập nhật bình luận thành công!");
                        cancelEdit();
                    },
                    onError: (error: any) => {
                        handleError(error);
                    }
                }
            );
        } else {
            // 3. TRƯỜNG HỢP TẠO MỚI (CREATE)
            createCommentMutation.mutate(
                validation.data,
                {
                    onSuccess: () => {
                        setCommentContent("");
                        setRating(5);
                        toast.success("Đã đăng bình luận");
                        refetchComments();
                    },
                    onError: (error: any) => {
                        handleError(error);
                    }
                }
            );
        }
    };

    return (
        <div className="min-h-screen text-white pt-24 pb-20">
               <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold mb-4 
          bg-gradient-to-r from-blue-400 to-blue-600
          bg-clip-text text-transparent">
                        Bàn luận điện ảnh
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                       Cùng nghe khán giả review trải nghiệm xem phim tại rạp
                    </p>
                </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
             

                {/* ===== SIDEBAR: MOVIE LIST (CỘT TRÁI) ===== */}
                <div className="md:col-span-4 lg:col-span-3">
                    <div className="bg-gradient-to-br from-[#23235c] to-[#3c3cb8] p-5 rounded-2xl border border-white/10 shadow-xl sticky top-24">
                        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                            <Film size={20} className="text-blue-300" />
                            Danh sách phim
                        </h2>

                        <div className="space-y-4 max-h-[70vh] custom-scrollbar overflow-y-auto pr-2">
                            {isLoadingList && <Loader2 className="animate-spin mx-auto" />}
                            {movies.map((movie) => (
                                <div
                                    key={movie._id}
                                    onClick={() => handleSelectMovie(movie._id)}
                                    className="w-full h-auto rounded-lg overflow-hidden cursor-pointer">
                                    <img
                                        src={movie.poster || "/placeholder.jpg"}
                                        alt={movie.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== MAIN CONTENT: DETAIL & COMMENTS (CỘT PHẢI) ===== */}
                <div className="md:col-span-8 lg:col-span-9">
                    {!selectedMovieId && (
                        <div className="text-center pt-20 text-white/50">
                            <Film size={48} className="mx-auto mb-4" />
                            Chọn một bộ phim để xem chi tiết và bình luận
                        </div>
                    )}

                    {selectedMovieId && movieDetail && (
                        <div className="space-y-8">
                            {/* Info Detail */}
                            <div className="bg-gradient-to-br 
                           from-[#23235c] 
                           to-[#3c3cb8] px-12 py-14 text-white rounded-2xl border border-white/10 shadow-xl">

                                {/* ===== TITLE ===== */}
                                <h1 className="text-4xl font-bold tracking-wide mb-6 uppercase">
                                    {movieDetail.name}
                                </h1>

                                {/* ===== META LINE ===== */}
                                <div className="flex items-center gap-8 text-base text-white/90 mb-8">
                                    <span className="font-semibold">
                                        {movieDetail.agePermission}
                                    </span>

                                    <span>{movieDetail.duration} phút</span>

                                    <span>Phụ đề</span>
                                </div>

                                {/* ===== DESCRIPTION ===== */}
                                <p className="text-base leading-relaxed text-white/85 max-w-5xl mb-12">
                                    {movieDetail.description}
                                </p>

                                {/* ===== INFO LIST ===== */}
                                <div className="space-y-6 text-base">

                                    {/* Diễn viên */}
                                    <div className="flex gap-10">
                                        <p className="w-40 text-white/80">Diễn viên</p>
                                        <p className="text-white/60">
                                            {movieDetail.actors
                                                ? movieDetail.actors.map((actor: any) => actor.name).join(", ")
                                                : "Chưa cập nhật"}
                                        </p>
                                    </div>

                                    {/* Thể loại */}
                                    <div className="flex gap-10">
                                        <p className="w-40 text-white/80">Thể loại</p>
                                        <p className="text-white/60">
                                            {movieDetail.categories.map((actor: any) => actor.name).join(", ") || "Chưa cập nhật"}
                                        </p>
                                    </div>

                                    {/* Khởi chiếu */}
                                    <div className="flex gap-10">
                                        <p className="w-40 text-white/80">Khởi chiếu</p>
                                        <p className="text-white/60">
                                            {new Date(movieDetail.releaseDate).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* Comment Section */}
                            <div className="bg-gradient-to-br from-[#23235c] to-[#3c3cb8] p-8 rounded-2xl border border-white/10 shadow-xl">
                                <h2 className="text-2xl font-bold mb-6">Bình luận</h2>

                                <div className="flex flex-wrap gap-5 max-h-[600px] overflow-y-auto pr-2 mb-6">
                                    {isLoadingComments && <Loader2 className="animate-spin" />}
                                    {comments.map((comment: any) => {
                                        const isMyComment = currentUser?._id === comment.user._id;
                                        const isLiked = comment.likes.includes(currentUser?._id);

                                        return (
                                            <div key={comment._id} className="relative overflow-hidden rounded-2xl p-6 w-full md:w-[400px] bg-white/5 border border-white/10 group">
                                                {/* Dấu 3 chấm Menu */}
                                                {isMyComment && (
                                                    <div className="absolute top-4 right-4 z-10">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger className="p-1 hover:bg-white/10 rounded-full outline-none">
                                                                <MoreVertical size={18} />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-[#23235c] border-white/10 text-white">
                                                                <DropdownMenuItem onClick={() => handleEditClick(comment)} className="cursor-pointer gap-2 hover:bg-blue-500">
                                                                    <Edit2 size={14} /> Sửa
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDelete(comment._id)} className="cursor-pointer gap-2 text-red-400 hover:bg-red-500 hover:text-white">
                                                                    <Trash2 size={14} /> Xóa
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                )}

                                                <img src={movieDetail?.banner || "/placeholder.jpg"} className="absolute inset-0 w-full h-full object-cover scale-105 blur-xs opacity-20 pointer-events-none" alt="" />

                                                <div className="relative flex gap-4">
                                                    <img src={comment.user.avatar} className="w-12 h-12 rounded-xl object-cover border border-white/20" alt="" />
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-yellow-400">{comment.user.username}</h3>
                                                        {comment.user.tags && comment.user.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 py-3">
                                                                {comment.user.tags.map((tag: string, index: number) => (
                                                                    <span
                                                                        key={index}
                                                                        className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full border border-blue-500/30"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <p className="text-white/90 text-sm line-clamp-3 mt-1">{comment.content}</p>

                                                        <div className="flex gap-1 mt-2">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star key={s} size={14} className={s <= comment.rating ? "fill-white" : "text-white/20"} />
                                                            ))}
                                                        </div>

                                                        <div className="flex justify-end items-center gap-4 mt-4">
                                                            <button
                                                                onClick={() => handleToggleLike(comment._id)}
                                                                className={`flex items-center gap-1 text-xs transition ${isLiked ? 'text-blue-400' : 'text-white/60 hover:text-white'}`}
                                                            >
                                                                <ThumbsUp size={14} className={isLiked ? "fill-blue-400" : ""} />
                                                                <span>{comment.likes.length}</span>
                                                            </button>
                                                            <div className="flex items-center gap-1 text-white/60 text-xs cursor-pointer" onClick={() => setReplyingComment(comment)}>
                                                                <MessageCircle size={14} />
                                                                <span>{comment.replyCount}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {pagination && pagination.totalPages > 1 && (
                                    <div className="flex justify-center pb-8">
                                        <DataPagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
                                    </div>
                                )}

                                {/* COMMENT BOX */}
                                <div id="comment-box" className={`space-y-4 p-6 mt-20 rounded-xl border transition-all ${editingCommentId ? 'bg-blue-500/10 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{editingCommentId ? "Đang chỉnh sửa bình luận:" : "Để lại đánh giá của bạn:"}</p>
                                        {editingCommentId && (
                                            <button onClick={cancelEdit} className="text-xs flex items-center gap-1 hover:text-red-400">
                                                <X size={14} /> Hủy sửa
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={28} onClick={() => setRating(star)}
                                                className={`cursor-pointer transition ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-white/30 hover:text-yellow-200"}`}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <textarea
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            placeholder="Bạn thấy phim thế nào..."
                                            className="flex-1 bg-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-400 border border-transparent resize-none"
                                            rows={2}
                                        />
                                        <button
                                            onClick={handleSubmitComment}
                                            disabled={createCommentMutation.isPending || updateCommentMutation.isPending}
                                            className="bg-blue-500 hover:bg-blue-600 p-4 rounded-xl transition disabled:opacity-50"
                                        >
                                            {(createCommentMutation.isPending || updateCommentMutation.isPending) ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>

            <ReplyDialog
                parentComment={replyingComment}
                onClose={() => setReplyingComment(null)}
                currentUser={currentUser}
                movieId={selectedMovieId || ""}
            />
        </div>
    );
}