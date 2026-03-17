import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type SettingsMap = Record<string, { value: string; label: string; type: string }>;

export function useSettings() {
  return useQuery<SettingsMap>({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Record<string, string>) => {
      const res = await apiRequest("PATCH", "/api/settings", updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });
}

/** Helper to get a setting value with a fallback */
export function getSetting(settings: SettingsMap | undefined, key: string, fallback: string = ""): string {
  return settings?.[key]?.value ?? fallback;
}
