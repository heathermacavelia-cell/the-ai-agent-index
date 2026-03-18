import Link from "next/link";
import { getIndustrySlug } from "@/lib/utils";

type Props = {
  categorySlug: string;
  industries: string[];
  activeIndustrySlug?: string;
};

export function FilterPills({
  categorySlug,
  industries,
  activeIndustrySlug
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/${categorySlug}`}
        className={`rounded-full px-3 py-1 text-xs ${
          !activeIndustrySlug
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All industries
      </Link>
      {industries.map((industry) => {
        const slug = getIndustrySlug(industry);
        const isActive = slug === activeIndustrySlug;
        return (
          <Link
            key={industry}
            href={`/${categorySlug}/${slug}`}
            className={`rounded-full px-3 py-1 text-xs ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {industry}
          </Link>
        );
      })}
    </div>
  );
}

