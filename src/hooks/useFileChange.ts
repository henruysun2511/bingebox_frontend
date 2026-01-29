import { useUploadFile } from "@/hooks/useUploadFile";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export function useFileChange<TFieldValues extends FieldValues>(
    form: UseFormReturn<TFieldValues>,
) {
    const { uploadFile, isUploading } = useUploadFile();

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: Path<TFieldValues>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chỉ chọn tệp hình ảnh");
            return;
        }

        try {
            const uploaded = await uploadFile(file);

            form.setValue(fieldName, uploaded.url as any, { 
                shouldValidate: true,
                shouldDirty: true 
            });

            toast.success("Tải ảnh lên thành công");
        } catch (error) {
            toast.error("Tải ảnh lên thất bại");
            console.error("Upload error:", error);
        } finally {
            e.target.value = "";
        }
    };

    return {
        handleFileChange,
        isUploading,
    };
}