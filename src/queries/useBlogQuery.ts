import { BlogInput } from "@/schemas/blog.schema"
import { BlogService } from "@/services/blog.service"
import { BlogParams } from "@/types/param"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const BLOG_QUERY_KEY = ["blogs"]

export const useBlogList = (params: BlogParams) => {
    return useQuery({
        queryKey: [...BLOG_QUERY_KEY, params],
        queryFn: async () => {
            const res = await BlogService.getList(params)
            return res.data
        },
    })
}

export const useBlogDetail = (id?: string, enabled = true) => {
  return useQuery({
    queryKey: [...BLOG_QUERY_KEY, id],
    queryFn: async () => {
      const res = await BlogService.getDetail(id!)
      return res.data
    },
    enabled: enabled && !!id,   
  })
}

export const useCreateBlog = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: BlogService.create,
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: BLOG_QUERY_KEY }),
    })
}

export const useUpdateBlog = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<BlogInput> }) =>
            BlogService.update(id, data),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: BLOG_QUERY_KEY }),
    })
}

export const useDeleteBlog = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: BlogService.delete,
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: BLOG_QUERY_KEY }),
    })
}

export const useChangePublishStatus = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            isPublished,
        }: {
            id: string
            isPublished: boolean
        }) => BlogService.changePublishStatus(id, isPublished),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: BLOG_QUERY_KEY })
        },
    })
}