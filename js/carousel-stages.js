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

    function update() {
      if (!viewport || !track || !counter) return;

      if (!isMobileMode()) {
        track.style.transform = "";
        cards.forEach((c) => {
          c.style.flexBasis = "";
          c.style.minWidth = "";
        });
        if (prev) prev.disabled = true;
        if (next) next.disabled = true;
        counter.textContent = `${cards.length} этапов`;
        return;
      }

      const w = viewport.offsetWidth;
      cards.forEach((c) => {
        c.style.flexBasis = `${w}px`;
        c.style.minWidth = `${w}px`;
      });

      const total = cards.length;
      page = Math.max(0, Math.min(page, total - 1));
      const offset = page * w;
      track.style.transform = `translateX(${-offset}px)`;
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
