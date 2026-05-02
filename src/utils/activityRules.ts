import { ActivitySuggestion, WeatherCondition } from "../types";

export function getActivitySuggestions(
  condition: WeatherCondition,
  tempC: number
): ActivitySuggestion {
  const main = condition.main.toLowerCase();
  const suggestions: ActivitySuggestion = {
    recommended: [],
    notRecommended: [],
  };

  const hot = tempC >= 30;
  const cold = tempC <= 5;

  if (main.includes("clear")) {
    suggestions.recommended.push("Go for a walk", "Have a picnic", "Ride a bike");
  } else if (main.includes("cloud")) {
    suggestions.recommended.push("City stroll", "Outdoor coffee", "Photography walk");
  } else if (main.includes("rain")) {
    suggestions.recommended.push("Visit a museum", "Read at a café", "Indoor workout");
    suggestions.notRecommended.push("Outdoor sports", "Picnic in the park");
  } else if (main.includes("snow")) {
    suggestions.recommended.push("Short winter walk", "Hot drink with a view", "Photography");
    suggestions.notRecommended.push("Long drives", "Cycling");
  } else if (main.includes("thunder")) {
    suggestions.recommended.push("Stay in and watch a movie", "Board games", "Home workout");
    suggestions.notRecommended.push("Hiking", "Swimming");
  } else {
    suggestions.recommended.push("Light walk", "Relax in a park", "Explore local spots");
  }

  if (hot) {
    suggestions.notRecommended.push("Intense midday run", "Long hike in direct sun");
    suggestions.recommended.push("Early-morning walk", "Visit an air-conditioned mall");
  }

  if (cold) {
    suggestions.notRecommended.push("Long outdoor stay without warm clothes");
    suggestions.recommended.push("Short brisk walk", "Cozy café visit");
  }

  while (suggestions.recommended.length < 3) {
    suggestions.recommended.push("Relax and enjoy the weather");
  }
  while (suggestions.notRecommended.length < 2) {
    suggestions.notRecommended.push("Strenuous outdoor activity");
  }
  
  // Remove duplicates
  suggestions.recommended = [...new Set(suggestions.recommended)];
  suggestions.notRecommended = [...new Set(suggestions.notRecommended)];

  return {
    recommended: suggestions.recommended.slice(0, 3),
    notRecommended: suggestions.notRecommended.slice(0, 2),
  };
}
