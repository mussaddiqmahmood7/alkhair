import { useQuery } from "@tanstack/react-query"
import type { SiteSettings } from "@/lib/site-settings"

async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch("/api/settings")
  if (!res.ok) {
    throw new Error("Failed to fetch settings")
  }
  const data = await res.json()
  return data.settings
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: 30 * 1000, // 30 seconds
  })
}

