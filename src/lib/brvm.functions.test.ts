import { describe, it, expect, vi } from "vitest";
import { computeBrvmSnapshot, SENEGAL_LISTINGS, BRVM_REFERENCE_URL } from "@/lib/brvm.functions";

describe("computeBrvmSnapshot", () => {
  it("returns fallback when fetch throws (BRVM unreachable)", async () => {
    const fakeFetch = vi.fn(async () => { throw new Error("network down"); }) as unknown as typeof fetch;
    const snap = await computeBrvmSnapshot(fakeFetch, () => new Date("2026-06-10T06:00:00Z"));
    expect(snap.source).toBe("fallback");
    expect(snap.message).toMatch(/indisponibles/i);
    expect(snap.fetched_at).toBe("2026-06-10T06:00:00.000Z");
    expect(snap.quotes).toHaveLength(SENEGAL_LISTINGS.length);
    expect(snap.quotes.every((q) => q.last === null)).toBe(true);
    expect(snap.reference_url).toBe(BRVM_REFERENCE_URL);
  });

  it("returns fallback on non-ok HTTP response (BRVM 500)", async () => {
    const fakeFetch = vi.fn(async () => new Response("oops", { status: 500 })) as unknown as typeof fetch;
    const snap = await computeBrvmSnapshot(fakeFetch);
    expect(snap.source).toBe("fallback");
  });

  it("returns live when BRVM site responds with 200", async () => {
    const fakeFetch = vi.fn(async () => new Response("<html></html>", { status: 200 })) as unknown as typeof fetch;
    const snap = await computeBrvmSnapshot(fakeFetch);
    expect(snap.source).toBe("live");
    expect(snap.message).toMatch(/joignable/i);
    expect(snap.quotes).toHaveLength(SENEGAL_LISTINGS.length);
  });

  it("hits BRVM official URL with a custom user-agent", async () => {
    const fakeFetch = vi.fn(async () => new Response("ok", { status: 200 })) as unknown as typeof fetch;
    await computeBrvmSnapshot(fakeFetch);
    expect(fakeFetch).toHaveBeenCalledWith(
      BRVM_REFERENCE_URL,
      expect.objectContaining({ headers: expect.objectContaining({ "User-Agent": expect.stringContaining("FallTrading") }) }),
    );
  });

  it("produces an ISO-8601 fetched_at timestamp on every call (for horodatage)", async () => {
    const fakeFetch = vi.fn(async () => new Response("ok", { status: 200 })) as unknown as typeof fetch;
    const snap = await computeBrvmSnapshot(fakeFetch);
    expect(snap.fetched_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it("lists Sonatel (SNTS) in the reference quotes", async () => {
    const fakeFetch = vi.fn(async () => { throw new Error("x"); }) as unknown as typeof fetch;
    const snap = await computeBrvmSnapshot(fakeFetch);
    expect(snap.quotes.find((q) => q.sym === "SNTS")?.name).toBe("Sonatel");
  });
});
