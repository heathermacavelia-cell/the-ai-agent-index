"use client";

import { useMemo, useState } from "react";
import { Agent } from "@/types/agent";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { AgentCard } from "@/components/AgentCard";

type CategoryCardData = {
  name: string;
  slug: string;
  count: number;
};

type Props = {
  featuredAgents: Agent[];
  allAgents: Agent[];
  categoryCards: CategoryCardData[];
};

export function HomeShell({
  featuredAgents,
  allAgents,
  categoryCards
}: Props) {
  const [search, setSearch] = useState("");

  const filteredAgents = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return allAgents;
    return allAgents.filter((agent) => {
      return (
        agent.name.toLowerCase().includes(q) ||
        agent.developer.toLowerCase().includes(q) ||
        agent.short_description.toLowerCase().includes(q)
      );
    });
  }, [allAgents, search]);

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            The AI Agent Index
          </h2>
          <p className="mt-1 max-w-xl text-sm text-gray-600">
            The structured index of AI agents for business automation. Search,
            filter, and compare agents across categories and industries.
          </p>
        </div>
        <SearchBar query={search} onChange={setSearch} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Categories by business function
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryCards.map((card) => (
            <CategoryCard
              key={card.slug}
              name={card.name}
              slug={card.slug}
              count={card.count}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Featured agents
          </h3>
          <p className="text-xs text-gray-500">
            Curated agents highlighted for performance, adoption, or coverage.
          </p>
        </div>
        {featuredAgents.length === 0 ? (
          <p className="text-sm text-gray-500">
            No featured agents yet. Mark agents as{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[0.7rem]">
              is_featured = true
            </code>{" "}
            in Supabase to show them here.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">
            All agents ({filteredAgents.length})
          </h3>
        </div>
        {filteredAgents.length === 0 ? (
          <p className="text-sm text-gray-500">
            No agents match this search yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

