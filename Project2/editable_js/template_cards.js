
/**
 * CARD VIEW - PROVIDED AS EXAMPLE
 * Display data as browsable cards - good for comparing individual items
 */
function showCards(data) {
  const cardHTML = data
    .map(
       /*html*/ 
      (solData) => `
        <div class="restaurant-card">
          <h3 class="card-title">Sol ${solData.sol}</h3>
          <div class="alignment"><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e7b198"><path d="M320-120q-83 0-141.5-58.5T120-320q0-48 21-89.5t59-70.5v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q38 29 59 70.5t21 89.5q0 83-58.5 141.5T320-120ZM200-320h240q0-29-12.5-54T392-416l-32-24v-280q0-17-11.5-28.5T320-760q-17 0-28.5 11.5T280-720v280l-32 24q-23 17-35.5 42T200-320Zm580 160L640-300l57-56 43 43v-487h80v488l44-44 56 56-140 140Z"/></svg>
              ${solData.temperature.min.toFixed(1) ?? "N/A"}°C</div>
          <div class="alignment"><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e7b198"><path d="M320-120q-83 0-141.5-58.5T120-320q0-48 21-89.5t59-70.5v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q38 29 59 70.5t21 89.5q0 83-58.5 141.5T320-120ZM200-320h240q0-29-12.5-54T392-416l-32-24v-280q0-17-11.5-28.5T320-760q-17 0-28.5 11.5T280-720v280l-32 24q-23 17-35.5 42T200-320Zm540 160v-488l-44 44-56-56 140-140 140 140-57 56-43-43v487h-80Z"/></svg> 
              ${solData.temperature.max.toFixed(1) ?? "N/A"}°C</div>
          <div class="alignment"><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#e7b198"><path d="M750-614q-27 27-62 41t-70 14q-35 0-69-13.5T488-614l-75-75q-15-15-34-22.5t-39-7.5q-20 0-39 7.5T267-689l-75 75-57-57 75-75q27-27 61-40.5t69-13.5q35 0 68.5 13.5T469-746l75 75q16 16 35 23.5t39 7.5q20 0 39.5-7.5T693-671l75-75 57 57-75 75Zm0 200q-27 27-61.5 40.5T619-360q-35 0-69.5-13.5T488-414l-75-75q-15-15-34-22.5t-39-7.5q-20 0-39 7.5T267-489l-75 75-57-56 75-76q27-27 61-40.5t69-13.5q35 0 68.5 13.5T469-546l75 75q16 16 35 23.5t39 7.5q20 0 39.5-7.5T693-471l75-75 57 57-75 75Zm-1 200q-27 27-61 40.5T619-160q-35 0-69.5-13.5T488-214l-76-75q-15-15-34-22.5t-39-7.5q-20 0-39 7.5T266-289l-75 75-56-56 75-76q27-27 61-40.5t69-13.5q35 0 68.5 13.5T469-346l75 75q16 16 35.5 23.5T619-240q20 0 39-7.5t35-23.5l75-75 56 57-75 75Z"/></svg> 
            ${solData.wind.avg ?? "N/A"} m/s ${solData.wind.direction ? `from ${solData.wind.direction}` : ""}</div>
          <div class="alignment"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e7b198"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80ZM280-520q17 0 28.5-11.5T320-560q0-17-11.5-28.5T280-600q-17 0-28.5 11.5T240-560q0 17 11.5 28.5T280-520Zm120-120q17 0 28.5-11.5T440-680q0-17-11.5-28.5T400-720q-17 0-28.5 11.5T360-680q0 17 11.5 28.5T400-640Zm280 120q17 0 28.5-11.5T720-560q0-17-11.5-28.5T680-600q-17 0-28.5 11.5T640-560q0 17 11.5 28.5T680-520ZM480-400q33 0 56.5-23.5T560-480q0-13-4-25.5T544-528l54-136q7-16 .5-31.5T576-718q-15-7-30.5-.5T524-696l-54 136q-30 5-50 27.5T400-480q0 33 23.5 56.5T480-400ZM326-200q35-20 74-30t80-10q41 0 80 10t74 30l70-52q-50-33-107-50.5T480-320q-60 0-117 17.5T256-252l70 52Z"/></svg>
            ${solData.pressure.avg ?? "N/A"} Pa</div>
        </div>
      `
    )
    .join("");
     /*html*/ 
  return `
                <h2 class="view-title"><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#f5e0d6"><path d="M880-170v-620 620ZM80-610v-180h170v180H80Zm210 0v-180h170v180H290Zm210 0v-180h170v180H500Zm210 0v-180h170v180H710Zm0 220v-180h170v180H710Zm-210 0v-180h170v180H500Zm-210 0v-180h170v180H290Zm-210 0v-180h170v180H80Zm630 220v-180h170v180H710Zm-210 0v-180h170v180H500Zm-210 0v-180h170v180H290Zm-210 0v-180h170v180H80Z"/></svg> Card View</h2>
                <p class="view-description">Each card represents one Martian sol (day) from NASA's InSight lander.</p>
                <div class="card-grid">
                    ${cardHTML}
                </div>
            `;
}

export default showCards;