import { notFound } from "next/navigation";
import { fetchAgentsByCategory } from "@/lib/supabase";
import {
  PRIMARY_CATEGORIES,
  INDUSTRY_TAGS,
  CATEGORY_SLUGS
} from "@/lib/taxonomy";
import { getCategoryFromSlug } from "@/lib/utils";
import { AgentCard } from "@/components/AgentCard";
import { FilterPills } from "@/components/FilterPills";

export const revalidate = 3600;

type Props = {
  params: {
    category: string;
  };
};

export default async function CategoryPage({ params }: Props) {
  const categoryLabel = getCategoryFromSlug(params.category);
  if (!categoryLabel) {
    notFound();
  }

  const agents = await fetchAgentsByCategory(categoryLabel);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          {categoryLabel}
        </h1>
        <p className="text-sm text-gray-600">
          {agents.length} agent{agents.length === 1 ? "" : "s"}
        </p>
      </div>

      <FilterPills
        categorySlug={params.category}
        industries={INDUSTRY_TAGS as unknown as string[]}
      />

      {agents.length === 0 ? (
        <p className="text-sm text-gray-500">
          No agents found in this category yet.
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
  return PRIMARY_CATEGORIES.map((category) => ({
    category: CATEGORY_SLUGS[category]
  }));
}

