import React, { useEffect, useMemo, useState } from "react";
import { fetchCoordinates, fetchForecast } from "./api/openweather";
import {
  ActivitySuggestion,
  DailySummary,
  ForecastListItem,
  ForecastResponse,
  TimeBlockWeather,
  WeatherCondition,
} from "./types";
import { getActivitySuggestions } from "./utils/activityRules";
import { getThemeFromAfternoon, ThemePalette } from "./utils/theme";
import TimeBlockWeatherCard from "./components/TimeBlockWeather";
import ActivitySuggestions from "./components/ActivitySuggestions";
import SevenDayForecast from "./components/SevenDayForecast";

const App: React.FC = () => {
  const [city, setCity] = useState("Santa Ana");
  const [locationLabel, setLocationLabel] = useState<string>("");
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSevenDay, setShowSevenDay] = useState(false);
  const [theme, setTheme] = useState<ThemePalette | null>(null);
  const [activitySuggestions, setActivitySuggestions] =
    useState<ActivitySuggestion | null>(null);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const coords = await fetchCoordinates(city);
      setLocationLabel(`${coords.name}, ${coords.country}`);
      const data = await fetchForecast(coords.lat, coords.lon);
      setForecast(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Something went wrong");
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const { timeBlocks, dailySummaries } = useMemo(() => {
    if (!forecast || !forecast.list || !forecast.city) {
  return { timeBlocks: [], dailySummaries: [] };
}

    const tzOffset = forecast.city.timezone; // seconds
    const list = forecast.list;

    const toLocalDate = (dt: number) => {
      const localMs = (dt + tzOffset) * 1000;
      const d = new Date(localMs);
      return {
        dateKey: d.toISOString().slice(0, 10), // YYYY-MM-DD
        hour: d.getUTCHours(),
      };
    };

    const todayLocal = (() => {
      const nowUtc = Date.now();
      const localMs = nowUtc + tzOffset * 1000;
      const d = new Date(localMs);
      return d.toISOString().slice(0, 10);
    })();

    // Time blocks for TODAY
    const blocksDef: { label: TimeBlockWeather["label"]; start: number; end: number }[] = [
      { label: "Morning", start: 6, end: 12 },
      { label: "Afternoon", start: 12, end: 18 },
      { label: "Night", start: 18, end: 24 },
    ];

    const timeBlocks: TimeBlockWeather[] = [];

    for (const block of blocksDef) {
      const items: ForecastListItem[] = list.filter((item) => {
        const { dateKey, hour } = toLocalDate(item.dt);
        return dateKey === todayLocal && hour >= block.start && hour < block.end;
      });

      if (items.length === 0) continue;

      const avgTemp =
        items.reduce((sum, it) => sum + it.main.temp, 0) / items.length;
      const representative = items[Math.floor(items.length / 2)];
      const condition = representative.weather[0];

      timeBlocks.push({
        label: block.label,
        temp: avgTemp,
        condition,
      });
    }

    // Daily summaries (group by date)
    const dailyMap = new Map<
      string,
      { temps: number[]; min: number; max: number; conditions: WeatherCondition[] }
    >();

    for (const item of list) {
      const { dateKey } = toLocalDate(item.dt);
      const entry = dailyMap.get(dateKey) || {
        temps: [],
        min: item.main.temp_min,
        max: item.main.temp_max,
        conditions: [],
      };
      entry.temps.push(item.main.temp);
      entry.min = Math.min(entry.min, item.main.temp_min);
      entry.max = Math.max(entry.max, item.main.temp_max);
      entry.conditions.push(item.weather[0]);
      dailyMap.set(dateKey, entry);
    }

    const dailySummaries: DailySummary[] = Array.from(dailyMap.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, entry]) => {
        // pick most frequent condition
        const freq = new Map<string, { count: number; cond: any }>();
        for (const c of entry.conditions) {
          const key = c.icon + "|" + c.description;
          const f = freq.get(key) || { count: 0, cond: c };
          f.count += 1;
          freq.set(key, f);
        }
        let best: { count: number; cond: any } | null = null;
        for (const v of freq.values()) {
          if (!best || v.count > best.count) best = v;
        }
        const condition = best ? best.cond : entry.conditions[0];

        return {
          date,
          min: entry.min,
          max: entry.max,
          condition,
        };
      });

    // Theme + activities from afternoon
    if (timeBlocks.length > 0) {
      const afternoon =
        timeBlocks.find((b) => b.label === "Afternoon") ?? timeBlocks[0];
      const palette = getThemeFromAfternoon(afternoon.condition, afternoon.temp);
      setTheme(palette);
      const activities = getActivitySuggestions(afternoon.condition, afternoon.temp);
      setActivitySuggestions(activities);
    }

    if (theme) {
  document.documentElement.style.setProperty("--card-bg", theme.card);
  document.documentElement.style.setProperty("--text-color", theme.text);
}

    return { timeBlocks, dailySummaries };
  }, [forecast]);

  const rootStyle: React.CSSProperties = theme
    ? {
        backgroundColor: theme.background,
        color: theme.text,
      }
    : {};

  return (
    <div className="app-root" style={rootStyle}>
      <div className="app-container">
        <header className="app-header">
          <h1>Weather & Activities</h1>
          <p>Plan your day by morning, afternoon, and night.</p>
        </header>

        <section className="search-section">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </section>

        {locationLabel && (
          <div className="location-label">Location: {locationLabel}</div>
        )}

        {loading && <div className="status">Loading weather...</div>}
        {error && <div className="status error">{error}</div>}

        {timeBlocks.length > 0 && (
          <>
            <section className="blocks-section">
              {timeBlocks.map((block) => (
                <TimeBlockWeatherCard key={block.label} block={block} />
              ))}
            </section>

            {activitySuggestions && (
              <section className="activities-section">
                <h2>Activities based on afternoon weather</h2>
                <ActivitySuggestions suggestions={activitySuggestions} />
              </section>
            )}
          </>
        )}

        {dailySummaries.length > 0 && (
          <section className="seven-day-section">
            <button
              className="toggle-button"
              onClick={() => setShowSevenDay((prev) => !prev)}
            >
              {showSevenDay ? "Hide next days" : "Show next days"}
            </button>
            {showSevenDay && <SevenDayForecast days={dailySummaries} />}
          </section>
        )}
      </div>
    </div>
  );
};

export default App;