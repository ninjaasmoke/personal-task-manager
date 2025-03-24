import { type NextRequest, NextResponse } from "next/server";

// Type for metadata response
interface MetadataResponse {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export async function GET(request: NextRequest) {
  // Extract URL from query parameters
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  // Validate URL
  if (!targetUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    // Fetch the webpage
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "MetadataBot/1.0",
      },
    });

    // Check if fetch was successful
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch URL" },
        { status: 404 }
      );
    }

    // Parse HTML content
    const html = await response.text();

    // Basic metadata extraction (you might want to use a library like cheerio for more robust parsing)
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descriptionMatch = html.match(
      /<meta\s+name="description"\s+content="(.*?)"/i
    );
    const imageMatch = html.match(
      /<meta\s+property="og:image"\s+content="(.*?)"/i
    );

    // Construct metadata response
    const metadata: MetadataResponse = {
      url: targetUrl,
      title: titleMatch ? titleMatch[1] : undefined,
      description: descriptionMatch ? descriptionMatch[1] : undefined,
      image: imageMatch ? imageMatch[1] : undefined,
    };

    // Return metadata
    return NextResponse.json(metadata, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Handle POST requests if needed
export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
