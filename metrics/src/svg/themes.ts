interface ThemeColors {
  background: string;
  cardBackground: string;
  border: string;
  title: string;
  text: string;
  subtext: string;
  accent: string;
  icon: string;
  calendar: [string, string, string, string, string];
}

interface Theme {
  name: string;
  colors: ThemeColors;
}

const THEMES: Record<string, Theme> = {
  gotham: {
    name: "gotham",
    colors: {
      background: "#0d1117",
      cardBackground: "#161b22",
      border: "#30363d",
      title: "#2ea043",
      text: "#c9d1d9",
      subtext: "#8b949e",
      accent: "#2ea043",
      icon: "#2ea043",
      calendar: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    },
  },
  dark: {
    name: "dark",
    colors: {
      background: "#0d1117",
      cardBackground: "#0d1117",
      border: "#30363d",
      title: "#58a6ff",
      text: "#c9d1d9",
      subtext: "#8b949e",
      accent: "#58a6ff",
      icon: "#58a6ff",
      calendar: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    },
  },
  light: {
    name: "light",
    colors: {
      background: "#ffffff",
      cardBackground: "#ffffff",
      border: "#d0d7de",
      title: "#0969da",
      text: "#1f2328",
      subtext: "#656d76",
      accent: "#0969da",
      icon: "#0969da",
      calendar: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    },
  },
} as const;

function getTheme(name?: string): Theme {
  return THEMES[name ?? "gotham"] ?? THEMES["gotham"]!;
}

export { getTheme, THEMES };
export type { Theme, ThemeColors };
