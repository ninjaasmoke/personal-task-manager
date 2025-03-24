"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Globe } from "lucide-react";
import {
  normalizeUrl,
  fetchUrlMetadata,
  type MetadataResponse,
} from "@/lib/link-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ensure URL is properly formatted for href
  const hrefUrl = url.startsWith("http") ? url : `https://${url}`;

  // Get display URL (without protocol)
  const displayUrl = normalizeUrl(url);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchUrlMetadata(hrefUrl);
        setMetadata(data);
      } catch (err) {
        setError("Failed to load link preview");
        console.error("Error loading link preview:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, [hrefUrl]);

  return (
    <a
      href={hrefUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block no-underline hover:no-underline"
    >
      <Card className="overflow-hidden hover:bg-muted/50 transition-colors p-1">
        <CardContent className="p-1">
          {isLoading ? (
            <LinkPreviewSkeleton />
          ) : error ? (
            <LinkPreviewFallback url={url} displayUrl={displayUrl} />
          ) : metadata ? (
            <LinkPreviewContent metadata={metadata} displayUrl={displayUrl} />
          ) : (
            <LinkPreviewFallback url={url} displayUrl={displayUrl} />
          )}
        </CardContent>
      </Card>
    </a>
  );
}

function LinkPreviewSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-16 w-16 flex-shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function LinkPreviewFallback({
  url,
  displayUrl,
}: {
  url: string;
  displayUrl: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 bg-primary/10 p-1 rounded-md">
        <Globe className="h-4 w-4 text-primary" />
      </div>
      <div className="overflow-hidden">
        <p className="text-sm font-medium truncate">{displayUrl}</p>
        <p className="text-xs text-muted-foreground">Click to open link</p>
      </div>
    </div>
  );
}

function LinkPreviewContent({
  metadata,
  displayUrl,
}: {
  metadata: MetadataResponse;
  displayUrl: string;
}) {
  return (
    <div className="flex gap-2 items-center">
      {metadata.image ? (
        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          <Image
            src={metadata.image || "/placeholder.svg"}
            alt={metadata.title || displayUrl}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Globe className="h-8 w-8 text-primary" />
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium line-clamp-1">{metadata.title}</p>
        {metadata.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {metadata.description}
          </p>
        )}
        <div className="flex items-center gap-1 mt-1">
          <p className="text-xs text-[gray] truncate">{displayUrl}</p>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
