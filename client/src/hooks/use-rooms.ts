import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useRooms() {
  return useQuery({
    queryKey: [api.rooms.list.path],
    queryFn: async () => {
      const res = await fetch(api.rooms.list.path);
      if (!res.ok) throw new Error("Failed to fetch rooms");
      return api.rooms.list.responses[200].parse(await res.json());
    },
  });
}

export function useRoom(slug: string) {
  return useQuery({
    queryKey: [api.rooms.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.rooms.get.path, { slug });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch room");
      return api.rooms.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}
