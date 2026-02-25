"use client";
import ActorList from "@/components/client/actor/actor-list";
import SectionTitle from "@/components/common/title/section-title";

export default function ActorPage() {

    return (
        <>
            <div className="!max-w-[1400px] mx-auto px-10 py-20">

                <SectionTitle title="Danh sách diễn viên" />
                <ActorList />
            </div>

        </>
    );
}