import { toast } from "sonner";

export const handleError = (error: any, defaultMsg: string = "Thao tác thất bại") => {
    const errorData = error?.response?.data;
    
    const msg =
        (errorData?.messages && errorData.messages[0]) ||
        errorData?.message ||
        defaultMsg;
    
    toast.error(msg);
    
    return msg; 
}