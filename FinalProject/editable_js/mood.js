import { setActiveNav, showMoodSection } from "../script.js"; 
import { openMoodDetails } from "./mood_detail.js";
import { setActiveMobileNav } from "../script.js";

export function showMoodPage() {
    console.log("showMoodPage() started");

    // Changing the active nav in the top nav bar
    try {
        setActiveNav("nav-mood"); // to switch the active menu
        setActiveMobileNav("mobile-mood");
        console.log("setActiveNav executed");
    } catch (err) {
        console.error("setActiveNav failed:", err);
    }

    //  Switching to mood section so that I can display the content. this function comes from script.js
    try {
        showMoodSection();
        console.log("showMoodSection executed");
    } catch (err) {
        console.error("showMoodSection failed:", err);
    }

    //  Checking if the mood page container is loading or not. it wasn't at first, so adding checkpoints now to understand where the code is broken.
    const moodPage = document.getElementById("mood-section");
    console.log("moodPage =", moodPage);

    if (!moodPage) {
        console.error("mood-section not found!");
        return;
    }
    moodPage.style.display = "flex";
    moodPage.classList.remove("hidden");
    console.log("mood-section unhidden");

    //  Adding the description container
    const description = document.querySelector(".mood-description");
    console.log("description container =", description);

    if (!description) {
        console.error(".mood-description not found");
        return;
    }

    description.innerHTML = `
        <p class="mood-desc-text">MoodScape is your space to unwind and relax. Listen to soothing music, reflect, or jot down your thoughts to close your day peacefully. <em> So tell us, <strong>how are you feeling today?</strong></em></p>
    `;
    console.log("description inserted");

    // Adding the questions container
    const questionsContainer = document.querySelector(".mood-questions");
    console.log("questionsContainer =", questionsContainer);

    if (!questionsContainer) {
        console.error(".mood-questions not found");
        return;
    }

    questionsContainer.innerHTML = `
        
        <div class="mood-cards"></div>
    `;
    console.log("questions inserted");

    // Adding the cards container
    const cardsContainer = document.querySelector(".mood-cards");
    console.log("cardsContainer =", cardsContainer);

    if (!cardsContainer) {
        console.error(".mood-cards not created");
        return;
    }

    const moods = [
        { img: "happy.png", label: "Happy" },
        { img: "sad.png", label: "Sad" },
        { img: "grateful.png", label: "Grateful" },
        { img: "anxious.png", label: "Anxious" },
        { img: "calm.png", label: "Calm" },
        { img: "frustrated.png", label: "Frustrated" },
        { img: "lonely.png", label: "Lonely" },
    ];

    console.log("moods array:", moods);

    cardsContainer.innerHTML = moods.map(m => `
        <div class="bubble-wrapper">
            <div class="mood-card">
                <img src="editable_js/images/${m.img}" alt="${m.label}">
                <div class="mood-overlay">
                <div class="mood-label">${m.label}</div>
                </div>
            </div>
        </div>
    `).join("");

    console.log("mood cards generated");

    // Attach click events to mood cards
    setTimeout(() => {
        const moodCards = document.querySelectorAll(".mood-card");

        moodCards.forEach(card => {
            card.addEventListener("click", () => {
                const moodName = card.querySelector(".mood-label").textContent.trim().toLowerCase();
                console.log("Mood clicked:", moodName);

                // Call the detail page loader
                import("./mood_detail.js").then(module => {
                    module.openMoodDetails(moodName);
                });
            });
        });

        console.log("Mood card click events attached");
    }, 50);


    // GSAP animations
    try {
        const tl = gsap.timeline();
        tl.from("#mood-section", { opacity: 0, y: 40, duration: 0.8, ease: "power2.out" });
        tl.from(".mood-desc-text", { duration: 1.4, opacity: 0, y: 30, delay: 0.2, filter: "blur(6px)", ease: "power2.out" });
        tl.from(".bubble-wrapper", { duration: 1.5, opacity: 0, y: 20, delay: 0.7, filter: "blur(6px)", stagger: 0.2, ease: "power2.out" }, "+=0.1");
        console.log("GSAP animations triggered");
    } catch (err) {
        console.error("GSAP failed:", err);
    }

    console.log("showMoodPage() completed");
}

