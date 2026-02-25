"use client";
import SectionTitle from "@/components/common/title/section-title";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogList } from "@/queries/useBlogQuery";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";

export default function BlogSection() {
    // Gọi API lấy danh sách blog (lấy khoảng 4-5 bài để làm layout)
    const { data, isLoading } = useBlogList({
        page: 1,
        limit: 4,
    });

    const blogs = data?.data || [];

    if (isLoading) return <BlogSectionSkeleton />;

    const firstBlog = blogs[0];
    const remainingBlogs = blogs.slice(1);

    return (
        <section className="py-16">
            <div className="container mx-auto">
                <div className="flex justify-between">
                    <SectionTitle title="Bài viết mới" />
                    <div className="flex justify-center mt-12">
                        <Link href="/blog">
                            <div className="text-sm text-gray-400 italic font-bold hover:underline">
                                Xem thêm
                            </div>
                        </Link>
                    </div>
                </div>


                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Bài viết lớn bên trái */}
                    {firstBlog && (
                        <Link
                            href={`/blog/${firstBlog._id}`}
                            className="flex-1 group cursor-pointer"
                        >
                            <div className="w-full h-[400px] overflow-hidden rounded-lg">
                                <img
                                    src={firstBlog.thumbnail || "/no-image.png"}
                                    alt={firstBlog.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-2xl text-white mt-4 group-hover:text-blue-500 transition-colors line-clamp-2">
                                {firstBlog.title}
                            </h3>
                        </Link>
                    )}

                    {/* Danh sách bài viết nhỏ bên phải */}
                    <div className="flex flex-col gap-6 lg:w-[450px]">
                        {remainingBlogs.map((blog) => (
                            <Link
                                key={blog._id}
                                href={`/blog/${blog._id}`}
                                className="flex gap-4 group cursor-pointer"
                            >
                                <div className="w-[195px] h-[110px] flex-shrink-0 overflow-hidden rounded-md">
                                    <img
                                        src={blog.thumbnail || "/no-image.png"}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex flex-col justify-start">
                                    <h4 className="text-lg text-white group-hover:text-blue-500 transition-colors line-clamp-3">
                                        {blog.title}
                                    </h4>
                                    <span className="text-neutral-500 text-xs mt-2">
                                        {blog.createdAt && format(new Date(blog.createdAt), "dd/MM/yyyy", { locale: vi })}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>


            </div>
        </section>
    );
}

// Skeleton khi đang load dữ liệu
function BlogSectionSkeleton() {
    return (
        <div className="container mx-auto px-4 py-16">
            <Skeleton className="h-12 w-48 mx-auto mb-8 bg-neutral-800" />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-[400px] w-full bg-neutral-800 rounded-lg" />
                    <Skeleton className="h-8 w-3/4 bg-neutral-800" />
                </div>
                <div className="flex flex-col gap-6 lg:w-[450px]">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                            <Skeleton className="w-[195px] h-[110px] bg-neutral-800 rounded-md" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full bg-neutral-800" />
                                <Skeleton className="h-4 w-1/2 bg-neutral-800" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}