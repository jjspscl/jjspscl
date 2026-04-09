import type { MergedStats } from "../github/types";
import type { Theme } from "../svg/themes";
import { renderIcon } from "../svg/icons";
import type { IconName } from "../svg/icons";
import { formatNumber, svgCard } from "../svg/template";

const CARD_WIDTH = 495;
const CARD_HEIGHT = 195;
const PADDING_X = 25;
const TITLE_Y = 35;
const START_Y = 60;
const ROW_HEIGHT = 25;

interface StatRow {
  icon: IconName;
  label: string;
  value: number;
}

function renderStatsCard(stats: MergedStats, theme: Theme): string {
  const rows: StatRow[] = [
    { icon: "star", label: "Total Stars Earned", value: stats.totalStars },
    { icon: "commit", label: "Total Commits", value: stats.totalCommits },
    { icon: "pr", label: "Total PRs", value: stats.totalPRs },
    { icon: "issue", label: "Total Issues", value: stats.totalIssues },
    { icon: "repo", label: "Contributed to", value: stats.contributedTo },
  ];

  const leftColumn = rows.slice(0, 3);
  const rightColumn = rows.slice(3);

  let content = `<text x="${PADDING_X}" y="${TITLE_Y}" class="title">GitHub Stats</text>`;

  leftColumn.forEach((row, i) => {
    const y = START_Y + i * ROW_HEIGHT;
    const delay = i * 150;
    content += `
      <g class="animate" style="animation-delay: ${delay}ms">
        ${renderIcon(row.icon, PADDING_X, y - 1, 16, theme.colors.icon)}
        <text x="${PADDING_X + 24}" y="${y + 12}" class="stat-label">${row.label}:</text>
        <text x="220" y="${y + 12}" class="stat-value-accent">${formatNumber(row.value)}</text>
      </g>`;
  });

  const rightX = 270;
  rightColumn.forEach((row, i) => {
    const y = START_Y + i * ROW_HEIGHT;
    const delay = (i + 3) * 150;
    content += `
      <g class="animate" style="animation-delay: ${delay}ms">
        ${renderIcon(row.icon, rightX, y - 1, 16, theme.colors.icon)}
        <text x="${rightX + 24}" y="${y + 12}" class="stat-label">${row.label}:</text>
        <text x="${CARD_WIDTH - PADDING_X}" y="${y + 12}" class="stat-value-accent" text-anchor="end">${formatNumber(row.value)}</text>
      </g>`;
  });

  const rankY = START_Y + 2 * ROW_HEIGHT;
  const rank = calculateRank(stats);
  content += `
    <g class="animate" style="animation-delay: 750ms" transform="translate(${rightX + 70}, ${rankY + 15})">
      <circle cx="0" cy="0" r="30" fill="none" stroke="${theme.colors.accent}" stroke-width="2.5" stroke-opacity="0.3"/>
      <circle cx="0" cy="0" r="30" fill="none" stroke="${theme.colors.accent}" stroke-width="2.5"
        stroke-dasharray="${2 * Math.PI * 30}"
        stroke-dashoffset="${2 * Math.PI * 30 * (1 - rank.percentile / 100)}"
        transform="rotate(-90)"
        stroke-linecap="round"/>
      <text x="0" y="5" text-anchor="middle" class="stat-value-accent" style="font-size: 18px; font-weight: 800">${rank.label}</text>
    </g>`;

  return svgCard(CARD_WIDTH, CARD_HEIGHT, theme, content);
}

interface RankResult {
  label: string;
  percentile: number;
}

function calculateRank(stats: MergedStats): RankResult {
  const score =
    stats.totalCommits * 1 +
    stats.totalPRs * 3 +
    stats.totalIssues * 2 +
    stats.totalReviews * 2 +
    stats.totalStars * 4 +
    stats.followers * 1;

  if (score >= 5000) return { label: "S+", percentile: 99 };
  if (score >= 2000) return { label: "S", percentile: 95 };
  if (score >= 1000) return { label: "A+", percentile: 85 };
  if (score >= 500) return { label: "A", percentile: 70 };
  if (score >= 200) return { label: "B+", percentile: 55 };
  if (score >= 100) return { label: "B", percentile: 40 };
  return { label: "C", percentile: 25 };
}

export { renderStatsCard };
