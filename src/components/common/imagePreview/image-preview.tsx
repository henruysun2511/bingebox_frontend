import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  src: string;
  alt: string;
  fallback?: string;
  width?: string;  // Ví dụ: "w-10" hoặc "w-20"
  height?: string; // Ví dụ: "h-10" hoặc "h-20"
  className?: string; // Cho phép truyền thêm class tùy biến khác
}

export function ImagePreview({ 
  src, 
  alt, 
  fallback, 
  width = "w-10", 
  height = "h-10",
  className 
}: ImagePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className={cn(
          "rounded-md border border-white/10 cursor-pointer hover:opacity-80 transition shrink-0",
          width, 
          height, 
          className
        )}>
          <AvatarImage src={src} alt={alt} className="object-cover" />
          <AvatarFallback className="bg-neutral-800 text-xs uppercase text-white">
            {fallback || alt.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none flex justify-center items-center focus:outline-none">
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-300" 
        />
      </DialogContent>
    </Dialog>
  );
}