"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AgePermissionTypeEnum, MovieStatusEnum } from "@/constants/enum";
import { MOVIE_FORMATS, MOVIE_STATUS_OPTIONS, SUBTITLE_TYPE_OPTIONS } from "@/constants/filter";
import { useFileChange } from "@/hooks/useFileChange";
import { cn } from "@/lib/utils";
import { useActorList } from "@/queries/useActorQuery";
import { useCategoryList } from "@/queries/useCategoryQuery";
import { useCreateMovie, useMovieActors, useUpdateMovie } from "@/queries/useMovieQuery";
import { MovieInput, MovieSchema } from "@/schemas/movie.schema";
import { Movie } from "@/types/object";
import { handleError } from "@/utils/error";
import { removeEmptyFields } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandEmpty, CommandGroup } from "cmdk";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    movie?: Movie;
}

export function MovieDialog({ open, onClose, movie }: Props) {
    const isEdit = !!movie;

    const form = useForm<MovieInput>({
        resolver: zodResolver(MovieSchema),
        defaultValues: {
            name: "",
            duration: 0,
            releaseDate: "",
            director: "",
            description: "",
            subtitle: "",
            poster: "",
            banner: "",
            trailer: "",
            actors: [],
            categories: [],
            nationality: "",
            agePermission: "",
            status: MovieStatusEnum.NOW_SHOWING,
            format: [],
        },
    });

    const createMovie = useCreateMovie();
    const updateMovie = useUpdateMovie();

    const { handleFileChange: uploadPoster, isUploading: upPoster } = useFileChange(form);
    const { handleFileChange: uploadBanner, isUploading: upBanner } = useFileChange(form);

    const { data: categoryRes } = useCategoryList();
    const { data: actorRes } = useActorList({});
    const { data: movieActorsRes, isLoading: loadingActors } = useMovieActors(movie?._id, {
        enabled: open && isEdit && !!movie?._id
    });

    const categories = categoryRes?.data || [];
    const actors = actorRes?.data || [];

    useEffect(() => {
        if (open) {
            if (movie) {
                form.reset({
                    ...movie,
                    actors: movie.actors || [],      
                    categories: movie.categories || [], 
                    format: movie.format || [],    
                } as any);

                if (movieActorsRes?.data) {
                    const actorIds = movieActorsRes.data.map((a: any) => a._id);
                    form.setValue("actors", actorIds);
                }
            } else {
                form.reset();
            }
        }
    }, [open, movie, form]);

    const onSubmit = async (values: MovieInput) => {
        const cleanValues = removeEmptyFields(values);

        try {
            if (isEdit) {
                await updateMovie.mutateAsync({ id: movie!._id, data: cleanValues as MovieInput });
                toast.success("Cập nhật phim thành công");
            } else {
                await createMovie.mutateAsync(cleanValues);
                toast.success("Thêm phim thành công");
            }
            onClose();
        } catch (e) {
            handleError(e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] bg-black text-white max-h-[92vh] border border-neutral-800 p-10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {isEdit ? "Sửa Phim" : "Thêm Phim Mới"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        {/* ========== THÔNG TIN CƠ BẢN ========== */}
                        <div className="grid grid-cols-3 gap-6">
                            <FormField name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Tên phim</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="form-input-custom" />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />

                            <FormField name="director" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Đạo diễn</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="form-input-custom" />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />

                            <FormField name="nationality" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Quốc gia</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="form-input-custom" />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-5 gap-6">
                            <FormField name="duration" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Thời lượng (phút)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="form-input-custom" onChange={(e) => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />

                            <FormField name="releaseDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Ngày chiếu</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="form-date-custom" />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />

                            <FormField name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Trạng thái</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="form-input-custom">
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="select-content-custom z-50">
                                            {MOVIE_STATUS_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value} className="select-item-custom uppercase">
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />

                            <FormField
                                name="subtitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">Loại phụ đề</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="form-input-custom">
                                                    <SelectValue placeholder="Chọn loại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="select-content-custom z-[100]">
                                                {SUBTITLE_TYPE_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value} className="select-item-custom uppercase">
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )}
                            />

                            <FormField name="agePermission" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Độ tuổi</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="form-input-custom">
                                                <SelectValue placeholder="Chọn độ tuổi" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="select-content-custom z-50">
                                            {Object.values(AgePermissionTypeEnum).map((age: string) => (
                                                <SelectItem key={age} value={age} className="select-item-custom uppercase">
                                                    Phân loại {age}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />
                        </div>

                        {/* ========== FORMAT & CATEGORIES ========== */}
                        <div className="grid grid-cols-2 gap-8 p-4 border border-neutral-800 rounded-lg bg-neutral-900/20">
                            <FormField name="format" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom border-b border-neutral-800 pb-2 mb-4 block">Định dạng phim</FormLabel>
                                    <div className="flex flex-wrap gap-6">
                                        {MOVIE_FORMATS.map((f: string) => (
                                            <label key={f} className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors text-sm">
                                                <Checkbox
                                                    checked={field.value?.includes(f)}
                                                    onCheckedChange={(checked: boolean) =>
                                                        checked
                                                            ? field.onChange([...field.value, f])
                                                            : field.onChange(field.value.filter((v: string) => v !== f))
                                                    }
                                                    className="checkbox-custom"
                                                />
                                                {f}
                                            </label>
                                        ))}
                                    </div>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />

                            <FormField name="categories" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom border-b border-neutral-800 pb-2 mb-4 block">Thể loại</FormLabel>
                                    <div className="grid grid-cols-3 gap-3">
                                        {categories.map((c: any) => (
                                            <label key={c._id} className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors text-sm">
                                                <Checkbox
                                                    checked={field.value.includes(c._id)}
                                                    onCheckedChange={(checked: boolean) =>
                                                        checked
                                                            ? field.onChange([...field.value, c._id])
                                                            : field.onChange(field.value.filter((id: string) => id !== c._id))
                                                    }
                                                    className="checkbox-custom"
                                                />
                                                {c.name}
                                            </label>
                                        ))}
                                    </div>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />
                        </div>

                        {/* ========== ACTORS & DESCRIPTION ========== */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-1">
                                <FormField name="actors" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">Diễn viên</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" className="w-full justify-start form-input-custom font-normal">
                                                        {field.value.length
                                                            ? `${field.value.length} diễn viên đã chọn`
                                                            : "Chọn diễn viên..."}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0 bg-neutral-900 border-neutral-800" align="start">
                                                <Command className="bg-transparent text-white">
                                                    <CommandInput placeholder="Tìm diễn viên..." className="text-white" />
                                                    <CommandList>
                                                        <CommandEmpty>Không tìm thấy diễn viên.</CommandEmpty>
                                                        <CommandGroup className="max-h-64 overflow-y-auto">
                                                            {actors.map((a: any) => (
                                                                <CommandItem
                                                                    key={a._id}
                                                                    className="aria-selected:bg-neutral-800 text-white cursor-pointer"
                                                                    onSelect={() => {
                                                                        const currentIds: string[] = field.value;
                                                                        currentIds.includes(a._id)
                                                                            ? field.onChange(currentIds.filter((id: string) => id !== a._id))
                                                                            : field.onChange([...currentIds, a._id]);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4 text-blue-500",
                                                                            field.value.includes(a._id) ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <img src={a.avatar} alt={a.name} className="w-15 h-15 object-cover rounded-full mr-2" />
                                                                    {a.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="col-span-2">
                                <FormField name="description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">Mô tả phim</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className="form-input-custom h-[42px] min-h-[42px] resize-none" placeholder="Nhập nội dung phim..." />
                                        </FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* ========== MEDIA (POSTER/BANNER/TRAILER) ========== */}
                        <div className="grid grid-cols-2 gap-6 items-start">
                            <div className="space-y-4">
                                <FormLabel className="form-label-custom">Poster & Banner</FormLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="upload-box-custom h-52 border-dashed border-2 hover:border-blue-500 transition-all cursor-pointer overflow-hidden rounded-lg">
                                        <input type="file" hidden onChange={(e) => uploadPoster(e, "poster")} />
                                        {form.watch("poster")
                                            ? <img src={form.watch("poster")} className="w-full h-full object-cover" />
                                            : <span className="w-full h-full rounded-md object-cover border border-neutral-800 transition-all group-hover:border-blue">Upload Poster (2:3)</span>}
                                    </label>

                                    <label className="upload-box-custom h-52 border-dashed border-2 hover:border-blue-500 transition-all cursor-pointer overflow-hidden rounded-lg">
                                        <input type="file" hidden onChange={(e) => uploadBanner(e, "banner")} />
                                        {form.watch("banner")
                                            ? <img src={form.watch("banner")} className="w-full h-full object-cover" />
                                            : <span className="w-full h-full rounded-md object-cover border border-neutral-800 transition-all group-hover:border-blue">Upload Banner (16:9)</span>}
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <FormField name="trailer" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">Trailer URL (Youtube/Vimeo)</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="form-input-custom" placeholder="https://youtube.com/..." />
                                        </FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )} />

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="btn-custom w-full h-14 text-xl font-bold uppercase tracking-wider"
                                        disabled={upPoster || upBanner || createMovie.isPending || updateMovie.isPending}
                                    >
                                        {upPoster || upBanner ? "Đang tải ảnh..." : isEdit ? "Cập nhật phim" : "Tạo phim mới"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
