import { useQuery } from "@tanstack/react-query";
import type { GalleryImage } from "@shared/schema";

export function useGalleryImages() {
  return useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery images");
      return res.json();
    },
  });
}
