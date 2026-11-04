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
    <div className="cp-fpills">
      <Link href={`/${categorySlug}`} className={"cp-ipill" + (!activeIndustrySlug ? " cp-ipill-on" : "")}>
        All industries
      </Link>
      {industries.map((industry) => {
        const slug = getIndustrySlug(industry);
        return (
          <Link key={industry} href={`/${categorySlug}/${slug}`} className={"cp-ipill" + (slug === activeIndustrySlug ? " cp-ipill-on" : "")}>
            {industry}
          </Link>
        );
      })}
    </div>
  );
}
