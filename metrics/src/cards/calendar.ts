import type { MergedCalendarDay } from "../github/types";
import type { Theme } from "../svg/themes";
import { FONT_FAMILY, svgCard } from "../svg/template";

const CELL_SIZE = 11;
const CELL_GAP = 3;
const CARD_PADDING = 25;
const TITLE_Y = 35;
const MONTH_LABELS_Y = 58;
const GRID_TOP = 68;
const DAY_LABEL_WIDTH = 30;

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

function renderCalendarCard(
  calendar: MergedCalendarDay[],
  theme: Theme,
): string {
  if (calendar.length === 0) {
    return svgCard(800, 160, theme, `
      <text x="400" y="90" text-anchor="middle" class="subtext">No contribution data</text>
    `);
  }

  const weeks: MergedCalendarDay[][] = [];
  let currentWeek: MergedCalendarDay[] = [];

  const firstDate = new Date(calendar[0]!.date + "T00:00:00Z");
  const firstDayOfWeek = firstDate.getUTCDay();

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: "", count: 0, level: 0 });
  }

  for (const day of calendar) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const gridLeft = CARD_PADDING + DAY_LABEL_WIDTH;
  const gridWidth = weeks.length * (CELL_SIZE + CELL_GAP);
  const gridHeight = 7 * (CELL_SIZE + CELL_GAP);
  const cardWidth = Math.max(gridLeft + gridWidth + CARD_PADDING, 720);
  const cardHeight = GRID_TOP + gridHeight + 30;

  const totalContributions = calendar.reduce((sum, d) => sum + d.count, 0);

  let cells = "";
  for (let w = 0; w < weeks.length; w++) {
    const week = weeks[w]!;
    for (let d = 0; d < week.length; d++) {
      const day = week[d]!;
      if (!day.date) continue;

      const x = gridLeft + w * (CELL_SIZE + CELL_GAP);
      const y = GRID_TOP + d * (CELL_SIZE + CELL_GAP);
      const color = theme.colors.calendar[day.level] ?? theme.colors.calendar[0]!;

      cells += `<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="2" fill="${color}"><title>${day.date}: ${day.count} contributions</title></rect>`;
    }
  }

  let dayLabels = "";
  for (let d = 0; d < 7; d++) {
    const label = DAY_LABELS[d];
    if (!label) continue;
    const y = GRID_TOP + d * (CELL_SIZE + CELL_GAP) + CELL_SIZE - 1;
    dayLabels += `<text x="${CARD_PADDING + DAY_LABEL_WIDTH - 6}" y="${y}" text-anchor="end" fill="${theme.colors.subtext}" font-family="${FONT_FAMILY}" font-size="10">${label}</text>`;
  }

  let monthLabels = "";
  const seenMonths = new Set<string>();

  for (let w = 0; w < weeks.length; w++) {
    const firstDay = weeks[w]!.find((d) => d.date);
    if (!firstDay?.date) continue;
    const month = firstDay.date.slice(5, 7);
    if (!seenMonths.has(month)) {
      seenMonths.add(month);
      const x = gridLeft + w * (CELL_SIZE + CELL_GAP);
      const monthIdx = parseInt(month, 10) - 1;
      monthLabels += `<text x="${x}" y="${MONTH_LABELS_Y}" fill="${theme.colors.subtext}" font-family="${FONT_FAMILY}" font-size="10">${MONTHS[monthIdx]}</text>`;
    }
  }

  let legendX = cardWidth - CARD_PADDING - 120;
  const legendY = cardHeight - 14;
  let legend = `<text x="${legendX - 5}" y="${legendY + 3}" fill="${theme.colors.subtext}" font-family="${FONT_FAMILY}" font-size="10" text-anchor="end">Less</text>`;

  for (let i = 0; i < 5; i++) {
    const color = theme.colors.calendar[i]!;
    legend += `<rect x="${legendX}" y="${legendY - 5}" width="10" height="10" rx="2" fill="${color}"/>`;
    legendX += 14;
  }
  legend += `<text x="${legendX + 2}" y="${legendY + 3}" fill="${theme.colors.subtext}" font-family="${FONT_FAMILY}" font-size="10">More</text>`;

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${cardWidth}"
  height="${cardHeight}"
  viewBox="0 0 ${cardWidth} ${cardHeight}"
  fill="none"
  role="img"
  aria-label="Contribution Calendar"
>
  <style>
    .title { font: 600 18px ${FONT_FAMILY}; fill: ${theme.colors.title}; }
    .subtext { font: 400 12px ${FONT_FAMILY}; fill: ${theme.colors.subtext}; }
  </style>
  <rect
    x="0.5"
    y="0.5"
    width="${cardWidth - 1}"
    height="${cardHeight - 1}"
    rx="4.5"
    fill="${theme.colors.cardBackground}"
    stroke="${theme.colors.border}"
    stroke-opacity="1"
  />
  <text x="${CARD_PADDING}" y="${TITLE_Y}" class="title">
    ${totalContributions.toLocaleString("en-US")} contributions in the last year
  </text>
  ${monthLabels}
  ${dayLabels}
  ${cells}
  ${legend}
</svg>`;
}

export { renderCalendarCard };
