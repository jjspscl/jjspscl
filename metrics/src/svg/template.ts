import type { Theme } from "./themes";

const FONT_FAMILY =
  "'Segoe UI', Ubuntu, 'Helvetica Neue', Sans-Serif";

function svgCard(
  width: number,
  height: number,
  theme: Theme,
  content: string,
): string {
  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  fill="none"
  role="img"
  aria-label="GitHub Stats"
>
  <style>
    .title { font: 600 18px ${FONT_FAMILY}; fill: ${theme.colors.title}; }
    .stat-label { font: 400 14px ${FONT_FAMILY}; fill: ${theme.colors.text}; }
    .stat-value { font: 700 14px ${FONT_FAMILY}; fill: ${theme.colors.text}; }
    .stat-value-accent { font: 700 14px ${FONT_FAMILY}; fill: ${theme.colors.accent}; }
    .subtext { font: 400 12px ${FONT_FAMILY}; fill: ${theme.colors.subtext}; }
    .lang-name { font: 400 12px ${FONT_FAMILY}; fill: ${theme.colors.text}; }
    .lang-pct { font: 600 12px ${FONT_FAMILY}; fill: ${theme.colors.subtext}; }
    .streak-num { font: 700 28px ${FONT_FAMILY}; fill: ${theme.colors.accent}; }
    .streak-label { font: 400 12px ${FONT_FAMILY}; fill: ${theme.colors.text}; }
    .streak-date { font: 400 10px ${FONT_FAMILY}; fill: ${theme.colors.subtext}; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate { animation: fadeIn 0.3s ease-in-out forwards; opacity: 0; }
  </style>
  <rect
    x="0.5"
    y="0.5"
    width="${width - 1}"
    height="${height - 1}"
    rx="4.5"
    fill="${theme.colors.cardBackground}"
    stroke="${theme.colors.border}"
    stroke-opacity="1"
  />
  ${content}
</svg>`;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`;
  }
  return num.toString();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00Z");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export { escapeXml, FONT_FAMILY, formatDate, formatNumber, svgCard };
