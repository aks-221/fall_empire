import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSignedAssetUrl } from "@/lib/platform-assets.functions";

/**
 * Renders an image whose source may be:
 *  - an external URL (http/https) → used as-is
 *  - a signed:// path → fetched as a signed URL, auto-renewed every 50 min
 *  - empty / null → renders nothing (or fallback)
 */
export function SignedImage({
  src,
  alt,
  className,
  fallback,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: string;
}) {
  const fn = useServerFn(getSignedAssetUrl);
  const [resolved, setResolved] = useState<string | null>(null);

  useEffect(() => {
    if (!src) { setResolved(fallback ?? null); return; }
    if (!src.startsWith("signed://")) { setResolved(src); return; }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const load = async () => {
      try {
        const { url } = await fn({ data: { path: src, expiresIn: 3600 } });
        if (!cancelled) {
          setResolved(url);
          timer = setTimeout(load, 50 * 60 * 1000); // refresh 10 min before expiry
        }
      } catch {
        if (!cancelled) setResolved(fallback ?? null);
      }
    };
    load();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [src, fallback, fn]);

  if (!resolved) return null;
  return <img src={resolved} alt={alt} className={className} loading="lazy" />;
}
