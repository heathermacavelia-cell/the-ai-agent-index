import { createClient } from "@supabase/supabase-js";
import { Agent } from "@/types/agent";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In development this helps surface misconfiguration early.
  // In production, Next.js will tree-shake this out if not used.
  console.warn(
    "Supabase env vars NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set."
  );
}

export const supabase = createClient<{
  agents: Agent;
}>(supabaseUrl ?? "", supabaseAnonKey ?? "");

export async function fetchAllAgents() {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching agents", error);
    throw error;
  }

  return data ?? [];
}

export async function fetchFeaturedAgents() {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching featured agents", error);
    throw error;
  }

  return data ?? [];
}

export async function fetchAgentsByCategory(category: string) {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("is_active", true)
    .eq("primary_category", category)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching agents by category", error);
    throw error;
  }

  return data ?? [];
}

export async function fetchAgentsByCategoryAndIndustry(
  category: string,
  industry: string
) {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("is_active", true)
    .eq("primary_category", category)
    .contains("industry_tags", [industry]);

  if (error) {
    console.error("Error fetching agents by category and industry", error);
    throw error;
  }

  return data ?? [];
}

export async function fetchAgentBySlug(slug: string) {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching agent by slug", error);
    throw error;
  }

  return data;
}

