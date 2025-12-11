import { loadQuoteOfTheDay, loadQuotes } from "./editable_js/load_quote.js";
import { fadeInQuote, addLandingChevrons } from "./editable_js/gsap.js";
import { showMoodPage } from "./editable_js/mood.js";
import { closeMoodDetails } from "./editable_js/mood_detail.js";

//-------------- Function to update the main content part of the landing page where the random quote loads.--------------
function updateContent(id, content) {
  const el = document.getElementById(id);
  if (!el) {
    console.error(`updateContent: Element #${id} not found`);
    return;
  }
  el.innerHTML = content;
}

// --------------- Helper functions --------------------
function showLoading(id = "app") {
  updateContent(id, `<div class="loading">Loading...</div>`);
}

function showError(id = "app", message = "Something went wrong.") {
  updateContent(
    id,
    `
    <div class="error">
      <h3>Error</h3>
      <p>${message}</p>
      <button onclick="location.reload()">Try Again</button>
    </div>
    `
  );
}


// ---------------------- These functions handle the active menu when the user toggles between 'Home' and 'Mood' pages. -----------
export function setActiveNav(id) {
  document.querySelectorAll(".nav-links a")
    .forEach(link => link.classList.remove("active"));

  document.getElementById(id).classList.add("active");
}

export function showHomeSection() {
  document.getElementById("home-section").classList.remove("hidden");
  document.getElementById("mood-section").classList.add("hidden");
  const moodSection = document.getElementById("mood-section");
  moodSection.style.display = "none"
  document.querySelector(".chevron").classList.remove("hidden");
}

export function showMoodSection() {
  document.getElementById("mood-section").classList.remove("hidden");
  document.getElementById("home-section").classList.add("hidden");
  document.querySelector(".chevron").classList.add("hidden");
}

document.getElementById("nav-home").addEventListener("click", (e) => {
  e.preventDefault();
  setActiveNav("nav-home");
  closeMoodDetails();
  showHomeSection();
});

document.getElementById("nav-mood").addEventListener("click", async (e) => {
  e.preventDefault();
  setActiveNav("nav-mood");
  showMoodSection();
  await showMoodPage();
});


// --------------- For mobile version, when the user navigates from one menu to another. This change the active state.
export function setActiveMobileNav(id) {
    document.querySelectorAll("#mobile-menu a")
        .forEach(link => link.classList.remove("active"));

    document.getElementById(id).classList.add("active");
}

document.getElementById("mobile-home").addEventListener("click", (e) => {
    e.preventDefault();
    setActiveMobileNav("mobile-home");  
    setActiveNav("nav-home");           
    closeMoodDetails();
    showHomeSection();
    closeMobileMenu();               
});

document.getElementById("mobile-mood").addEventListener("click", async (e) => {
    e.preventDefault();
    setActiveMobileNav("mobile-mood");
    setActiveNav("nav-mood");
    showMoodSection();
    await showMoodPage();
    closeMobileMenu();
});

function closeMobileMenu() {
    menuOpen = false;
    gsap.to(mobileMenu, { y: -50, opacity: 0, pointerEvents: "none", duration: 0.4 });
    gsap.to(hamburgerIcon, { opacity: 1, duration: 0.3 });
    gsap.to(crossIcon, { opacity: 0, duration: 0.3 });
}

// ------------------- Initialize the landing page (Random Quotes on each refresh) -----------------------
async function initLandingPage() {
  console.log("Loading Quote of the Day...");

  showLoading("quote-container");

  try {
    const data = await loadQuoteOfTheDay(); 
    const quoteObj = data[0]; // because API returns an array and the quote is stored at index 0.
    console.log("Quote object:", quoteObj);

    const quoteText = quoteObj.quote;
    const quoteAuthor = quoteObj.author;

    updateContent(
      "quote-container",
      `
      <div class="quote-box">
        <p class="quote-text">${quoteText}</p>
        <p class="quote-author">— ${quoteAuthor}</p>
      </div>
      `
    );

    // I am calling the function to animate the quote text and also the gsap animated chevrons at the bottom
    addLandingChevrons();
    fadeInQuote("quote-container");

  } catch (error) {
    console.error("Failed to load quote:", error);
    showError("quote-container", "Unable to load today's quote.");
  }
}

// ----------------- Handling the mobile mode navigation menu active states. ------------------------
function initializeMobileNavState() {
  const homeVisible = !document.getElementById("home-section").classList.contains("hidden");

  const mobileHome = document.getElementById("mobile-home");
  const mobileMood = document.getElementById("mobile-mood");

  if (!mobileHome || !mobileMood) return;

  if (homeVisible) {
    mobileHome.classList.add("active");
    mobileMood.classList.remove("active");
  } else {
    mobileMood.classList.add("active");
    mobileHome.classList.remove("active");
  }
}

// ----------------------- THE MAIN FUNCTIONS BEING CALLED TO LOAD THE FIRST PAGE ---------------------
document.addEventListener("DOMContentLoaded", async () => {
  console.log("MoodScape starting...");

  // Initializing the landing page here
  await initLandingPage();
  initializeMobileNavState();

  console.log("MoodScape is ready!");
});

// --------------------- Functions for the hamburger menu animation and handling of hamburger to cross icon in the mobile mode. ----------------
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");
const hamburgerIcon = document.getElementById("hamburger-icon");
const crossIcon = document.getElementById("cross-icon");

let menuOpen = false;

hamburgerBtn.addEventListener("click", () => {
    menuOpen = !menuOpen;

    // Menu animation (how menu glides from top and glides back on closing it)
    if (menuOpen) {
        gsap.to(mobileMenu, { y: 0, opacity: 1, pointerEvents: "auto", duration: 0.5, ease: "power2.out" });
    } else {
        gsap.to(mobileMenu, { y: -50, opacity: 0, pointerEvents: "none", duration: 0.5, ease: "power2.in" });
    }

    // Crossfade SVG icons when the menu opens up from the top
    if (menuOpen) {
        gsap.to(hamburgerIcon, { opacity: 0, duration: 0.3 });
        gsap.to(crossIcon, { opacity: 1, duration: 0.3 });
    } else {
        gsap.to(hamburgerIcon, { opacity: 1, duration: 0.3 });
        gsap.to(crossIcon, { opacity: 0, duration: 0.3 });
    }
});
