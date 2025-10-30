// ============================================
// DATA LOADING
// ============================================
async function loadData() {
  try {
    const response = await fetch(
      'https://api.nasa.gov/insight_weather/?api_key=90hYrvvtAGtj1qmpeDnHRSVhw3fjzKOzZbYVBKyg&feedtype=json&ver=1.0'
    );
    const data = await response.json();
    console.log("data loaded", data);

    const sols = data.sol_keys; 
    const formatData = sols.map((sol) => {
      const solData = data[sol];
      return {
        sol: sol,
        converted_date: solData.First_UTC, // The actual JSON has 2 dates: First_UTC and Last_UTC to show 1 Martian Date from Earth's perspective. So, here, I am only saving the First_UTC in my array for later use.
        season: solData.Season,
        temperature: {
          avg: solData.AT?.av, // I am using this '?' as an optional here because NASA website itself said that the data would be inconsistent, especially, temperature or wind related data. So, I just wanted to make sure that if data is available, then display it, else return 'unknown' instead of thowing error (Hence, using '?' here). Also, I took help from MDN Docs for this: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
          min: solData.AT?.mn,
          max: solData.AT?.mx,
        },
        wind: {
          avg: solData.HWS?.av,
          direction: solData.WD?.most_common?.compass_point,
        },
        pressure: {
          avg: solData.PRE?.av,
          min: solData.PRE?.mn,
          max: solData.PRE?.mx,
        },
      };
    });

    console.log("Formatted Mars weather data:", formatData);

    return formatData;
  } 
  
  catch (error) {
    console.error("Failed to load data:", error);
    throw new Error("Could not load data from NASA API");
  }
}

export default loadData