/* CATEGORY VIEW */

// I am building this helper average function to just calculate the mean. Will be using this again and again in other functions.
function average(values) {
  const val = values.filter(v => typeof v === "number" && !isNaN(v)); //I am filtering out the null or undefined values here
  return val.length ? val.reduce((a, b) => a + b, 0) / val.length : null; 
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


// This function will group by season, if in case API has multiple seasons
function groupBySeason(data) {
  const groups = {};
  for (const item of data) {
    const key = item.season || "Unknown";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  return Object.entries(groups)
    .map(([season, items]) => { //Here, I am calculating statistics for each season
      const avgTemp = average(items.map(i => i.temperature?.avg));
      const avgPressure = average(items.map(i => i.pressure?.avg));
      return `
        <div class="category-item">
          <h4>${season} season</h4>
          <p><strong>${items.length}</strong> sols</p>
          <p>Avg Temp: <strong>${avgTemp?.toFixed(1) ?? "N/A"}</strong> °C</p>
          <p>Avg Pressure: <strong>${avgPressure?.toFixed(1) ?? "N/A"}</strong> Pa</p>
        </div>
      `;
    })
    .join("");
}

// Creating a function to group by Temperature Range (Cold / Mild / Warm)
function groupByTemperatureRange(data) {
  const groups = { Cold: [], Mild: [], Warm: [] };

  for (const item of data) {
    const temp = item.temperature?.avg;
    if (temp == null) continue;

    if (temp < -70) groups.Cold.push(item);
    else if (temp < -50) groups.Mild.push(item);
    else groups.Warm.push(item);
  }

  return Object.entries(groups)
    .map(([range, items]) => {
      const avgPressure = average(items.map(i => i.pressure?.avg));
      const avgWind = average(items.map(i => i.wind?.avg));
      return `
        <div class="category-item">
          <h4>${range}</h4>
          <p><strong>${items.length}</strong> sols</p>
          <p>Avg Pressure: <strong>${avgPressure?.toFixed(1) ?? "N/A"}</strong> Pa</p>
          <p>Avg Wind: <strong>${avgWind?.toFixed(1) ?? "N/A"}</strong> m/s</p>
        </div>
      `;
    })
    .join("");
}

// Creating a function to Group by Wind Direction
function groupByWindDirection(data) {
  const groups = {};
  for (const item of data) {
    const dir = item.wind?.direction || "Unknown";
    if (!groups[dir]) groups[dir] = [];
    groups[dir].push(item);
  }

  return Object.entries(groups)
    .map(([dir, items]) => {
      const avgWind = average(items.map(i => i.wind?.avg));
      const fullForm = windDirection[dir] || "Unknown Direction";

      return `
        <div class="category-item">
          <h4>${dir}</h4>
          <p>${fullForm}</p>
          <p><strong>${items.length}</strong> sols</p>
          <p>Avg Wind Speed: <strong>${avgWind?.toFixed(1) ?? "N/A"}</strong> m/s</p>
        </div>
      `;
    })
    .join("");
}

//Combining all the groups here
function showCategories(data) {
  return `
    <h2 class="view-title"><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#f5e0d6"><path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Z"/></svg>Category View</h2>
    <p class="view-description">
      Explore Martian weather patterns grouped by <strong>Season</strong>, <strong>Temperature Range</strong>, and <strong>Wind Direction</strong>.
    </p>

    <section class="category-section">
      <h3 class="category-header"><svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#f5e0d6"><path d="M440-760v-160h80v160h-80Zm266 110-56-56 113-114 56 57-113 113Zm54 210v-80h160v80H760Zm3 299L650-254l56-56 114 112-57 57ZM254-650 141-763l57-57 112 114-56 56Zm-14 450h180q25 0 42.5-17.5T480-260q0-25-17-42.5T421-320h-51l-20-48q-14-33-44-52.5T240-440q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T40-320q0-83 58.5-141.5T240-520q60 0 109.5 32.5T423-400q58 0 97.5 43T560-254q-2 57-42.5 95.5T420-120H240Zm320-134q-5-20-10-39t-10-39q45-19 72.5-59t27.5-89q0-66-47-113t-113-47q-60 0-105 39t-53 99q-20-5-41-9t-41-9q14-88 82.5-144T480-720q100 0 170 70t70 170q0 77-44 138.5T560-254Zm-79-226Z"/></svg>By Season</h3>
      <div class="category-items">${groupBySeason(data)}</div>
    </section>

    <section class="category-section">
      <h3 class="category-header"><svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#f5e0d6"><path d="M620-520q-25 0-42.5-17.5T560-580q0-17 9.5-34.5t20.5-32q11-14.5 20.5-24l9.5-9.5 9.5 9.5q9.5 9.5 20.5 24t20.5 32Q680-597 680-580q0 25-17.5 42.5T620-520Zm160-120q-25 0-42.5-17.5T720-700q0-17 9.5-34.5t20.5-32q11-14.5 20.5-24l9.5-9.5 9.5 9.5q9.5 9.5 20.5 24t20.5 32Q840-717 840-700q0 25-17.5 42.5T780-640Zm0 240q-25 0-42.5-17.5T720-460q0-17 9.5-34.5t20.5-32q11-14.5 20.5-24l9.5-9.5 9.5 9.5q9.5 9.5 20.5 24t20.5 32Q840-477 840-460q0 25-17.5 42.5T780-400ZM360-120q-83 0-141.5-58.5T160-320q0-48 21-89.5t59-70.5v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q38 29 59 70.5t21 89.5q0 83-58.5 141.5T360-120ZM240-320h240q0-29-12.5-54T432-416l-32-24v-280q0-17-11.5-28.5T360-760q-17 0-28.5 11.5T320-720v280l-32 24q-23 17-35.5 42T240-320Z"/></svg>By Temperature Range</h3>
      <div class="category-items">${groupByTemperatureRange(data)}</div>
    </section>

    <section class="category-section">
      <h3 class="category-header"><svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#f5e0d6"><path d="M400-40q0-33 23.5-56.5T480-120v-208q-12-5-22.5-11.5T438-354l-88 56q-14 8-30.5 10.5T286-290l-180-51q-29-8-47.5-32.5T40-429q0-38 26.5-64.5T131-520h301q10-11 22-19t26-13v-137q0-17 6.5-32t18.5-26l137-128q23-22 53.5-25t56.5 13q32 20 41.5 56.5T783-762L624-499q7 12 10.5 26t4.5 29l108 26q16 4 29 14t21 24l91 164q15 27 11 57t-26 52q-27 27-64.5 27T744-107L560-291v171q33 0 56.5 23.5T640-40H400ZM160-760v-80h240v80H160Zm400 71v137q1 0 1.5.5t1.5.5l152-253q2-4 1-8.5t-5-6.5q-3-2-7.5-1t-6.5 3L560-689ZM40-600v-80h200v80H40Zm480 200q17 0 28.5-11.5T560-440q0-17-11.5-28.5T520-480q-17 0-28.5 11.5T480-440q0 17 11.5 28.5T520-400Zm-211 34 93-56q-1-5-1-9v-9H131q-5 0-8 3t-3 8q0 4 2 7t6 4l181 52Zm419 25-114-26q-2 2-4 5t-4 5l195 194q3 3 8 3t8-3q3-3 3.5-6.5T819-177l-91-164ZM120-120v-80h200v80H120Zm400-320Zm43-111ZM401-440Zm205 83Z"/></svg>By Wind Direction</h3>
      <div class="category-items">${groupByWindDirection(data)}</div>
    </section>
  `;
  
}

export default showCategories;