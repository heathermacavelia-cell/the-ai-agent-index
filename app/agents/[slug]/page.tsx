import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchAgentBySlug } from "@/lib/supabase";

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = await fetchAgentBySlug(params.slug);
  if (!agent) return {};

  return {
    title: agent.name,
    description: agent.short_description
  };
}

export default async function AgentPage({ params }: Props) {
  const agent = await fetchAgentBySlug(params.slug);
  if (!agent) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: agent.name,
    description: agent.short_description,
    applicationCategory: agent.primary_category,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: agent.starting_price ?? 0,
      priceCurrency: "USD"
    },
    url: agent.website_url ?? undefined
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">{agent.name}</h1>
        <p className="text-sm text-gray-600">
          {agent.developer} · {agent.primary_category}
        </p>
        <p className="max-w-2xl text-sm text-gray-700">
          {agent.short_description}
        </p>
        {agent.website_url && (
          <a
            href={agent.website_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Visit website
            <span aria-hidden>↗</span>
          </a>
        )}
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {agent.long_description && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Overview
              </h2>
              <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                {agent.long_description}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Capabilities
            </h2>
            {agent.capability_tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {agent.capability_tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.7rem] text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                No capabilities listed.
              </p>
            )}
          </div>

          {agent.supported_workflows?.length ? (
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Supported workflows
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {agent.supported_workflows.map((wf) => (
                  <li key={wf}>{wf}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Commercial
            </h2>
            <dl className="mt-2 space-y-1">
              <div className="flex justify-between gap-2">
                <dt className="text-gray-600">Pricing model</dt>
                <dd className="font-medium">{agent.pricing_model}</dd>
              </div>
              {agent.starting_price !== null && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-600">Starting price</dt>
                  <dd className="font-medium">
                    ${agent.starting_price.toString()}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="text-gray-600">Customer segment</dt>
                <dd className="font-medium">{agent.customer_segment}</dd>
              </div>
              {agent.pricing_url && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-600">Pricing details</dt>
                  <dd>
                    <a
                      href={agent.pricing_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      View
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Deployment
            </h2>
            <dl className="mt-2 space-y-1">
              {agent.deployment_method?.length ? (
                <div className="flex flex-wrap gap-1">
                  {agent.deployment_method.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.7rem]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No deployment methods listed.
                </p>
              )}
              {agent.deployment_difficulty && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-600">Difficulty</dt>
                  <dd className="font-medium">
                    {agent.deployment_difficulty}
                  </dd>
                </div>
              )}
              {agent.avg_setup_time && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-600">Avg. setup time</dt>
                  <dd className="font-medium">{agent.avg_setup_time}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Technical
            </h2>
            <dl className="mt-2 space-y-1">
              {agent.model_architecture && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-600">Model architecture</dt>
                  <dd className="font-medium">{agent.model_architecture}</dd>
                </div>
              )}
              {agent.response_accuracy !== null && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-600">Response accuracy</dt>
                  <dd className="font-medium">
                    {agent.response_accuracy.toString()}
                  </dd>
                </div>
              )}
              {agent.integrations?.length ? (
                <div>
                  <dt className="text-gray-600">Integrations</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {agent.integrations.map((i) => (
                      <span
                        key={i}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.7rem]"
                      >
                        {i}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
              {agent.supported_languages?.length ? (
                <div>
                  <dt className="text-gray-600">Languages</dt>
                  <dd className="mt-1 flex flex-wrap gap-1">
                    {agent.supported_languages.map((l) => (
                      <span
                        key={l}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.7rem]"
                      >
                        {l}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {agent.security_certifications?.length ? (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Security
              </h2>
              <div className="mt-2 flex flex-wrap gap-1">
                {agent.security_certifications.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.7rem]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}

