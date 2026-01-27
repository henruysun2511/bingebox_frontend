import { ApiResponse } from "@/types/body";
import { Upload } from "@/types/object";
import http from "@/utils/http";

export const uploadService = {
    uploadMedia: (file: File): Promise<ApiResponse<Upload>> => { 
        const formData = new FormData();
        formData.append('image', file); 
        
        return http.post<ApiResponse<Upload>>(`/upload/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(res => res.data); 
    },
};