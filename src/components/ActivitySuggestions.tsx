import React from "react";
import { ActivitySuggestion } from "../types";

interface Props {
  suggestions: ActivitySuggestion;
}

const ActivitySuggestions: React.FC<Props> = ({ suggestions }) => {
  return (
    <div className="activities">
      <div className="activities-column">
        <h3>Recommended</h3>
        <ul>
          {suggestions.recommended.map((item, idx) => (
            <li key={idx}>• {item}</li>
          ))}
        </ul>
      </div>
      <div className="activities-column">
        <h3>Not Recommended</h3>
        <ul>
          {suggestions.notRecommended.map((item, idx) => (
            <li key={idx}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivitySuggestions;
