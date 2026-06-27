import { createServerFn } from "@tanstack/react-start";

// Liste de référence — entreprises sénégalaises cotées à la BRVM (UEMOA).
// Source : https://www.brvm.org/fr/societes-cotees/liste
export const SENEGAL_LISTINGS = [
  { sym: "SNTS", name: "Sonatel", sector: "Télécommunications" },
  { sym: "BOAS", name: "Bank of Africa Sénégal", sector: "Finance · Banque" },
  { sym: "TTLS", name: "Total Sénégal", sector: "Énergie · Distribution" },
  { sym: "SDSC", name: "Sodisn / Distribution Sénégal", sector: "Distribution" },
  { sym: "ICCC", name: "SICC · Industries Chimiques", sector: "Industrie" },
  { sym: "CBIBF", name: "Crédit du Sénégal", sector: "Finance" },
];

export const BRVM_REFERENCE_URL = "https://www.brvm.org/fr/cours-actions/officiel";

export type BrvmQuote = {
  sym: string;
  name: string;
  sector: string;
  last: number | null;
  change_pct: number | null;
};

export type BrvmSnapshot = {
  source: "live" | "fallback";
  fetched_at: string;
  message: string;
  quotes: BrvmQuote[];
  reference_url: string;
};

// Pure, testable core. Inject a fetch implementation for unit tests.
export async function computeBrvmSnapshot(
  fetchImpl: typeof fetch = fetch,
  now: () => Date = () => new Date(),
): Promise<BrvmSnapshot> {
  const fallback: BrvmSnapshot = {
    source: "fallback",
    fetched_at: now().toISOString(),
    message: "Cotations en direct indisponibles — affichage de la liste de référence des sociétés sénégalaises cotées à la BRVM.",
    quotes: SENEGAL_LISTINGS.map((s) => ({ ...s, last: null, change_pct: null })),
    reference_url: BRVM_REFERENCE_URL,
  };

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetchImpl(BRVM_REFERENCE_URL, {
      signal: ctrl.signal,
      headers: { "User-Agent": "FallTradingBot/1.0" },
    });
    clearTimeout(t);
    if (!res.ok) return fallback;
    return {
      ...fallback,
      source: "live",
      message: "Source BRVM joignable. Les valeurs détaillées ne sont pas exposées en JSON public — consultez brvm.org pour les cours.",
    };
  } catch {
    return fallback;
  }
}

// Read latest persisted snapshot from DB (populated by pg_cron). Fallback to live compute.
export const getBrvmSnapshot = createServerFn({ method: "GET" })
  .inputValidator((data?: Record<string, never>) => data ?? {})
  .handler(async (): Promise<BrvmSnapshot> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("brvm_snapshots")
        .select("source, fetched_at, message, quotes, reference_url")
        .order("fetched_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        return {
          source: data.source as "live" | "fallback",
          fetched_at: data.fetched_at,
          message: data.message,
          quotes: (data.quotes as BrvmQuote[]) ?? [],
          reference_url: data.reference_url,
        };
      }
    } catch { /* fallthrough */ }
    return computeBrvmSnapshot();
  });

export type BrvmHistoryItem = {
  id: string;
  source: "live" | "fallback";
  fetched_at: string;
  message: string;
};

export const getBrvmHistory = createServerFn({ method: "GET" })
  .inputValidator((data?: { limit?: number }) => data ?? {})
  .handler(async ({ data }): Promise<BrvmHistoryItem[]> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const limit = Math.min(Math.max(data?.limit ?? 20, 1), 100);
      const { data: rows, error } = await supabaseAdmin
        .from("brvm_snapshots")
        .select("id, source, fetched_at, message")
        .order("fetched_at", { ascending: false })
        .limit(limit);
      if (error || !rows) return [];
      return rows.map((r) => ({
        id: r.id,
        source: r.source as "live" | "fallback",
        fetched_at: r.fetched_at,
        message: r.message,
      }));
    } catch {
      return [];
    }
  });
