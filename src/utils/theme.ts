import { WeatherCondition } from "../types";

export interface ThemePalette {
  background: string;
  card: string;
  text: string;
  accent: string;
}

export function getThemeFromAfternoon(
  condition: WeatherCondition,
  tempC: number
): ThemePalette {
  const main = condition.main.toLowerCase();

  if (main.includes("clear")) {
    return {
      background: "#FFE9B3",
      card: "#FFD180",
      text: "#3E2723",
      accent: "#FF9800",
    };
  }

  if (main.includes("cloud")) {
    return {
      background: "#ECEFF1",
      card: "#CFD8DC",
      text: "#263238",
      accent: "#607D8B",
    };
  }

  if (main.includes("rain") || main.includes("drizzle")) {
    return {
      background: "#E3F2FD",
      card: "#BBDEFB",
      text: "#0D47A1",
      accent: "#0288D1",
    };
  }

  if (main.includes("snow")) {
    return {
      background: "#E0F7FA",
      card: "#B2EBF2",
      text: "#004D40",
      accent: "#00ACC1",
    };
  }

  if (main.includes("thunder")) {
    return {
      background: "#EDE7F6",
      card: "#D1C4E9",
      text: "#311B92",
      accent: "#673AB7",
    };
  }

  if (tempC >= 28) {
    return {
      background: "#FFE0B2",
      card: "#FFCC80",
      text: "#4E342E",
      accent: "#FB8C00",
    };
  }

  return {
    background: "#F5F5F5",
    card: "#E0E0E0",
    text: "#212121",
    accent: "#607D8B",
  };
}
