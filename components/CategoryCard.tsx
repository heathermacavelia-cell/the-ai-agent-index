import Link from "next/link";

type Props = {
  name: string;
  slug: string;
  count: number;
};

export function CategoryCard({ name, slug, count }: Props) {
  return (
    <Link
      href={`/${slug}`}
      className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
    >
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
        <p className="mt-1 text-xs text-gray-600">
          {count} agent{count === 1 ? "" : "s"}
        </p>
      </div>
      <span className="mt-3 text-xs font-medium text-accent">View agents →</span>
    </Link>
  );
}

