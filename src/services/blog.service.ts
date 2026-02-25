import { BlogInput } from "@/schemas/blog.schema"
import { ApiResponse } from "@/types/body"
import { Blog } from "@/types/object"
import { BlogParams } from "@/types/param"
import http from "@/utils/http"

const prefix = "blogs"

export const BlogService = {
    getList(params: BlogParams) {
        return http.get<ApiResponse<Blog[]>>(`/${prefix}`, { params })
    },

    getDetail(id: string) {
        return http.get<ApiResponse<Blog>>(`/${prefix}/${id}`)
    },

    create(payload: BlogInput) {
        return http.post<ApiResponse<Blog>>(`/${prefix}`, payload)
    },

    update(id: string, payload: Partial<BlogInput>) {
        return http.patch<ApiResponse<Blog>>(`/${prefix}/${id}`, payload)
    },

    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`)
    },
    changePublishStatus(id: string, isPublished: boolean) {
        return http.patch<ApiResponse<Blog>>(
            `/${prefix}/publish/${id}`,
            { isPublished }
        )
    },
}