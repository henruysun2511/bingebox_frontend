"use client";

import Carousel from "@/components/client/carousel/carousel";
import MovieComingSoonList from "@/components/client/movie/movie-comingsoon-list";
import MovieNowShowingList from "@/components/client/movie/movie-nowshowing-list";
import PromotionList from "@/components/client/promotion/promotion-list";
import SectionTitle from "@/components/common/title/section-title";
import { BaseStatusEnum } from "@/constants/enum";
import { useGetSettings } from "@/queries/useSettingQuery";

export default function Home() {
  const { data: setting, isLoading } = useGetSettings();
  console.log(setting);

  if (isLoading) return null;

  // Nếu banner là dạng string[]
  const activeBanners =
    setting?.banner?.filter(
      (item: any) => item?.isActive === BaseStatusEnum.ACTIVE
    ).map((item: any) => item?.image) || [];

  return (
    <>
      <Carousel images={activeBanners} />
      <div className="max-w-[1400px] mx-auto px-10 py-10">
        <div className="flex gap-10 items-start">

          {/* LEFT CONTENT */}
          <div className="flex-1">
            <SectionTitle title="Phim đang chiếu" />
            <MovieNowShowingList />

            <SectionTitle title="Phim sắp chiếu" />
            <MovieComingSoonList />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-[260px] shrink-0">
            <SectionTitle title="Khuyến mãi" />
            <PromotionList
              promotions={[
                "/images/promo1.jpg",
                "/images/promo2.jpg",
                "/images/promo3.jpg",
              ]}
            />
          </div>

        </div>
      </div>

    </>
  );
}
