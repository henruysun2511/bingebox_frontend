import PromotionCard from "./promotion-card";


interface PromotionListProps {
  promotions: string[];
}

export default function PromotionList({ promotions }: PromotionListProps) {
  return (
    <div className="flex flex-wrap">
      {promotions.map((image, index) => (
        <PromotionCard key={index} image={image} />
      ))}
    </div>

  );
}