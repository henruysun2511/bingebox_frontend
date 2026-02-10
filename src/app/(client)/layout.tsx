import Header from "@/components/client/header/header";
import { ReactNode } from "react";

export default function ClientLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            <Header />
            <div className="bg-gradient mt-20">
                {children}
            </div>

        </>
    );
}