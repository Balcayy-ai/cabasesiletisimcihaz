(() => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  if (nav && navToggle) {
    const closeNav = () => {
      navToggle.setAttribute("aria-expanded", "false");
      nav.removeAttribute("data-open");
    };

    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.toggleAttribute("data-open", !expanded);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  const megaRoot = document.querySelector("[data-mega]");
  const megaToggle = document.querySelector("[data-mega-toggle]");
  if (megaRoot && megaToggle) {
    const closeMega = () => {
      megaRoot.removeAttribute("data-open");
      megaToggle.setAttribute("aria-expanded", "false");
    };

    const openMega = () => {
      megaRoot.setAttribute("data-open", "");
      megaToggle.setAttribute("aria-expanded", "true");
    };

    megaToggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = megaRoot.hasAttribute("data-open") || megaToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMega();
      else openMega();
    });

    document.addEventListener("click", (e) => {
      if (!megaRoot.contains(e.target)) closeMega();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMega();
    });

    const tabs = megaRoot.querySelectorAll("[data-mega-tab]");
    const panels = megaRoot.querySelectorAll("[data-mega-content]");

    const setMegaTab = (id) => {
      tabs.forEach((tab) => {
        const on = tab.getAttribute("data-mega-tab") === id;
        tab.classList.toggle("is-active", on);
        tab.setAttribute("aria-selected", String(on));
      });
      panels.forEach((panel) => {
        const on = panel.getAttribute("data-mega-content") === id;
        panel.hidden = !on;
      });
    };

    tabs.forEach((tab) => {
      const id = tab.getAttribute("data-mega-tab");
      if (!id) return;
      tab.addEventListener("click", () => setMegaTab(id));
      tab.addEventListener("mouseenter", () => {
        if (window.matchMedia("(min-width: 861px)").matches) setMegaTab(id);
      });
    });

    if (tabs.length) {
      const first = tabs[0].getAttribute("data-mega-tab");
      if (first) setMegaTab(first);
    }
  }

  const faqRoot = document.querySelector("[data-faq]");
  if (faqRoot) {
    const items = [...faqRoot.querySelectorAll(".faq-acc-item")];

    const setExpanded = (item, open) => {
      const btn = item.querySelector(".faq-acc-trigger");
      if (btn) btn.setAttribute("aria-expanded", String(open));
      item.classList.toggle("is-open", open);
    };

    const closeAll = () => {
      items.forEach((i) => setExpanded(i, false));
    };

    const openOne = (item) => {
      closeAll();
      setExpanded(item, true);
    };

    items.forEach((item) => {
      const btn = item.querySelector(".faq-acc-trigger");
      if (!btn) return;
      btn.addEventListener("click", () => {
        if (item.classList.contains("is-open")) {
          setExpanded(item, false);
        } else {
          openOne(item);
        }
      });
    });

    const applyHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      const item = el.closest(".faq-acc-item");
      if (item) openOne(item);
      else closeAll();
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
  }
})();
