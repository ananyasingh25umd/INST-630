
/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */
function showTable(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Show data in a table format
  // - Include all important fields
  // - Make it easy to scan and compare
  // - Consider adding sorting functionality
  /*html*/ 
    if (!data || data.length === 0) {
        return `<p>No Mars weather data available.</p>`;
    }

    const columns = [
        { key: "sol", label: "Sol" },
        { key: "converted_date", label: "Earth Date" },
        { key: "season", label: "Season" },
        { key: "temperature.avg", label: "Avg Temp (°C)" },
        { key: "temperature.min", label: "Min Temp (°C)" },
        { key: "temperature.max", label: "Max Temp (°C)" },
        { key: "pressure.avg", label: "Pressure (Pa)" },
        { key: "wind.avg", label: "Wind Speed (m/s)" },
        { key: "wind.direction", label: "Wind Dir" },
    ];

    const headers = columns
        .map(
        (col) => `
            <th data-key="${col.key}" class="sortable">
            ${col.label}
            <span class="sort-indicator" data-key="${col.key}">⇅</span>
            </th>`
        )
        .join("");

    const rows = data
        .map((item) => {
        const get = (path) => path.split(".").reduce((obj, key) => obj?.[key], item) ?? "Unknown";
        return `
            <tr>
            <td>${item.sol}</td>
            <td>${item.converted_date ? new Date(item.converted_date).toLocaleDateString() : "Unknown"}</td>
            <td>${item.season ?? "Unknown"}</td>
            <td>${get("temperature.avg")}</td>
            <td>${get("temperature.min")}</td>
            <td>${get("temperature.max")}</td>
            <td>${get("pressure.avg")}</td>
            <td>${get("wind.avg")}</td>
            <td>${get("wind.direction")}</td>
            </tr>`;
        })
        .join("");

        return `
            <h2 class="view-title"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#f5e0d6"><path d="M440-320H120v120q0 33 23.5 56.5T200-120h240v-200Zm80 0v200h240q33 0 56.5-23.5T840-200v-120H520Zm-80-80v-200H120v200h320Zm80 0h320v-200H520v200ZM120-680h720v-80q0-33-23.5-56.5T760-840H200q-33 0-56.5 23.5T120-760v80Z"/></svg>Table View</h2>
            <p class="view-description">Each row represents one Martian sol (day) from NASA's InSight lander.</p>
            <table class="restaurant-table" id="marsTable">
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
            </table>
        `;
        }
        
//Creating a function to sort the table
function attachSorting(table) {
    if (!table) return;

    let sortState = {}; // This array is for keeping track of which column is currently sorted and in which direction.

    //I am trying to build this function to get cell value. 
    const getCellValue = (row, index) => {
      const cell = row.children[index].innerText.trim();
      const num = parseFloat(cell); //If it is a number, return it as a number so numeric sorting works correctly.
      return isNaN(num) ? cell : num; //If not (like "Unknown" or "Winter"), return it as a string for alphabetical sorting.
    };

    const sortTable = (columnIndex, key) => {
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));
    
      //Trying to determine the sort direction here:
      const isAsc = sortState[key] === "asc";
      sortState = { [key]: isAsc ? "desc" : "asc" }; //If the column is already sorted ascending, I am switching it to descending.
      const modifier = sortState[key] === "asc" ? 1 : -1; //modifier will multiply the comparison result to reverse the order if needed. It is like a shortcut that avoids writing extra 'if' statements or temporary variables to flip the sort order. It is being used below (Had to take help from the internet to build this short code).

      rows.sort((a, b) => {
        const aVal = getCellValue(a, columnIndex);
        const bVal = getCellValue(b, columnIndex);
        if (typeof aVal === "number" && typeof bVal === "number")
          return (aVal - bVal) * modifier; //Subtracting numeric values for correct ascending/descending order.
        return aVal.toString().localeCompare(bVal.toString()) * modifier; //Sorting strings alphabetically using .localeCompare. (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
      });

      tbody.innerHTML = ""; //Clearing the <tbody> and reattaching the rows in new order.
      rows.forEach((r) => tbody.appendChild(r));

      //Updating the indicators present in the table headers
      document.querySelectorAll(".sort-indicator").forEach((el) => (el.textContent = "⇅")); //Resetting all arrows to the default
      const active = document.querySelector(`.sort-indicator[data-key="${key}"]`);
      if (active) active.textContent = sortState[key] === "asc" ? "↑" : "↓"; //Updating the clicked column’s indicator to show the current sort direction ('up arrow' for ascending, 'down arrow' for descending).
    };

    table.querySelectorAll("th").forEach((th, index) => { 
      const key = th.dataset.key;
      th.addEventListener("click", () => sortTable(index, key)); //So here, I am add click listener for each table header because this is where the user would be clicking to sort the table.
    });
}

// This function is what will be called from the script.js file. 
export default function renderTableView(data) {
  const html = showTable(data);

  const container = document.getElementById("data-display");
  container.innerHTML = html;
  
  const table = document.getElementById("marsTable");
  if (table) {
    const parent = document.createElement("div");
    parent.className = "table-container"; 
    table.parentNode.insertBefore(parent, table);
    parent.appendChild(table);
  }

  attachSorting(table);

  return html;
}