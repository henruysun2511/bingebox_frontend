"use client";
import { DataPagination } from "@/components/admin/pagination/data-pagination";
import BlogCardSkeleton from "@/components/common/skeleton/blog-card-skeleton";
import { useBlogList } from "@/queries/useBlogQuery";
import { useState } from "react";
import BlogCard from "./blog-card";

export default function BlogList() {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useBlogList({
        page,
        limit: 8,
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <BlogCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    const blogs = data?.data || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-8">
            {/* Grid List */}
            {blogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center sm:justify-items-start">
                    {blogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className="text-neutral-400 text-center py-20 bg-neutral-900/20 rounded-xl border border-dashed border-neutral-800">
                    Chưa có bài viết nào được xuất bản.
                </div>
            )}

            {/* Pagination */}

            <div className="flex justify-center pt-6">
                <DataPagination
                    page={pagination?.page ?? 1}
                    totalPages={pagination?.totalPages ?? 1}
                    onPageChange={setPage}
                />
            </div>

        </div>
    );
}