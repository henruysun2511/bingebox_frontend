"use client";
import Header from "@/components/client/header/header";
import { useGetSettings } from "@/queries/useSettingQuery";
import { ReactNode } from "react";


export default function ClientLayout({ children }: { children: ReactNode }) {
    // Gọi ở đây để Header và con cái sử dụng chung Cache
    const { data: settings } = useGetSettings();

    return (
        <>
            <Header logo={settings?.logo ? settings?.logo : ""} /> 
            <div className="bg-gradient mt-21">
                {children}
            </div>
            {/* <Footer settings={settings} /> */}
        </>
    );
}