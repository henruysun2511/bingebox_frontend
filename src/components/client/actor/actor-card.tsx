"use client";
import { Actor } from "@/types/object";
import Link from "next/link";

interface ActorCardProps {
    actor: Actor;
}

export default function ActorCard({ actor }: ActorCardProps) {
    return (
        <Link
            key={actor._id}
            className="flex flex-col items-center group cursor-pointer"
            href={`/actor/${actor._id}`}
        >
            {/* Avatar Circle */}
            <div className="w-[110px] h-[110px] rounded-full overflow-hidden shadow-lg border border-neutral-800 group-hover:scale-105 group-hover:border-blue-500/50 transition duration-300">
                <img
                    src={actor.avatar || "/avatar-fallback.png"}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Actor Name */}
            <div className="mt-3 text-sm text-center text-white/80 group-hover:text-white transition duration-200 line-clamp-1 w-[120px]">
                {actor.name || "N/A"}
            </div>
        </Link>
    );
}