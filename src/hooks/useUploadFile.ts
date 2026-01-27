import { useUploadMedia } from "@/queries/useUploadQuery";
import { Upload } from "@/types/object";
import { toast } from "sonner";

export const useUploadFile = () => {
    const { mutateAsync, isPending } = useUploadMedia();

    const uploadFile = async (file: File): Promise<Upload> => {
        try {
            toast.info("Đang upload file");
            const res = await mutateAsync(file);
            return {
                url: res.data.url,
                publicId: res.data.publicId,
            };
        } catch (error: any) {
            const msg =
                error?.response?.data?.message || "Lỗi upload ảnh";
            toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
            throw error;
        }
    };

    return {
        uploadFile,
        isUploading: isPending,
    };
};