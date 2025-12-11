import { loadQuotes } from "./load_quote.js";

// ------------------ Loading the entire set of mood quotes first. -----------------------
async function loadMoodQuote(moodName) {
    try {
        const allQuotes = await loadQuotes();
        const filteredQuotes = allQuotes.filter(q => q.categories.includes(moodName)); // Here, I am filtering quotes where categories include the mood (like happy, sad etc.)
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]; // Since all quotes have multiple categories. I am randomly picking one out of the filtered ones.
        console.log("your filtered quote: ", randomQuote);
        return randomQuote || { q: "No quote available", a: "" };
    } catch (err) {
        console.error("Failed to load mood quote:", err);
        return { q: "No quote available due to error.", a: "" };
    }
}

// -------------------- Mapping the different moods with respective audio and background images. -----------------
const moodAssets = {
    happy: {
        music: "editable_js/music/happy.mp3",
        bg: "editable_js/backgrounds/happy.jpg"
    },
    sad: {
        music: "editable_js/music/sad.mp3",
        bg: "editable_js/backgrounds/sad.jpg"
    },
    anxious: {
        music: "editable_js/music/anxious.mp3",
        bg: "editable_js/backgrounds/anxious.jpg"
    },
    grateful: {
        music: "editable_js/music/grateful.mp3",
        bg: "editable_js/backgrounds/grateful.jpg"
    },
    calm: {
        music: "editable_js/music/calm.mp3",
        bg: "editable_js/backgrounds/calm.jpg"
    },
    frustrated: {
        music: "editable_js/music/frustrated.mp3",
        bg: "editable_js/backgrounds/frustrated.jpg"
    },
    lonely: {
        music: "editable_js/music/lonely.mp3",
        bg: "editable_js/backgrounds/lonely.jpg"
    }
};

// --------------------- This is the main function which will be called when user selects a mood -----------------------------
export async function openMoodDetails(moodName) {
    const page = document.getElementById("mood-detail-page");
    const playPauseBtn = document.getElementById("play-pause-btn");
    document.body.style.overflow = "hidden";

    page.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.4)), url(${moodAssets[moodName].bg})`; // Setting the background dynamically since each mood will have its own background.

    const moodNameCapitalized = moodName.charAt(0).toUpperCase() + moodName.slice(1); // Setting the title inside the breadcrumb
    document.getElementById("mood-title").innerHTML = `Mood <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9c9999"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg> <span class="mood-title-active">${moodNameCapitalized}</span>`;

    try {
        const quoteText = await loadMoodQuote(moodName);
        console.log("received filtered quote in openMoodDetails function", quoteText);
        const quoteContainer = document.getElementById("mood-quote");
        if (quoteContainer) {
            quoteContainer.innerHTML = `
            <p class="mood-detail-quote">${quoteText.q}</p>
            <p class="quote-author">— ${quoteText.a}</p>
        `;
        }
    } catch (err) {
        console.error("Failed to load mood quote:", err);
    }

    setTimeout(() => {
        page.classList.add("show");
        page.classList.remove("hidden");
    }, 10);

    loadWaveform(moodAssets[moodName].music); // Loading the Wavesurfer.js to play the music

    wavesurfer.on("ready", () => {
        wavesurfer.play();
        playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M564-228v-504h168v504H564Zm-336 0v-504h168v504H228Z"/></svg>Pause`; // update button state
    });
    
    // This will change the button instances from play to pause and vice-versa upon user's interaction.
    playPauseBtn.onclick = () => {
        if (wavesurfer) {
            if (wavesurfer.isPlaying()) {
                wavesurfer.pause();
                playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="white"><path d="M320-200v-560l440 280-440 280Z"/></svg>Play`;
            } else {
                wavesurfer.play();
                playPauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M564-228v-504h168v504H564Zm-336 0v-504h168v504H228Z"/></svg>Pause`;
            }
        }
    };

    // Passing the arguments to setup the knobs for volume and speed since they will already have a certain volume and speed
    bindKnobProgress(
        "volume-knob",   // wrapper ID
        0,               // min volume
        1,               // max volume
        0.3,             // initial value
        (val, rawAngle) => {
            const percent = rawAngle / 270;       // reverse mapping
            const v = 0.1 + percent * 0.9;
            if (wavesurfer) wavesurfer.setVolume(v);
        }
        
    );

    bindKnobProgress("speed-knob", 0, 1, 0.5, (val) => {
        const speed = 0.5 + val * 1.5;
        if (wavesurfer) wavesurfer.setPlaybackRate(speed);
    });


    const journalBox = document.getElementById("journal-input"); // this will automatically save the journal entry.

    journalBox.value = localStorage.getItem(`journal_${moodName}`) || ""; // Loading any previous entry (if it exists)

    journalBox.oninput = () => {
        localStorage.setItem(`journal_${moodName}`, journalBox.value); // this will auto-save while the user will be  typing
    }; 

    setTimeout(() => {
        animateMoodDetails(); // loading the gsap animations. Function is defined at the bottom.
    }, 50); 

    document.getElementById("back-btn").onclick = () => {
        closeMoodDetails();  // calling the function for the back button beside the breadcrumb in the nav.
    };

}

