import type { MergedData } from "./github/types";

const CACHE_KEY = "github-merged-data";
const CACHE_TTL_SECONDS = 6 * 60 * 60;
const STALE_TTL_SECONDS = 24 * 60 * 60;

interface CacheEntry {
  data: MergedData;
  cachedAt: number;
}

async function getCachedData(
  kv: KVNamespace,
): Promise<{ data: MergedData; isStale: boolean } | null> {
  const raw = await kv.get(CACHE_KEY, "text");
  if (!raw) return null;

  const entry = JSON.parse(raw) as CacheEntry;
  const age = Date.now() - entry.cachedAt;
  const isStale = age > CACHE_TTL_SECONDS * 1000;

  if (age > STALE_TTL_SECONDS * 1000) {
    return null;
  }

  return { data: entry.data, isStale };
}

async function setCachedData(
  kv: KVNamespace,
  data: MergedData,
): Promise<void> {
  const entry: CacheEntry = {
    data,
    cachedAt: Date.now(),
  };

  await kv.put(CACHE_KEY, JSON.stringify(entry), {
    expirationTtl: STALE_TTL_SECONDS,
  });
}

export { getCachedData, setCachedData };
