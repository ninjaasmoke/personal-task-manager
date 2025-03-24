// Regular expression to match URLs
// This regex matches common URL patterns including http, https, ftp protocols
// as well as www. prefixed URLs
export const URL_REGEX = /(https?:\/\/|www\.)[^\s]+(\.[^\s]+)+/g;

// Function to extract URLs from text
export function extractUrls(text: string): string[] {
  if (!text) return [];

  const matches = text.match(URL_REGEX) || [];
  return matches.map((url) => {
    // Ensure URLs start with a protocol
    if (url.startsWith("www.")) {
      return `https://${url}`;
    }
    return url;
  });
}

// Function to normalize a URL for display
export function normalizeUrl(url: string): string {
  // Remove protocol and trailing slashes for display
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// Interface for metadata response from API
export interface MetadataResponse {
  url: string;
  title?: string;
  description?: string;
  image?: string | null;
  error?: string;
}

// Function to fetch metadata from a URL using our API route
export async function fetchUrlMetadata(url: string): Promise<MetadataResponse> {
  try {
    // Use our API route to fetch metadata
    const apiUrl = `/api/metadata?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    // If the API returned an error
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      url: url,
      title: data.title || normalizeUrl(url),
      description: data.description || "",
      image: data.image || null,
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    // Return basic metadata if fetch fails
    return {
      url: url,
      title: normalizeUrl(url),
      description: "",
      image: null,
    };
  }
}
