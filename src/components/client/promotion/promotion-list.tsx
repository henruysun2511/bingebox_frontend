import PromotionCard from "./promotion-card";


interface PromotionListProps {
  title: string;
  promotions: string[];
}

export default function PromotionList({ title, promotions }: PromotionListProps) {
  return (
    <div>
      <h2 className="text-[25px] text-white pl-[6px] mb-[15px]">
        {title}
      </h2>

      <div className="flex flex-wrap">
        {promotions.map((image, index) => (
          <PromotionCard key={index} image={image} />
        ))}
      </div>
    </div>
  );
}