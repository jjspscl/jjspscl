import { Hono } from "hono";
import type { MergedData } from "./github/types";
import type { AccountConfig } from "./github/aggregator";
import { fetchAndMerge } from "./github/aggregator";
import { getCachedData, setCachedData } from "./cache";
import { getTheme } from "./svg/themes";
import { escapeXml } from "./svg/template";
import { renderStatsCard } from "./cards/stats";
import { renderLanguagesCard } from "./cards/languages";
import { renderStreakCard } from "./cards/streak";
import { renderCalendarCard } from "./cards/calendar";

interface Bindings {
  STATS_CACHE: KVNamespace;
  GITHUB_TOKEN_PERSONAL: string;
  GITHUB_TOKEN_CORPORATE: string;
  GITHUB_USERNAME_PERSONAL: string;
  GITHUB_USERNAME_CORPORATE: string;
}

const app = new Hono<{ Bindings: Bindings }>();

let inflightPromise: Promise<MergedData> | null = null;

async function fetchFreshData(env: Bindings): Promise<MergedData> {
  const accounts: AccountConfig[] = [];

  if (env.GITHUB_TOKEN_PERSONAL && env.GITHUB_USERNAME_PERSONAL) {
    accounts.push({
      token: env.GITHUB_TOKEN_PERSONAL,
      username: env.GITHUB_USERNAME_PERSONAL,
    });
  }

  if (env.GITHUB_TOKEN_CORPORATE && env.GITHUB_USERNAME_CORPORATE) {
    accounts.push({
      token: env.GITHUB_TOKEN_CORPORATE,
      username: env.GITHUB_USERNAME_CORPORATE,
    });
  }

  if (accounts.length === 0) {
    throw new Error("No GitHub accounts configured");
  }

  const fresh = await fetchAndMerge(accounts);
  await setCachedData(env.STATS_CACHE, fresh);
  return fresh;
}

async function getData(env: Bindings): Promise<MergedData> {
  const cached = await getCachedData(env.STATS_CACHE);

  if (cached && !cached.isStale) {
    return cached.data;
  }

  if (inflightPromise) {
    return inflightPromise;
  }

  inflightPromise = fetchFreshData(env).finally(() => {
    inflightPromise = null;
  });

  try {
    return await inflightPromise;
  } catch (err) {
    if (cached) {
      console.error("Fetch failed, serving stale cache:", err);
      return cached.data;
    }
    throw err;
  }
}

const SVG_HEADERS = {
  "Content-Type": "image/svg+xml",
  "Cache-Control": "public, max-age=21600, stale-while-revalidate=86400",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
} as const;

function svgResponse(svg: string): Response {
  return new Response(svg, { headers: SVG_HEADERS });
}

function errorSvg(message: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="120" viewBox="0 0 495 120">
    <rect width="495" height="120" rx="4.5" fill="#161b22" stroke="#30363d"/>
    <text x="247" y="65" text-anchor="middle" fill="#f85149" font-family="'Segoe UI', Sans-Serif" font-size="14">${escapeXml(message)}</text>
  </svg>`;
}

app.get("/api/stats", async (c) => {
  try {
    const data = await getData(c.env);
    const theme = getTheme(c.req.query("theme"));
    return svgResponse(renderStatsCard(data.stats, theme));
  } catch {
    return svgResponse(errorSvg("Failed to load stats"));
  }
});

app.get("/api/languages", async (c) => {
  try {
    const data = await getData(c.env);
    const theme = getTheme(c.req.query("theme"));
    return svgResponse(renderLanguagesCard(data.languages, theme));
  } catch {
    return svgResponse(errorSvg("Failed to load languages"));
  }
});

app.get("/api/streak", async (c) => {
  try {
    const data = await getData(c.env);
    const theme = getTheme(c.req.query("theme"));
    return svgResponse(renderStreakCard(data.streak, theme));
  } catch {
    return svgResponse(errorSvg("Failed to load streak"));
  }
});

app.get("/api/calendar", async (c) => {
  try {
    const data = await getData(c.env);
    const theme = getTheme(c.req.query("theme"));
    return svgResponse(renderCalendarCard(data.calendar, theme));
  } catch {
    return svgResponse(errorSvg("Failed to load calendar"));
  }
});

app.get("/", (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Stats API — jjspscl</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0d1117; color: #c9d1d9; font-family: 'Segoe UI', sans-serif; padding: 2rem; max-width: 900px; margin: 0 auto; }
    h1 { color: #2ea043; margin-bottom: 0.5rem; }
    p.sub { color: #8b949e; margin-bottom: 2rem; }
    h2 { color: #58a6ff; margin: 1.5rem 0 0.5rem; font-size: 1.1rem; }
    code { background: #161b22; padding: 2px 8px; border-radius: 4px; font-size: 0.9rem; color: #79c0ff; }
    .endpoint { margin: 0.5rem 0; }
    a { color: #58a6ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .theme-list { color: #8b949e; font-size: 0.85rem; margin-top: 0.25rem; }
  </style>
</head>
<body>
  <h1>GitHub Stats API</h1>
  <p class="sub">Self-hosted GitHub metrics with merged dual-account stats, served as SVG cards.</p>

  <h2>Available Endpoints</h2>
  <div class="endpoint"><a href="/api/stats?theme=gotham"><code>GET /api/stats</code></a> — Profile stats card</div>
  <div class="endpoint"><a href="/api/languages?theme=gotham"><code>GET /api/languages</code></a> — Top languages breakdown</div>
  <div class="endpoint"><a href="/api/streak?theme=gotham"><code>GET /api/streak</code></a> — Contribution streak tracker</div>
  <div class="endpoint"><a href="/api/calendar?theme=gotham"><code>GET /api/calendar</code></a> — Isometric 3D contribution calendar</div>

  <h2>Query Parameters</h2>
  <div class="endpoint"><code>?theme=gotham</code></div>
  <p class="theme-list">Available themes: <code>gotham</code> (default), <code>dark</code>, <code>light</code></p>

  <h2>Usage in README</h2>
  <div class="endpoint"><code>![Stats](https://stats.jjspscl.com/api/stats?theme=gotham)</code></div>
</body>
</html>`;
  return c.html(html);
});

export default app;
