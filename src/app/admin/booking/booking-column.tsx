import { Button } from "@/components/ui/button";
import { BookingStatusEnum } from "@/constants/enum";
import { BookingAdmin } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";



export const bookingColumns = (
  onViewDetail: (booking: BookingAdmin) => void,
): ColumnDef<BookingAdmin>[] => [
    {
      accessorKey: "_id",
      header: "Mã hóa đơn",
    },
    {
      accessorKey: "userId.fullName",
      header: "Khách hàng",
      cell: ({ row }) => {
        const user = row.original.userId;
        return (
          <div>
            <div className="font-semibold">{user.fullName}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "finalAmount",
      header: "Tổng tiền",
      cell: ({ row }) => {
        const amount = row.original.finalAmount;
        // Định dạng tiền tệ VNĐ
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
      }
    },
    {
      accessorKey: "bookingStatus",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.bookingStatus;
        // Màu sắc cho từng trạng thái
        const color = status === BookingStatusEnum.SUCCESS ? 'text-green-600' : 
                      status === BookingStatusEnum.FAILED ? 'text-red-600' : 'text-yellow-600';
        return <span className={`font-semibold ${color}`}>{status.toUpperCase()}</span>;
      }
    },
    {
      accessorKey: "createdAt",
      header: "Ngày đặt",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleString('vi-VN');
      }
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const booking = row.original;
        
        return (
          <div className="flex gap-2">
            <Button  size="sm" className="btn-custom" onClick={() => onViewDetail(booking)}>
              <Eye size={16} className="mr-1" />
              Chi tiết
            </Button>
            
          </div>
        );
      },
    },
  ];