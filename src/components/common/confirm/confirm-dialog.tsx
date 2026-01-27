import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    isLoading?: boolean;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Bạn có chắc chắn muốn xóa?",
    description = "Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn.",
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="bg-neutral-900 text-white border-neutral-800">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-neutral-400">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        disabled={isLoading}
                        className="bg-neutral-800 hover:bg-neutral-700 border-none text-white cursor-pointer"
                    >
                        Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault(); // Ngăn đóng dialog ngay lập tức để đợi xóa
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 border-none flex items-center gap-2 cursor-pointer"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Xác nhận
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}