"use client";

import UserPasswordDialog from "@/app/(client)/profile/user-password-dialog";
import ProfileSkeleton from "@/components/common/skeleton/profile-admin-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMe } from "@/queries/useUserQuery";
import { LockKeyhole, Mail, ShieldCheck, User } from "lucide-react";
import { useState } from "react";

export default function AdminProfilePage() {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const { data: meRes, isLoading } = useGetMe();
  const user = meRes?.data;

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white uppercase tracking-wider">
          Hồ sơ quản trị viên
        </h1>
        <Button 
          onClick={() => setIsPasswordDialogOpen(true)}
          className="btn-custom"
        >
          <LockKeyhole size={18} />
          Đổi mật khẩu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Thông tin chính */}
        <Card className="md:col-span-2 bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-xl text-neutral-200">Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem icon={User} label="Họ và tên" value={user?.fullName || "Chưa cập nhật"} />
            <InfoItem icon={Mail} label="Email đăng nhập" value={user?.email || "Chưa cập nhật"} />
            <InfoItem icon={ShieldCheck} label="Vai trò" value={user?.role?.name || "Admin"} />
          </CardContent>
        </Card>

        {/* Card Avatar/Ảnh đại diện */}
        <Card className="bg-neutral-900 border-neutral-800 flex flex-col items-center justify-center p-6">
          <img 
            src={user?.avatar || "/default-avatar.png"} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full border-4 border-orange-500/30 object-cover"
          />
          <p className="mt-4 text-lg font-semibold text-white">{user?.fullName}</p>
          <p className="text-sm text-neutral-400">@{user?.username}</p>
        </Card>
      </div>

      {/* Dialog đổi mật khẩu */}
      <UserPasswordDialog 
        open={isPasswordDialogOpen} 
        onClose={() => setIsPasswordDialogOpen(false)} 
      />
    </div>
  );
}


function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-black/30 border border-neutral-800">
      <div className="p-3 rounded-full bg-blue-500/10 text-blue">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="text-lg font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

