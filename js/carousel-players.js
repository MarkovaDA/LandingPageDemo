(function () {
  const mqDesktop = window.matchMedia("(min-width: 900px)");

  function initPlayers() {
    const root = document.querySelector('[data-carousel="players"]');
    if (!root) return;

    const viewport = root.querySelector(".players__viewport");
    const track = root.querySelector(".players__track");
    const cards = track ? [...track.children] : [];
    const prev = document.querySelector("[data-players-prev]");
    const next = document.querySelector("[data-players-next]");
    const counter = document.querySelector("[data-players-counter]");

    let page = 0;

    function slidesPerView() {
      return mqDesktop.matches ? 3 : 1;
    }

    function totalPages() {
      if (!cards.length) return 1;
      const spv = slidesPerView();
      return Math.max(1, Math.ceil(cards.length / spv));
    }

    function update() {
      if (!viewport || !track || !counter) return;

      const vw = viewport.offsetWidth;
      const gap = 20;
      const spv = slidesPerView();

      if (spv === 1) {
        cards.forEach((c) => {
          c.style.flexBasis = `${vw}px`;
          c.style.minWidth = `${vw}px`;
          c.style.maxWidth = `${vw}px`;
        });
      } else {
        const basis = (vw - gap * (spv - 1)) / spv;
        cards.forEach((c) => {
          c.style.flexBasis = `${basis}px`;
          c.style.minWidth = `${basis}px`;
          c.style.maxWidth = `${basis}px`;
        });
      }

      const tp = totalPages();
      page = Math.max(0, Math.min(page, tp - 1));
      const offset = page * vw;
      track.style.transform = `translateX(${-offset}px)`;
      counter.textContent = `${page + 1} / ${tp}`;
      if (prev) prev.disabled = page === 0;
      if (next) next.disabled = page >= tp - 1;
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

  initPlayers();
})();
