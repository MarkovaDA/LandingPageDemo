(function () {
  const mqDesktop = window.matchMedia("(min-width: 900px)");

  function initStages() {
    const root = document.querySelector('[data-carousel="stages"]');
    if (!root) return;

    const viewport = root.querySelector(".carousel__viewport");
    const track = root.querySelector(".stages__grid");
    const prev = root.querySelector(".carousel__btn--prev");
    const next = root.querySelector(".carousel__btn--next");
    const counter = root.querySelector("[data-counter]");
    const dotsRoot = root.querySelector("[data-stages-dots]");
    const cards = track ? [...track.querySelectorAll(".stage-card")] : [];

    let page = 0;

    function syncDots() {
      if (!dotsRoot) return;
      if (!isMobileMode()) {
        dotsRoot.innerHTML = "";
        return;
      }

      if (dotsRoot.children.length !== cards.length) {
        dotsRoot.replaceChildren();
        cards.forEach((_, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "carousel__dot";
          b.setAttribute("role", "tab");
          b.setAttribute("aria-label", `Слайд ${i + 1}`);
          b.addEventListener("click", () => {
            page = i;
            update();
          });
          dotsRoot.appendChild(b);
        });
      }

      [...dotsRoot.children].forEach((btn, i) => {
        const active = i === page;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
        if (active) {
          btn.setAttribute("aria-current", "true");
        } else {
          btn.removeAttribute("aria-current");
        }
      });
    }

    function isMobileMode() {
      return !mqDesktop.matches;
    }

    function resetMobileStyles() {
      if (!track) return;
      track.style.transform = "";
      track.style.width = "";
      track.style.gridTemplateColumns = "";
      track.style.gridAutoColumns = "";
    }

    function update() {
      if (!viewport || !track || !counter) return;

      if (!isMobileMode()) {
        resetMobileStyles();
        if (prev) prev.disabled = true;
        if (next) next.disabled = true;
        counter.textContent = `${cards.length} этапов`;
        syncDots();
        return;
      }

      const slideWidth = viewport.clientWidth;
      const total = cards.length;

      track.style.gridAutoColumns = `${slideWidth}px`;
      track.style.width = `${total * slideWidth}px`;

      page = Math.max(0, Math.min(page, total - 1));
      track.style.transform = `translateX(${-page * slideWidth}px)`;
      counter.textContent = `${page + 1} / ${total}`;
      if (prev) prev.disabled = page === 0;
      if (next) next.disabled = page >= total - 1;
      syncDots();
    }

    prev?.addEventListener("click", () => {
      page -= 1;
      update();
    });
    next?.addEventListener("click", () => {
      page += 1;
      update();
    });
    mqDesktop.addEventListener("change", () => {
      page = 0;
      update();
    });
    window.addEventListener("resize", update);
    update();
  }

  function initAirplane() {
    const plane = document.querySelector(".airplane");
    const section = document.querySelector(".section--stages");
    if (!plane || !section) return;

    const show = () => plane.classList.add("airplane--visible");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(section);
  }

  initStages();
  initAirplane();
})();
