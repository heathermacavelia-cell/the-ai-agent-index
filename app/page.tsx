import { fetchAllAgents, fetchFeaturedAgents, supabase } from "@/lib/supabase";
import { Agent } from "@/types/agent";
import { PRIMARY_CATEGORIES, CATEGORY_SLUGS } from "@/lib/taxonomy";
import { CategoryCard } from "@/components/CategoryCard";
import { HomeShell } from "@/components/HomeShell";

async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("agents")
    .select("primary_category")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching category counts", error);
    return {};
  }

  const counts: Record<string, number> = {};
  (data as Pick<Agent, "primary_category">[]).forEach((row) => {
    counts[row.primary_category] = (counts[row.primary_category] ?? 0) + 1;
  });
  return counts;
}

export default async function HomePage() {
  const [featuredAgents, allAgents, categoryCounts] = await Promise.all([
    fetchFeaturedAgents(),
    fetchAllAgents(),
    getCategoryCounts()
  ]);

  const categoryCards = PRIMARY_CATEGORIES.map((category) => ({
    name: category,
    slug: CATEGORY_SLUGS[category],
    count: categoryCounts[CATEGORY_SLUGS[category]] ?? 0
  }));

  return (
    <HomeShell
      featuredAgents={featuredAgents}
      allAgents={allAgents}
      categoryCards={categoryCards}
    />
  );
}


