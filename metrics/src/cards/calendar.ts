import type { MergedCalendarDay } from "../github/types";
import type { Theme } from "../svg/themes";
import { FONT_FAMILY } from "../svg/template";

const CELL_SIZE = 10;
const CELL_GAP = 2;
const ISO_ANGLE = Math.PI / 6;
const ISO_COS = Math.cos(ISO_ANGLE);
const ISO_SIN = Math.sin(ISO_ANGLE);

const MAX_BAR_HEIGHT = 30;

const CARD_PADDING = 25;
const TITLE_Y = 35;
const GRID_TOP = 55;
const MONTH_LABELS_HEIGHT = 15;

interface IsoPoint {
  x: number;
  y: number;
}

function toIso(gridX: number, gridY: number): IsoPoint {
  return {
    x: (gridX - gridY) * ISO_COS * (CELL_SIZE + CELL_GAP),
    y: (gridX + gridY) * ISO_SIN * (CELL_SIZE + CELL_GAP),
  };
}

function renderIsoCube(
  isoX: number,
  isoY: number,
  height: number,
  color: string,
  darkerColor: string,
  darkestColor: string,
): string {
  const s = CELL_SIZE;
  const h = height;

  const topFace = [
    `${isoX},${isoY - h}`,
    `${isoX + s * ISO_COS},${isoY - h + s * ISO_SIN}`,
    `${isoX},${isoY - h + s * ISO_SIN * 2}`,
    `${isoX - s * ISO_COS},${isoY - h + s * ISO_SIN}`,
  ].join(" ");

  const rightFace = [
    `${isoX},${isoY - h + s * ISO_SIN * 2}`,
    `${isoX + s * ISO_COS},${isoY - h + s * ISO_SIN}`,
    `${isoX + s * ISO_COS},${isoY + s * ISO_SIN}`,
    `${isoX},${isoY + s * ISO_SIN * 2}`,
  ].join(" ");

  const leftFace = [
    `${isoX},${isoY - h + s * ISO_SIN * 2}`,
    `${isoX - s * ISO_COS},${isoY - h + s * ISO_SIN}`,
    `${isoX - s * ISO_COS},${isoY + s * ISO_SIN}`,
    `${isoX},${isoY + s * ISO_SIN * 2}`,
  ].join(" ");

  return `<polygon points="${topFace}" fill="${color}" stroke="${color}" stroke-width="0.5"/>
<polygon points="${rightFace}" fill="${darkerColor}" stroke="${darkerColor}" stroke-width="0.5"/>
<polygon points="${leftFace}" fill="${darkestColor}" stroke="${darkestColor}" stroke-width="0.5"/>`;
}

