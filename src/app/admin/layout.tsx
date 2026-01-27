import { SiteHeader } from "@/components/admin/header/site-header";
import { AppSidebar } from "@/components/admin/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function AdminOverviewLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 65)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset"/>
                <SidebarInset className="bg-gradient">
                    <SiteHeader/>
                    <div className="p-10">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}