// ------------------ This is the function where the knob indicator, progress indicator and the song speed and volume are mapped. -----------------------------
function bindKnobProgress(knobWrapperId, minValue, maxValue, initialValue, callback) {
    const wrapper = document.getElementById(knobWrapperId);
    const knob = wrapper.querySelector(".knob");
    const indicator = wrapper.querySelector(".indicator");
    const progressRing = wrapper.querySelector(".progress-ring");

    let isDragging = false;

    let currentAngle = (initialValue - minValue) / (maxValue - minValue) * 270; // Converting the initialValue to angle (0–270).

    // Applying initial visual states
    indicator.style.transform = `rotate(${currentAngle}deg)`;
    progressRing.style.background = `conic-gradient(#0A3D51 0deg ${currentAngle}deg, rgba(0,0,0,0.1) ${currentAngle}deg 360deg)`;

    const getAngleFromMouse = (e) => {
        const rect = wrapper.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI); // Raw angle

        angle = angle + 90; // Convert to 0° at top

        if (angle < 0) angle += 360; // Normalizing 0–360°

        if (angle > 270) angle = 270; // Clamping to 0–270° beyond which the knob won't rotate. Easier to didive the angles and the speed/volume rate as well.

        return angle;
    };

    knob.addEventListener("mousedown", () => {
        isDragging = true;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        currentAngle = getAngleFromMouse(e);
        const percent = currentAngle / 270;
        const value = minValue + percent * (maxValue - minValue);

        // Updating the knob + ring when the user rotates
        indicator.style.transform = `rotate(${currentAngle}deg)`;
        progressRing.style.background = `conic-gradient(#0A3D51 0deg ${currentAngle}deg, rgba(0,0,0,0.1) ${currentAngle}deg 360deg)`;
        
        callback(value, currentAngle);  
    });
}


// --------------------- This function helps in closing the Mood Details page when the user either clicks on back button or when the user clicks on the Home button in top nav bar. ------------------
export function closeMoodDetails() {
    const page = document.getElementById("mood-detail-page");
    if (!page) return;

    page.classList.remove("show");
    document.body.style.overflow = ""; // restore scrolling on the mood page, if the user clicks on back button from the breadcrumb.

    // Stop and destroy Wavesurfer if it's running
    if (wavesurfer) {
        wavesurfer.stop();
        wavesurfer.destroy();
        wavesurfer = null;
    }

    setTimeout(() => {
        page.classList.add("hidden");
    }, 500);
}


// ------------------- This is where I am using the Wavesurfer.js instances to display the waveform on the screen -----------------
let wavesurfer;
function loadWaveform(audioPath) {
    if (wavesurfer) wavesurfer.destroy();

    wavesurfer = WaveSurfer.create({
        container: "#waveform",
        height: 100,
        barWidth: 2,
        responsive: true
    });

    wavesurfer.load(audioPath);

    wavesurfer.on("ready", () => {
        wavesurfer.play();
    });

    wavesurfer.on("finish", () => {
        wavesurfer.play(); // this will keep the song looping endlessly
    });
}


// ----------------- I have defined all the GSAP animations related to this page here. ---------------------
function animateMoodDetails() {
    const quoteEl = document.getElementById("mood-quote");
    const waveformEl = document.getElementById("waveform");
    const musicControlsEl = document.querySelector(".ipod-player");
    const accordionEl = document.querySelector(".journal-section");

    // First making sure that the elements exist
    if (!quoteEl || !waveformEl || !musicControlsEl || !accordionEl) return;

    const tl = gsap.timeline();
    tl.from(quoteEl, {
        opacity: 0,
        y: 40,
        filter: "blur(6px)",
        duration: 1.8,
        ease: "power2.out"
    });

    tl.from(musicControlsEl, {
        opacity: 0,
        y: 30,
        filter: "blur(6px)",
        duration: 1.4,
        ease: "power2.out"
    }, "+=0.3");

    tl.from(waveformEl, {
        opacity: 0,
        y: 30,
        filter: "blur(6px)",
        duration: 1.4,
        ease: "power2.out"
    }, "+=0.1"); 

    tl.from(accordionEl, {
        opacity: 0,
        y: 30,
        filter: "blur(6px)",
        duration: 1.4,
        ease: "power2.out"
    }, "+=0.3");

    console.log("GSAP animations triggered for mood details");
}