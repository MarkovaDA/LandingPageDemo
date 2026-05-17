(function () {
  const mqDesktop = window.matchMedia("(min-width: 900px)");
  const MOBILE_PAGES = [[0, 1], [2], [3, 4], [5], [6]];

  function initStages() {
    const root = document.querySelector('[data-carousel="stages"]');
    if (!root) return;

    const viewport = root.querySelector(".carousel__viewport");
    const track = root.querySelector(".stages__grid");
    const prev = root.querySelector(".carousel__btn--prev");
    const next = root.querySelector(".carousel__btn--next");
    const counter = root.querySelector("[data-counter]");
    const dotsRoot = root.querySelector("[data-stages-dots]");
    const cards = track
      ? [...track.querySelectorAll(".stage-card")].sort(
          (a, b) => Number(a.dataset.index) - Number(b.dataset.index)
        )
      : [];

    const cardByIndex = new Map(
      cards.map((card) => [Number(card.dataset.index), card])
    );

    let page = 0;
    let mobileGrouped = false;
    let slideElements = [];

    function isMobileMode() {
      return !mqDesktop.matches;
    }

    function getMobilePageCount() {
      return MOBILE_PAGES.length;
    }

    function groupForMobile() {
      if (!track) return;
      if (mobileGrouped && slideElements.length === MOBILE_PAGES.length) return;
      if (mobileGrouped) ungroupForDesktop();

      MOBILE_PAGES.forEach((indices) => {
        const slide = document.createElement("div");
        slide.className = "stages__slide";

        indices.forEach((index) => {
          const card = cardByIndex.get(index);
          if (card) slide.appendChild(card);
        });

        track.appendChild(slide);
        slideElements.push(slide);
      });

      mobileGrouped = true;
    }

    function ungroupForDesktop() {
      if (!track || !mobileGrouped) return;

      cards.forEach((card) => track.appendChild(card));
      slideElements.forEach((slide) => slide.remove());
      slideElements = [];
      mobileGrouped = false;
    }

    function syncDots() {
      if (!dotsRoot) return;

      if (!isMobileMode()) {
        dotsRoot.innerHTML = "";
        return;
      }

      const total = getMobilePageCount();

      if (dotsRoot.children.length !== total) {
        dotsRoot.replaceChildren();
        for (let i = 0; i < total; i += 1) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "carousel__dot";
          button.setAttribute("role", "tab");
          button.setAttribute("aria-label", `Слайд ${i + 1}`);
          button.addEventListener("click", () => {
            page = i;
            update();
          });
          dotsRoot.appendChild(button);
        }
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

    function resetMobileStyles() {
      if (!track) return;
      if (viewport) viewport.style.height = "";
      track.style.transform = "";
      track.style.width = "";
      track.style.height = "";
      track.style.display = "";
      track.style.gridTemplateColumns = "";
      track.style.gridAutoColumns = "";
      slideElements.forEach((slide) => {
        slide.style.flex = "";
        slide.style.width = "";
        slide.style.height = "";
      });
    }

    function update() {
      if (!viewport || !track || !counter) return;

      if (!isMobileMode()) {
        ungroupForDesktop();
        resetMobileStyles();
        if (prev) prev.disabled = true;
        if (next) next.disabled = true;
        counter.textContent = `${cards.length} этапов`;
        syncDots();
        return;
      }

      groupForMobile();

      const slideWidth = viewport.clientWidth;
      const total = getMobilePageCount();

      track.style.display = "flex";
      track.style.width = `${total * slideWidth}px`;

      const slideHeight = viewport.clientHeight;

      slideElements.forEach((slide) => {
        slide.style.flex = `0 0 ${slideWidth}px`;
        slide.style.width = `${slideWidth}px`;
        slide.style.height = `${slideHeight}px`;
      });

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
