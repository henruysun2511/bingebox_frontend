interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="my-10">
      <div className="flex items-center gap-4">
        {/* Thanh dọc */}
        <div className="w-2 h-10 bg-blue rounded-sm" />

        {/* Title */}
        <h2 className="text-white text-2xl font-semibold tracking-wide">
          {title}
        </h2>
      </div>
    </div>
  );
}