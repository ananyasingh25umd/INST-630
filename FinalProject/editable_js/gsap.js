
// Function to show the fade-in effect on the landing page quote of the day and the chevron at the bottom.
export function fadeInQuote(containerId) {
    const tl = gsap.timeline();

  // First, animate the quote
  tl.from(".quote-box", {
    opacity: 0,
    y: 30,
    filter: "blur(6px)",
    duration: 1.8,
    ease: "power2.out"
  });

  // Then, animate the chevrons 1 second after the quote starts
  tl.from(".scroll-chevrons", {
    opacity: 0,
    y: 20,
    duration: 2.0,
    ease: "power2.out"
  }, "+=1");
}

// Function to add chevrons dynamically to the landing page
export function addLandingChevrons() {
  const container = document.createElement("div");
  container.classList.add("scroll-chevrons");

  container.innerHTML = `
    <svg class="chevron" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#0A3D51"><path d="m282-216.39-47.74-47.98L480-510.11l245.74 245.74L678-216.39 480-414.63 282-216.39Zm0-258.5-47.74-47.74L480-768.61l245.74 245.98L678-474.89 480-673.13 282-474.89Z"/></svg>
  `;

  document.body.appendChild(container);

  // Calling the function here to animate the chevrons after adding them
  initChevronsAnimation();

  // Attaching the click event listener here, after chevrons exist
  container.addEventListener("click", () => {
    import("./mood.js").then(module => {
      module.showMoodPage();
    });
  });
}

// GSAP animation function for the pulse or that gliding effect on the bottom chevrons
export function initChevronsAnimation() {
  const chevrons = document.querySelectorAll(".scroll-chevrons .chevron");

  gsap.fromTo(
    chevrons,
    { y: 0, stroke: "#0A3D51f" },
    {
      y: -10,
      stagger: 0.2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 0.6,
    }
  );
}