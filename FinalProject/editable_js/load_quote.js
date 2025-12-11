const API_KEY = "ih2Ooc1rYN1IvwTHDItMWA==WWHTUxeob8NQhfvN";


// Fetch a single random quote for landing page from api-ninjas.com

export async function loadQuoteOfTheDay() {
  const url = "https://api.api-ninjas.com/v2/randomquotes"; 

  try {
    const response = await fetch(url, {
      headers: { 'X-Api-Key': API_KEY }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quote of the day: ${response.status}`);
    }

    const data = await response.json();
    console.log("Quote of the Day loaded:", data);
    return data; 

  } catch (error) {
    console.error("Error loading quote of the day:", error);
    throw error;
  }
}


// Fetch multiple quotes for Mood details page. I am using the local downloaded quotes due to CORS error for this particular request.

export async function loadQuotes() {
  const url = "./quotes.json"; 

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load local quotes file: ${response.status}`);
    }

    const data = await response.json(); 

    console.log("Local quotes loaded:", data);
    return data; 

  } catch (error) {
    console.error("Error loading local quotes:", error);
    throw error;
  }
}

