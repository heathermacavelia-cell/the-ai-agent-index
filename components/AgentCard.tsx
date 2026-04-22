'use client'
import Link from "next/link";
import { Agent } from "@/types/agent";
import { getCategorySlug } from "@/lib/utils";
import CompareCardButton from "./CompareCardButton";

type Props = {
  agent: Agent;
};

export function AgentCard({ agent }: Props) {
  const categorySlug = getCategorySlug(agent.primary_category);
  const topCapabilities = (agent.capability_tags ?? []).slice(0, 3);
  return (
    <article className="group flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              <Link href={`/agents/${agent.slug}`} className="hover:underline">
                {agent.name}
              </Link>
            </h3>
            <p className="text-xs text-gray-500">{agent.developer}</p>
          </div>
          {agent.is_featured && (
            <span className="rounded-full border border-accent/30 bg-accent/5 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-accent">
              Featured
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 line-clamp-3">
          {agent.short_description}
        </p>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-[0.7rem] text-gray-600">
          <span className="rounded-full bg-gray-100 px-2 py-0.5">
            {agent.pricing_model}
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5">
            {agent.customer_segment}
          </span>
          <Link
            href={`/${categorySlug}`}
            className="rounded-full bg-blue-50 px-2 py-0.5 text-accent"
          >
            {agent.primary_category}
          </Link>
        </div>
        {topCapabilities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {topCapabilities.map((cap) => (
              <span
                key={cap}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.7rem] text-gray-700"
              >
                {cap}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
          <CompareCardButton
            slug={agent.slug}
            name={agent.name}
            websiteUrl={agent.website_url}
            faviconDomain={agent.favicon_domain}
          />
        </div>
      </div>
    </article>
  );
}