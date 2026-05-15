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
    const cards = track ? [...track.querySelectorAll(".stage-card")] : [];

    let page = 0;

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

  initStages();
})();
