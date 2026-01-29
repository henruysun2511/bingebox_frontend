import { useUploadMedia } from "@/queries/useUploadQuery";
import { Upload } from "@/types/object";
import { handleError } from "@/utils/error";
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
            handleError(error);
            throw error;
        }
    };

    return {
        uploadFile,
        isUploading: isPending,
    };
};