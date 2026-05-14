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

    const flyRoots = megaRoot.querySelectorAll("[data-mega-fly]");
    const closeFlyouts = () => {
      flyRoots.forEach((fly) => {
        fly.classList.remove("is-open");
        const b = fly.querySelector(".mega-fly-trigger");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    };

    const closeMegaAll = () => {
      closeMega();
      closeFlyouts();
    };

    megaToggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = megaRoot.hasAttribute("data-open") || megaToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMegaAll();
      else openMega();
    });

    document.addEventListener("click", (e) => {
      if (!megaRoot.contains(e.target)) closeMegaAll();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMegaAll();
    });

    const tabs = megaRoot.querySelectorAll("[data-mega-tab]");
    const panels = megaRoot.querySelectorAll("[data-mega-content]");

    const setMegaTab = (id) => {
      closeFlyouts();
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

    flyRoots.forEach((fly) => {
      const btn = fly.querySelector(".mega-fly-trigger");
      if (!btn) return;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.matchMedia("(min-width: 861px)").matches) return;
        e.preventDefault();
        const wasOpen = fly.classList.contains("is-open");
        closeFlyouts();
        if (!wasOpen) {
          fly.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeFlyouts();
    });
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

  const waLeadForm = document.querySelector("[data-wa-lead-form]");
  if (waLeadForm) {
    const telInput = waLeadForm.querySelector("#wa-tel");
    waLeadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!waLeadForm.checkValidity()) {
        waLeadForm.reportValidity();
        return;
      }
      const phoneRaw = telInput ? String(telInput.value || "") : "";
      const digits = phoneRaw.replace(/\D/g, "");
      if (digits.length < 10) {
        if (telInput) {
          telInput.setCustomValidity("Lütfen en az 10 rakam içeren geçerli bir telefon girin.");
          telInput.reportValidity();
          telInput.setCustomValidity("");
        }
        return;
      }
      const fd = new FormData(waLeadForm);
      const ad = String(fd.get("ad") || "").trim();
      const soyad = String(fd.get("soyad") || "").trim();
      const sehir = String(fd.get("sehir") || "").trim();
      const waPhone = String(waLeadForm.getAttribute("data-wa-phone") || "905387137283").replace(/\D/g, "");
      const lines = [
        "Merhaba,",
        "",
        "Web sitesi iletişim formundan yazıyorum:",
        "",
        `Ad: ${ad}`,
        `Soyad: ${soyad}`,
        `Telefon: ${phoneRaw.trim()}`,
        `Yaşadığım şehir: ${sehir}`,
      ];
      const text = encodeURIComponent(lines.join("\n"));
      const url = `https://wa.me/${waPhone}?text=${text}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector("[data-carousel-track]");
    const slides = track
      ? [...track.querySelectorAll("[data-carousel-slide]")]
      : [...root.querySelectorAll("[data-carousel-slide]")];
    const dots = [...root.querySelectorAll("[data-carousel-dot]")];
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    const intervalRaw = root.getAttribute("data-carousel-interval");
    const intervalMs = intervalRaw != null && intervalRaw !== "" ? Number(intervalRaw) : 0;

    if (!slides.length) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const n = slides.length;
    const canInert = "inert" in HTMLElement.prototype;

    if (track) {
      track.style.setProperty("--cab-n", String(n));
    }

    let index = slides.findIndex((el) => el.classList.contains("is-active"));
    if (index < 0) index = 0;

    let autoplayTimer = null;

    function clearAutoplay() {
      if (autoplayTimer != null) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      clearAutoplay();
      if (!Number.isFinite(intervalMs) || intervalMs < 800) return;
      if (motionQuery.matches) return;
      if (document.visibilityState === "hidden") return;
      autoplayTimer = window.setInterval(() => {
        show(index + 1);
      }, intervalMs);
    }

    function show(i) {
      const nextIndex = ((i % n) + n) % n;
      index = nextIndex;

      if (track) {
        track.style.setProperty("--cab-i", String(index));
      }

      slides.forEach((slide, j) => {
        const on = j === index;
        slide.classList.toggle("is-active", on);
        slide.setAttribute("aria-hidden", String(!on));
        if (canInert) slide.toggleAttribute("inert", !on);
      });
      dots.forEach((dot, j) => {
        dot.classList.toggle("is-active", j === index);
      });

      startAutoplay();
    }

    prevBtn?.addEventListener("click", () => show(index - 1));
    nextBtn?.addEventListener("click", () => show(index + 1));
    dots.forEach((dot, j) => {
      dot.addEventListener("click", () => show(j));
    });

    root.addEventListener("mouseenter", clearAutoplay);
    root.addEventListener("mouseleave", startAutoplay);
    root.addEventListener("focusin", clearAutoplay);
    root.addEventListener("focusout", (e) => {
      const next = e.relatedTarget;
      if (next instanceof Node && root.contains(next)) return;
      window.requestAnimationFrame(() => {
        if (root.contains(document.activeElement)) return;
        startAutoplay();
      });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") clearAutoplay();
      else startAutoplay();
    });

    const onMotionChange = () => {
      clearAutoplay();
      startAutoplay();
    };
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", onMotionChange);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(onMotionChange);
    }

    show(index);
  });
})();
