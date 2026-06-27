import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getSitemapData } from "@/lib/public-stats.functions";

// TODO: replace once a project URL is set.
const BASE_URL = "";

interface SitemapEntry { path: string; lastmod?: string; changefreq?: string; priority?: string; }

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let dyn = { platform_slugs: [] as string[], article_slugs: [] as { slug: string; published_at: string | null }[] };
        try { dyn = await getSitemapData({ data: {} }); } catch { /* keep defaults */ }

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/a-propos", changefreq: "monthly", priority: "0.8" },
          { path: "/services", changefreq: "monthly", priority: "0.8" },
          { path: "/applications", changefreq: "weekly", priority: "0.9" },
          { path: "/investissement", changefreq: "monthly", priority: "0.7" },
          { path: "/donnees-brvm", changefreq: "weekly", priority: "0.6" },
          { path: "/actualites", changefreq: "weekly", priority: "0.7" },
          { path: "/contact", changefreq: "yearly", priority: "0.6" },
          { path: "/mentions-legales", changefreq: "yearly", priority: "0.3" },
          { path: "/confidentialite", changefreq: "yearly", priority: "0.3" },
          { path: "/cgu", changefreq: "yearly", priority: "0.3" },
          ...dyn.platform_slugs.map((slug) => ({ path: `/applications/${slug}`, changefreq: "monthly", priority: "0.7" })),
          ...dyn.article_slugs.map((a) => ({ path: `/actualites/${a.slug}`, lastmod: a.published_at ?? undefined, changefreq: "monthly", priority: "0.6" })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n")
        ).join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=600" } });
      },
    },
  },
});
