import { useEffect } from "react";

const BASE_TITLE = "Kora Hotel Suites";

/**
 * Sets the document title for each page.
 * Usage: useSEO({ title: "Our Rooms & Suites", description: "..." })
 */
export function useSEO({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  useEffect(() => {
    // Update <title>
    document.title = title
      ? `${title} | ${BASE_TITLE}`
      : `${BASE_TITLE} | Luxury Serviced Apartments in Addis Ababa, Ethiopia`;

    // Update <meta name="description">
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      }
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = `${BASE_TITLE} | Luxury Serviced Apartments in Addis Ababa, Ethiopia`;
    };
  }, [title, description]);
}
