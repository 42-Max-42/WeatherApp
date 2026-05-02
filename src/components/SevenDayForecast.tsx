import React from "react";
import { DailySummary } from "../types";
import { cToF } from "../utils/units";

interface Props {
  days: DailySummary[];
}

const SevenDayForecast: React.FC<Props> = ({ days }) => {
  return (
    <div className="seven-day">
      {days.slice(0, 7).map((day) => {
        const iconUrl = `https://openweathermap.org/img/wn/${day.condition.icon}.png`;
        const dateObj = new Date(day.date);
        const label = dateObj.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return (
          <div className="day-card" key={day.date}>
            <div className="day-name">{label}</div>
            <img src={iconUrl} alt={day.condition.description} className="day-icon" />
            <div className="day-temp">
              {Math.round(cToF(day.max))}°F / {Math.round(cToF(day.min))}°F
            </div>
            <div className="day-desc">{day.condition.description}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SevenDayForecast;

