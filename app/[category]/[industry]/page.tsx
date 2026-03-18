import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAgentsByCategoryAndIndustry } from "@/lib/supabase";
import {
  PRIMARY_CATEGORIES,
  INDUSTRY_TAGS,
  CATEGORY_SLUGS,
  INDUSTRY_SLUGS
} from "@/lib/taxonomy";
import { getCategoryFromSlug, getIndustryFromSlug } from "@/lib/utils";
import { AgentCard } from "@/components/AgentCard";
import { FilterPills } from "@/components/FilterPills";

export const revalidate = 3600;

type Props = {
  params: {
    category: string;
    industry: string;
  };
};

export default async function CategoryIndustryPage({ params }: Props) {
  const categoryLabel = getCategoryFromSlug(params.category);
  const industryLabel = getIndustryFromSlug(params.industry);

  if (!categoryLabel || !industryLabel) {
    notFound();
  }

  const agents = await fetchAgentsByCategoryAndIndustry(
    params.category,
    industryLabel
  );

  return (
    <div className="space-y-6">
      <nav className="text-xs text-gray-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link
          href={`/${params.category}`}
          className="hover:underline"
        >
          {categoryLabel}
        </Link>{" "}
        / <span>{industryLabel}</span>
      </nav>

      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          {categoryLabel} for {industryLabel}
        </h1>
        <p className="text-sm text-gray-600">
          {agents.length} agent{agents.length === 1 ? "" : "s"}
        </p>
      </div>

      <FilterPills
        categorySlug={params.category}
        industries={INDUSTRY_TAGS as unknown as string[]}
        activeIndustrySlug={params.industry}
      />

      {agents.length === 0 ? (
        <p className="text-sm text-gray-500">
          No agents found for this category and industry yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const params: { category: string; industry: string }[] = [];

  for (const category of PRIMARY_CATEGORIES) {
    const categorySlug = CATEGORY_SLUGS[category];
    for (const industry of INDUSTRY_TAGS) {
      const industrySlug = INDUSTRY_SLUGS[industry];
      params.push({ category: categorySlug, industry: industrySlug });
    }
  }

  return params;
}

