export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ForecastListItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: WeatherCondition[];
}

export interface ForecastCity {
  name: string;
  country: string;
  timezone: number; // seconds offset from UTC
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastListItem[];
  city: ForecastCity;
}

export interface TimeBlockWeather {
  label: "Morning" | "Afternoon" | "Night";
  temp: number;
  condition: WeatherCondition;
}

export interface ActivitySuggestion {
  recommended: string[];
  notRecommended: string[];
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  min: number;
  max: number;
  condition: WeatherCondition;
}
