import type { StreakData } from "../github/types";
import type { Theme } from "../svg/themes";
import { renderIcon } from "../svg/icons";
import { formatDate, formatNumber, svgCard } from "../svg/template";

const CARD_WIDTH = 495;
const CARD_HEIGHT = 195;

function renderStreakCard(streak: StreakData, theme: Theme): string {
  const colWidth = CARD_WIDTH / 3;
  const centerY = 80;

  const sections = [
    {
      num: formatNumber(streak.totalContributions),
      label: "Total Contributions",
      date: "",
    },
    {
      num: streak.currentStreak.toString(),
      label: "Current Streak",
      date: streak.currentStart ? `${formatDate(streak.currentStart)} - Present` : "",
    },
    {
      num: streak.longestStreak.toString(),
      label: "Longest Streak",
      date:
        streak.longestStart && streak.longestEnd
          ? `${formatDate(streak.longestStart)} - ${formatDate(streak.longestEnd)}`
          : "",
    },
  ];

  let content = "";

  sections.forEach((section, i) => {
    const cx = colWidth * i + colWidth / 2;
    const delay = i * 200;

    if (i > 0) {
      content += `<line
        x1="${colWidth * i}"
        y1="28"
        x2="${colWidth * i}"
        y2="${CARD_HEIGHT - 28}"
        stroke="${theme.colors.border}"
        stroke-width="1"
      />`;
    }

    content += `
      <g class="animate" style="animation-delay: ${delay}ms">
        ${i === 1 ? renderIcon("fire", cx - 8, centerY - 45, 16, theme.colors.accent) : ""}
        <text x="${cx}" y="${centerY}" text-anchor="middle" class="streak-num">${section.num}</text>
        <text x="${cx}" y="${centerY + 25}" text-anchor="middle" class="streak-label">${section.label}</text>
        ${section.date ? `<text x="${cx}" y="${centerY + 42}" text-anchor="middle" class="streak-date">${section.date}</text>` : ""}
      </g>`;
  });

  return svgCard(CARD_WIDTH, CARD_HEIGHT, theme, content);
}

export { renderStreakCard };
