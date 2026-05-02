import { ForecastResponse } from "../types";

const API_KEY = "83925be8834b66e34f8279d56ce16083";

export async function fetchCoordinates(city: string) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city
  )}&limit=1&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch coordinates");
  const data = await res.json();
  if (!data || data.length === 0) throw new Error("City not found");

  return {
    lat: data[0].lat as number,
    lon: data[0].lon as number,
    name: data[0].name as string,
    country: data[0].country as string,
  };
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}
