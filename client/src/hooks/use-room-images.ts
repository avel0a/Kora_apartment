import { useQuery } from "@tanstack/react-query";
import type { RoomImage } from "@shared/schema";

export function useRoomImages(roomId: number | undefined) {
  return useQuery<RoomImage[]>({
    queryKey: ["/api/rooms", roomId, "images"],
    queryFn: async () => {
      const res = await fetch(`/api/rooms/${roomId}/images`);
      if (!res.ok) throw new Error("Failed to fetch room images");
      return res.json();
    },
    enabled: !!roomId,
  });
}
