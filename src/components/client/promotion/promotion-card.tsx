import Image from "next/image";

interface PromotionCardProps {
  image: string;
}

export default function PromotionCard({ image }: PromotionCardProps) {
  return (
    <div className="w-[230px] h-[100px] m-[10px] mb-[14px] rounded-[15px] cursor-pointer overflow-hidden bg-blue-600">
      <div className="w-full h-full overflow-hidden rounded-[15px]">
        <Image
          src={image}
          alt="promotion"
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
    </div>
  );
}