"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useCreateBlog, useUpdateBlog } from "@/queries/useBlogQuery";
import { BlogInput, BlogSchema } from "@/schemas/blog.schema";
import { Blog } from "@/types/object";
import { handleError } from "@/utils/error";
import { removeEmptyFields } from "@/utils/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUploadFile } from "@/hooks/useUploadFile";
import { BlogEditor } from "./blog-editor";

interface Props {
  open: boolean;
  onClose: () => void;
  blog?: Blog;
}

export function BlogDialog({ open, onClose, blog }: Props) {
  const isEdit = !!blog;

  const form = useForm<BlogInput>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: "",
      slug: "",
      thumbnail: "",
      content: "",
    },
  });

  const { uploadFile, isUploading } = useUploadFile();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  useEffect(() => {
    if (open) {
      if (blog) {
        form.reset({
          title: blog.title,
          slug: blog.slug,
          thumbnail: blog.thumbnail,
          content: blog.content,
        });
      } else {
        form.reset({
          title: "",
          slug: "",
          thumbnail: "",
          content: "",
        });
      }
    }
  }, [open, blog, form]);

  /* Upload thumbnail */
  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await uploadFile(file);
      form.setValue("thumbnail", uploaded.url, {
        shouldValidate: true,
      });
      toast.success("Upload thumbnail thành công");
    } catch {
      toast.error("Upload thất bại");
    }
  };

  const onSubmit = async (values: BlogInput) => {
    try {
      const cleanValues = removeEmptyFields(values) as BlogInput;
      console.log(cleanValues);
      if (isEdit) {
        await updateBlog.mutateAsync({
          id: blog!._id,
          data: cleanValues,
        });
        toast.success("Cập nhật blog thành công");
      } else {
        await createBlog.mutateAsync(cleanValues);
        toast.success("Tạo blog thành công");
      }

      onClose();
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal={false}>
      <DialogContent

        onInteractOutside={(e) => e.preventDefault()}
        className="!max-w-7xl bg-black text-white overflow-y-auto max-h-[90vh] border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Sửa Blog" : "Thêm Blog"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label-custom">
                    Tiêu đề
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="form-input-custom"
                      placeholder="Nhập tiêu đề blog..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="form-error-custom" />
                </FormItem>
              )}
            />

            {/* SLUG */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label-custom">
                    Slug
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="form-input-custom"
                      placeholder="vi-du-slug"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="form-error-custom" />
                </FormItem>
              )}
            />

            {/* THUMBNAIL */}
            <div className="space-y-2">
              <label className="form-label-custom">Thumbnail</label>

              {form.watch("thumbnail") && (
                <div className="relative w-40 h-24">
                  <img
                    src={form.watch("thumbnail")}
                    className="w-full h-full object-cover rounded-md border border-neutral-800"
                  />
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                disabled={isUploading}
                className="form-input-file-custom"
              />
            </div>

            {/* CONTENT */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label-custom">
                    Nội dung
                  </FormLabel>
                  <FormControl>
                    <BlogEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="form-error-custom" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="btn-custom w-full"
              disabled={
                isUploading ||
                createBlog.isPending ||
                updateBlog.isPending
              }
            >
              {isEdit ? "Lưu thay đổi" : "Tạo Blog mới"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}