(function () {
  const mobileQuery = window.matchMedia("(max-width: 899px)");

  function updateEllipsePosition() {
    const ellipse = document.querySelector(".hero__ellipse");
    const button = document.querySelector(".hero__actions .btn--primary");
    const header = document.querySelector("header.header");
    const ticker = document.querySelector(".hero > .ticker");

    if (!ellipse || !header) return;

    if (!mobileQuery.matches || !button) {
      ellipse.style.removeProperty("--hero-ellipse-top");
      header.style.removeProperty("--hero-ticker-height");
      return;
    }

    const top =
      button.getBoundingClientRect().top - header.getBoundingClientRect().top;

    ellipse.style.setProperty("--hero-ellipse-top", `${Math.round(top)}px`);

    if (ticker) {
      header.style.setProperty("--hero-ticker-height", `${ticker.offsetHeight}px`);
    }
  }

  updateEllipsePosition();
  window.addEventListener("resize", updateEllipsePosition);
  window.addEventListener("load", updateEllipsePosition);

  if (document.fonts?.ready) {
    document.fonts.ready.then(updateEllipsePosition);
  }

  mobileQuery.addEventListener("change", updateEllipsePosition);
})();
