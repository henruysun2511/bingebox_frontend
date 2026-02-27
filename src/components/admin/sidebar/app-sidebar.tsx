"use client"

import {
  IconBuildingCommunity,
  IconCalendarEvent,
  IconCamera,
  IconCarrot,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconMovie,
  IconReport,
  IconSettings,
  IconTicket,
  IconTicketOff,
  IconUsers
} from "@tabler/icons-react"
import * as React from "react"

import { NavMain } from "@/components/admin/sidebar/nav-main"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLogout } from "@/queries/useAuthQuery"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { NavSecondary } from "./nav-secondary"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Tổng quan",
      url: "/admin/overview",
      icon: IconDashboard,
    },
    {
      title: "Quản lý người dùng",
      url: "#",
      icon: IconUsers,
      items: [
        { title: "Người dùng", url: "/admin/user" },
        { title: "Vai trò", url: "/admin/role" },
        { title: "Quyền hạn", url: "/admin/permission" },
        { title: "Hạng thành viên", url: "/admin/membership" },
        { title: "Loại độ tuổi", url: "/admin/ageType" },
      ],
    },
    {
      title: "Quản lý phim",
      url: "#",
      icon: IconMovie,
      items: [
        { title: "Phim", url: "/admin/movie" },
        { title: "Thể loại", url: "/admin/category" },
        { title: "Diễn viên", url: "/admin/actor" },
      ],
    },
    {
      title: "Quản lý rạp",
      url: "#",
      icon: IconBuildingCommunity,
      items: [
        { title: "Rạp", url: "/admin/cinema" },
        { title: "Phòng chiếu ", url: "/admin/room" },
        { title: "Định dạng phòng", url: "/admin/formatRoom" },
        { title: "Sơ đồ ghế", url: "/admin/seat" },
        { title: "Loại ghế", url: "/admin/seatType" },
      ],
    },
    {
      title: "Quản lý suất chiếu",
      url: "#",
      icon: IconCalendarEvent,
      items: [
        { title: "Suất chiếu", url: "/admin/showtime" },
        { title: "Suất chiếu theo phòng", url: "/admin/showtimeGroupByRoom" },
        { title: "Khung giờ", url: "/admin/timeSlot" },
      ],
    },
    {
      title: "Quản lý vé",
      url: "#",
      icon: IconTicket,
      items: [
        { title: "Hóa đơn thanh toán", url: "/admin/booking" },
        { title: "Giá vé", url: "/admin/ticketPrice" },
      ],
    },
    {
      title: "Quản lý voucher",
      url: "/admin/voucher",
      icon: IconTicketOff,
    },
    {
      title: "Quản lý bài viết",
      url: "/admin/blog",
      icon: IconFileDescription,
    },
    {
      title: "Quản lý đồ ăn",
      url: "/admin/food",
      icon: IconCarrot,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Cài đặt trang web",
      url: "/admin/setting",
      icon: IconSettings,
    },
    {
      title: "Tài khoản của tôi",
      url: "/admin/profile",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const logoutMutation = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/");
      router.refresh();
      toast.success("Đã đăng xuất");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Sidebar className="" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <Avatar>
                  <AvatarImage
                    src="https://henruysun2511.github.io/BingeBox_Project/assets/images/bingebox_logo.png"
                    alt="logo.png"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">BingeBox Cinema</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
         <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
       <Button className="w-full btn-delete" onClick={handleLogout}><IconHelp className="me-2" />Đăng xuất</Button>
      </SidebarFooter>
    </Sidebar>
  )
}
