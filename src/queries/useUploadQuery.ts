import { uploadService } from "@/services/upload.service";
import { ApiResponse } from "@/types/body";
import { Upload } from "@/types/object";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useUploadMedia = (
    options?: UseMutationOptions<ApiResponse<Upload>, Error, File>
) => {
    return useMutation<ApiResponse<Upload>, Error, File>({
        mutationFn: (file: File) => uploadService.uploadMedia(file), 
        ...options 
    });
};