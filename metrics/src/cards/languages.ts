import type { MergedLanguage } from "../github/types";
import type { Theme } from "../svg/themes";
import { escapeXml, svgCard } from "../svg/template";

const CARD_WIDTH = 495;
const PADDING_X = 25;
const TITLE_Y = 35;
const BAR_Y = 55;
const BAR_HEIGHT = 8;
const LIST_START_Y = 78;
const ROW_HEIGHT = 25;
const COLS = 2;

function renderLanguagesCard(
  languages: MergedLanguage[],
  theme: Theme,
): string {
  const top = languages.slice(0, 8);
  if (top.length === 0) {
    return svgCard(CARD_WIDTH, 120, theme, `
      <text x="${PADDING_X}" y="${TITLE_Y}" class="title">Most Used Languages</text>
      <text x="${CARD_WIDTH / 2}" y="80" text-anchor="middle" class="subtext">No language data available</text>
    `);
  }

  const barWidth = CARD_WIDTH - PADDING_X * 2;
  let barContent = "";
  let barOffset = 0;

  for (const lang of top) {
    const width = (lang.percentage / 100) * barWidth;
    barContent += `<rect
      x="${PADDING_X + barOffset}"
      y="${BAR_Y}"
      width="${width}"
      height="${BAR_HEIGHT}"
      fill="${lang.color}"
      rx="${barOffset === 0 ? 4 : 0}"
    />`;
    barOffset += width;
  }

  if (barOffset > 0) {
    barContent = `
      <mask id="bar-mask">
        <rect x="${PADDING_X}" y="${BAR_Y}" width="${barWidth}" height="${BAR_HEIGHT}" rx="4" fill="white"/>
      </mask>
      <g mask="url(#bar-mask)">${barContent}</g>`;
  }

  const rows = Math.ceil(top.length / COLS);
  const colWidth = (CARD_WIDTH - PADDING_X * 2) / COLS;
  let listContent = "";

  top.forEach((lang, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PADDING_X + col * colWidth;
    const y = LIST_START_Y + row * ROW_HEIGHT;
    const delay = i * 100;

    listContent += `
      <g class="animate" style="animation-delay: ${delay}ms">
        <circle cx="${x + 5}" cy="${y + 5}" r="5" fill="${lang.color}"/>
        <text x="${x + 16}" y="${y + 9}" class="lang-name">${escapeXml(lang.name)}</text>
        <text x="${x + 16}" y="${y + 21}" class="lang-pct">${lang.percentage.toFixed(1)}%</text>
      </g>`;
  });

  const cardHeight = LIST_START_Y + rows * ROW_HEIGHT + 15;

  const content = `
    <text x="${PADDING_X}" y="${TITLE_Y}" class="title">Most Used Languages</text>
    ${barContent}
    ${listContent}
  `;

  return svgCard(CARD_WIDTH, cardHeight, theme, content);
}

export { renderLanguagesCard };
