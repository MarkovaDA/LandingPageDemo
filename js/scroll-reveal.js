(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const segmentSelectors = ".header, main .section, .footer";
  const sectionSelectors = [".section--lecture", ".section--stages", ".section--players", ".footer"];

  document.querySelectorAll(segmentSelectors).forEach((segment) => {
    segment.classList.add("scroll-segment");
  });

  sectionSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((section) => {
      section.classList.add("scroll-reveal");

      const container = section.querySelector(":scope > .container");
      if (!container) return;

      const children = Array.from(container.children);
      if (children.length < 2) return;

      section.classList.add("scroll-reveal--children-only");
      container.classList.add("scroll-reveal--stagger");
      children.forEach((child) => child.classList.add("scroll-reveal__item"));
    });
  });

  const revealTargets = document.querySelectorAll(".scroll-reveal");
  const segments = Array.from(document.querySelectorAll(segmentSelectors));

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    link.addEventListener("click", (event) => {
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      scrollToSegment(target);
      history.pushState(null, "", hash);
    });
  });

  if (!segments.length) return;

  let wheelLock = false;
  const wheelCooldownMs = 900;

  window.addEventListener(
    "wheel",
    (event) => {
      if (wheelLock || event.ctrlKey || Math.abs(event.deltaY) < 24) return;

      const currentIndex = getCurrentSegmentIndex();
      if (currentIndex === -1) return;

      const nextIndex =
        event.deltaY > 0 ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex < 0 || nextIndex >= segments.length) return;
      if (!isNearSegmentEdge(currentIndex, event.deltaY)) return;

      event.preventDefault();
      wheelLock = true;
      scrollToSegment(segments[nextIndex]);
      window.setTimeout(() => {
        wheelLock = false;
      }, wheelCooldownMs);
    },
    { passive: false }
  );

  function scrollToSegment(target) {
    const segment = resolveSegment(target);
    if (!segment) return;

    segment.scrollIntoView({ behavior: "smooth", block: "start" });
    segment.classList.add("scroll-segment--entering");
    segment.querySelectorAll(".scroll-reveal").forEach((el) => el.classList.add("is-visible"));

    window.setTimeout(() => {
      segment.classList.remove("scroll-segment--entering");
    }, 700);
  }

  function resolveSegment(target) {
    if (target.matches(segmentSelectors)) return target;
    return target.closest(segmentSelectors);
  }

  function getCurrentSegmentIndex() {
    const viewportCenter = window.scrollY + window.innerHeight * 0.42;
    let activeIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    segments.forEach((segment, index) => {
      const top = segment.offsetTop;
      const distance = Math.abs(top - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    return activeIndex;
  }

  function isNearSegmentEdge(index, deltaY) {
    const segment = segments[index];
    const rect = segment.getBoundingClientRect();
    const edgeThreshold = Math.min(120, rect.height * 0.18);

    if (deltaY > 0) {
      return rect.bottom - window.innerHeight <= edgeThreshold;
    }

    return rect.top >= -edgeThreshold;
  }
})();
