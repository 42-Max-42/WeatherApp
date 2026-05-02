import React from "react";
import { TimeBlockWeather } from "../types";
import { cToF } from "../utils/units";
interface Props {
  block: TimeBlockWeather;
}
console.log("cToF is:", cToF);

const TimeBlockWeatherCard: React.FC<Props> = ({ block }) => {
  const { label, temp, condition } = block;
  const iconUrl = `https://openweathermap.org/img/wn/${condition.icon}@2x.png`;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{label}</span>
      </div>
      <div className="card-body">
        <img src={iconUrl} alt={condition.description} className="weather-icon" />
        <div className="card-temp">{Math.round(cToF(temp))}°F</div>
        <div className="card-desc">{condition.description}</div>
      </div>
    </div>
  );
};

export default TimeBlockWeatherCard;
