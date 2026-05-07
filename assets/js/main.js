(() => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.toggleAttribute("data-open", !expanded);
    });
  }

  const megaRoot = document.querySelector("[data-mega]");
  const megaToggle = document.querySelector("[data-mega-toggle]");
  const megaPanel = document.querySelector("[data-mega-panel]");
  if (megaRoot && megaToggle && megaPanel) {
    const closeMega = () => megaToggle.setAttribute("aria-expanded", "false");
    const openMega = () => megaToggle.setAttribute("aria-expanded", "true");

    megaToggle.addEventListener("click", () => {
      const expanded = megaToggle.getAttribute("aria-expanded") === "true";
      if (expanded) closeMega();
      else openMega();
    });

    document.addEventListener("click", (e) => {
      if (!megaRoot.contains(e.target)) closeMega();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMega();
    });
  }
})();