function normalizeHex(hex: string): string {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

function darkenColor(hex: string, factor: number): string {
  const full = normalizeHex(hex);
  const r = Math.min(255, Math.max(0, Math.round(parseInt(full.slice(1, 3), 16) * factor)));
  const g = Math.min(255, Math.max(0, Math.round(parseInt(full.slice(3, 5), 16) * factor)));
  const b = Math.min(255, Math.max(0, Math.round(parseInt(full.slice(5, 7), 16) * factor)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function renderCalendarCard(
  calendar: MergedCalendarDay[],
  theme: Theme,
): string {
  if (calendar.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200">
      <rect width="800" height="200" rx="4.5" fill="${theme.colors.cardBackground}" stroke="${theme.colors.border}"/>
      <text x="400" y="100" text-anchor="middle" fill="${theme.colors.subtext}" font-family="${FONT_FAMILY}" font-size="14">No contribution data</text>
    </svg>`;
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

  const numWeeks = weeks.length;
  const numDays = 7;

  const gridWidth = (numWeeks + numDays) * ISO_COS * (CELL_SIZE + CELL_GAP);
  const gridHeight =
    (numWeeks + numDays) * ISO_SIN * (CELL_SIZE + CELL_GAP) + MAX_BAR_HEIGHT;

  const cardWidth = Math.max(gridWidth + CARD_PADDING * 2 + 40, 800);
  const cardHeight = gridHeight + GRID_TOP + MONTH_LABELS_HEIGHT + CARD_PADDING + 10;

  const originX = cardWidth / 2 + (numDays * ISO_COS * (CELL_SIZE + CELL_GAP)) / 2;
  const originY = GRID_TOP + MONTH_LABELS_HEIGHT + MAX_BAR_HEIGHT;

  let cubes = "";
  const cubeData: Array<{
    svg: string;
    sortKey: number;
  }> = [];

  for (let w = 0; w < weeks.length; w++) {
    const week = weeks[w]!;
    for (let d = 0; d < week.length; d++) {
      const day = week[d]!;
      if (!day.date) continue;

      const iso = toIso(w, d);
      const baseX = originX + iso.x;
      const baseY = originY + iso.y;

      const level = day.level;
      const color = theme.colors.calendar[level] ?? theme.colors.calendar[0]!;

      if (level === 0) {
        const flatHeight = 1;
        cubeData.push({
          svg: renderIsoCube(
            baseX,
            baseY,
            flatHeight,
            color,
            darkenColor(color, 0.85),
            darkenColor(color, 0.7),
          ),
          sortKey: w * 10 + d,
        });
      } else {
        const barHeight = (level / 4) * MAX_BAR_HEIGHT;
        cubeData.push({
          svg: renderIsoCube(
            baseX,
            baseY,
            barHeight,
            color,
            darkenColor(color, 0.8),
            darkenColor(color, 0.65),
          ),
          sortKey: w * 10 + d,
        });
      }
    }
  }

  cubeData.sort((a, b) => a.sortKey - b.sortKey);
  cubes = cubeData.map((c) => c.svg).join("\n");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let monthLabels = "";
  const seenMonths = new Set<string>();

  for (let w = 0; w < weeks.length; w++) {
    const firstDay = weeks[w]!.find((d) => d.date);
    if (!firstDay?.date) continue;
    const month = firstDay.date.slice(5, 7);
    if (!seenMonths.has(month)) {
      seenMonths.add(month);
      const iso = toIso(w, 0);
      const labelX = originX + iso.x;
      const labelY = GRID_TOP;
      const monthIdx = parseInt(month, 10) - 1;
      monthLabels += `<text x="${labelX}" y="${labelY}" fill="${theme.colors.subtext}" font-family="${FONT_FAMILY}" font-size="10">${months[monthIdx]}</text>`;
    }
  }

  let legendX = cardWidth - CARD_PADDING - 120;
  const legendY = cardHeight - 18;
  let legend = `<text x="${legendX - 5}" y="${legendY + 3}" fill="${theme.colors.subtext}" font-family="${FONT_FAMILY}" font-size="10" text-anchor="end">Less</text>`;

  for (let i = 0; i < 5; i++) {
    const color = theme.colors.calendar[i]!;
    legend += `<rect x="${legendX}" y="${legendY - 5}" width="10" height="10" rx="2" fill="${color}"/>`;
    legendX += 14;
  }
  legend += `<text x="${legendX + 2}" y="${legendY + 3}" fill="${theme.colors.subtext}" font-family="${FONT_FAMILY}" font-size="10">More</text>`;

  const totalContributions = calendar.reduce((sum, d) => sum + d.count, 0);

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${cardWidth}"
  height="${cardHeight}"
  viewBox="0 0 ${cardWidth} ${cardHeight}"
  fill="none"
  role="img"
  aria-label="Contribution Calendar"
>
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
  <text x="${CARD_PADDING}" y="${TITLE_Y}" fill="${theme.colors.title}" font-family="${FONT_FAMILY}" font-weight="600" font-size="18">
    ${totalContributions.toLocaleString("en-US")} contributions in the last year
  </text>
  ${monthLabels}
  ${cubes}
  ${legend}
</svg>`;
}

export { renderCalendarCard };
