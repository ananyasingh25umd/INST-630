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

export default function showStatsWithChart(data) {
  const html = showStats(data);
  document.getElementById("data-display").innerHTML = html; // I am adding this to make sure that HTML renders first before loading the charts.
  avgPressureChart(data);
  tempChart(data);
  avgMetricsChart(data);
}

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

    <section class="category-section">
      <h3 class="category-header">Average Pressure per Sol</h3>
      <canvas id="avgPressureChart" class="category-items"></canvas>
    </section>

    <section class="category-section">
      <h3 class="category-header">Temperature per Sol</h3>
      <canvas id="tempChart" class="category-items"></canvas>
    </section>

    <section class="category-section">
      <h3 class="category-header">Quick Comparison of Average Metrics</h3>
      <canvas id="avgMetricsChart" class="category-items"></canvas>
    </section>
  `;
 
}

// This is where I am creating all the functions for the Charts.js

// I am creating this function to show the Average Pressure trend across all Sols (Martian days). This is a line chart.
function avgPressureChart(data) {
    if (!data || data.length === 0) return;

    const sols = data.map(d => d.sol);
    const avgPressures = data.map(d => d.pressure?.avg ?? null); 
    
    // I am trying to filter out the null values (if present) from the dataset
    const filteredSols = [];
    const filteredPressures = [];
    avgPressures.forEach((pressure, i) => {
        if (pressure !== null) {
            filteredPressures.push(pressure);
            filteredSols.push(sols[i]);
        }
    });

    const ctx = document.getElementById('avgPressureChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: filteredSols,
            datasets: [{
                label: 'Average Pressure (Pa)',
                data: filteredPressures,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3 // This would help in controlling how smooth the curve would be
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { 
                  display: true, 
                  labels: {
                    color: '#f5e0d6',
                    font: { size: 16, weight: 'bold' }
                  }
                },
                tooltip: { mode: 'index', intersect: false }
            },
            interaction: { mode: 'nearest', axis: 'x', intersect: false },
            scales: {
                x: { title: { display: true, text: 'Sol (Martian Day)', color: '#f5e0d6', font: { size: 16, weight: 'bold' } }, ticks: {
                color: '#f5e0d6', font: { size: 14 }} },
                y: { title: { display: true, text: 'Pressure (Pa)', color: '#f5e0d6', font: { size: 16, weight: 'bold' } }, ticks: {
                color: '#f5e0d6', font: { size: 14 }} }
            }
        }
    });
}

// Now I am creating this function for showing the temperature ranges (minimun, average and maximum temperatures) for all Sols. This is a vertical grouped bar chart.
function tempChart(data) {
    if (!data || data.length === 0) return;

    const sols = data.map(d => d.sol);
    const tempMin = data.map(d => d.temperature?.min ?? null);
    const tempMax = data.map(d => d.temperature?.max ?? null);
    const tempAvg = data.map(d => d.temperature?.avg ?? null);

    const ctx = document.getElementById('tempChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sols,
            datasets: [
                {
                    label: 'Min Temp (°C)',
                    data: tempMin,
                    backgroundColor: 'rgba(100, 149, 237, 0.5)',
                    borderColor: 'rgba(100, 149, 237, 1)',        
                    borderWidth: 1,
                },
                {
                    label: 'Avg Temp (°C)',
                    data: tempAvg,
                    backgroundColor: 'rgba(255, 200, 150, 0.5)',
                    borderColor: 'rgba(255, 200, 150, 1)',        
                    borderWidth: 1,
                },
                {
                    label: 'Max Temp (°C)',
                    data: tempMax,
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    borderColor: 'rgba(255, 159, 64, 1)',        
                    borderWidth: 1,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                    color: '#f5e0d6',
                    font: { size: 16, weight: 'bold' }
                  }
                },
                tooltip: {
                    bodyColor: '#f5e0d6',
                    backgroundColor: 'black',
                    titleColor: '#f5e0d6'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Sol (Martian Day)',
                        color: '#f5e0d6',
                        font: { size: 16, weight: 'bold' }
                    },
                    ticks: {
                        color: '#f5e0d6',
                        font: { size: 14 }
                    },
                    stacked: false
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        color: '#f5e0d6',
                        font: { size: 16, weight: 'bold' }
                    },
                    ticks: {
                        color: '#f5e0d6',
                        font: { size: 14 }
                    },
                    grid: {
                      display: true,          
                      color: '#532714',  
                      lineWidth: 1,            
                      drawTicks: true,         
                    },
                    min: -98,
                    max: -3,
                    // stepSize: 10,
                    stacked: false
                }
            }
        }
    });
}

// This is the last function that is simply comparing all the numeric data together, that is, average temperature, pressure and wind speed in one place. It is a horizontal bar chart.
function avgMetricsChart(data) {
    if (!data || data.length === 0) return;

    const average = (values) => { // This is a simply a helper function to calculate the average.
        const valid = values.filter(v => typeof v === 'number' && !isNaN(v));
        return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
    };

    const avgTemp = average(data.map(d => d.temperature?.avg));
    const avgPressure = average(data.map(d => d.pressure?.avg));
    const avgWind = average(data.map(d => d.wind?.avg));

    const ctx = document.getElementById('avgMetricsChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Temperature (°C)', 'Pressure (Pa)', 'Wind Speed (m/s)'],
            datasets: [{
                label: 'Average Values',
                data: [avgTemp, avgPressure, avgWind],
                backgroundColor: [
                    'rgba(100, 149, 237, 0.3)',  
                    'rgba(75, 192, 192, 0.3)',   
                    'rgba(255, 159, 64, 0.3)'    
                ],
                borderColor: [
                    'rgba(100, 149, 237, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2,
                maxBarThickness: 50,
            }]
        },
        options: {
            indexAxis: 'y', // This is what is setting the chart to be a horizontal chart
            responsive: true,
            plugins: {
                legend: { display: false }, 
                tooltip: { mode: 'nearest' }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: '#f5e0d6',
                        font: { size: 14 }, 
                    },
                    grid: {
                        color: '#532714' 
                    },
                    min: -63,
                    max: 750,
                },
                y: {
                    ticks: { color: '#f5e0d6', font: { size: 14, weight: 'bold' } },
                    grid: { drawTicks: false },
                }
            }
        }
    });
}
