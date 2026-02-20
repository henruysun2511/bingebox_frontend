"use client";
import Footer from "@/components/client/footer/footer";
import Header from "@/components/client/header/header";
import { useGetSettings } from "@/queries/useSettingQuery";
import { ReactNode } from "react";


export default function ClientLayout({ children }: { children: ReactNode }) {
    const { data: settings, isLoading } = useGetSettings();


    if (isLoading) return null; 

    return (
        <>
            <Header logo={settings?.logo || ""} /> 
            <div className="bg-gradient mt-5 overflow-x-hidden">
                {children}
            </div>
            {settings && <Footer settings={settings} />}
        </>
    );
}