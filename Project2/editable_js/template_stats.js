/**
 * STATS VIEW - STUDENTS IMPLEMENT
 * Show aggregate statistics and insights - good for understanding the big picture
 */
function average(values) {
  const valid = values.filter(v => typeof v === "number" && !isNaN(v));
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
}
const windDirection = {
  N: "North",
  NNE: "North-Northeast",
  NE: "Northeast",
  ENE: "East-Northeast",
  E: "East",
  ESE: "East-Southeast",
  SE: "Southeast",
  SSE: "South-Southeast",
  S: "South",
  SSW: "South-Southwest",
  SW: "Southwest",
  WSW: "West-Southwest",
  W: "West",
  WNW: "West-Northwest",
  NW: "Northwest",
  NNW: "North-Northwest"
};

function showStats(data) {
    const avgTemp = average(data.map(d => d.temperature?.avg));
    const avgPressure = average(data.map(d => d.pressure?.avg));
    const avgWind = average(data.map(d => d.wind?.avg));

    const hottestSol = data.reduce((a, b) =>
        (a.temperature?.max ?? -Infinity) > (b.temperature?.max ?? -Infinity) ? a : b
    );
    
    const coldestSol = data.reduce((a, b) =>
        (a.temperature?.min ?? Infinity) < (b.temperature?.min ?? Infinity) ? a : b
    );

    const windDirCount = {};
        for (const d of data) {
            const dir = d.wind?.direction;
            if (!dir) continue;
            windDirCount[dir] = (windDirCount[dir] || 0) + 1;
        }
    const dominantDir = Object.entries(windDirCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

  /*html*/
  return `
    <h2 class="view-title"><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#f5e0d6"><path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z"/></svg>Statistics View</h2>
    <p class="view-description">
      Key insights and overall trends from recent Martian weather data.
    </p>

    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${avgTemp?.toFixed(1) ?? "N/A"} °C</div>
        <div class="stat-label">Average Temperature</div>
      </div>

      <div class="stat-card">
        <div class="stat-number">${hottestSol.temperature?.max?.toFixed(1) ?? "N/A"} °C</div>
        <div class="stat-label">Hottest Sol (${hottestSol.sol})</div>
      </div>

      <div class="stat-card">
        <div class="stat-number">${coldestSol.temperature?.min?.toFixed(1) ?? "N/A"} °C</div>
        <div class="stat-label">Coldest Sol (${coldestSol.sol})</div>
      </div>

      <div class="stat-card">
        <div class="stat-number">${avgPressure?.toFixed(1) ?? "N/A"} Pa</div>
        <div class="stat-label">Average Pressure</div>
      </div>

      <div class="stat-card">
        <div class="stat-number">${avgWind?.toFixed(1) ?? "N/A"} m/s</div>
        <div class="stat-label">Average Wind Speed</div>
      </div>

      <div class="stat-card">
        <div class="stat-number">${dominantDir}</div>
        <div class="stat-label">Dominant Wind Direction (${windDirection[dominantDir] || "Unknown Direction"})</div>
      </div>
    </section>
  `;
 
}

export default showStats