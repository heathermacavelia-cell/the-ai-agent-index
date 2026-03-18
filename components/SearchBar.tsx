"use client";

import { ChangeEvent } from "react";

type Props = {
  query: string;
  onChange: (value: string) => void;
};

export function SearchBar({ query, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-gray-700">
        Search agents
      </label>
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search by name, developer, or description..."
        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

