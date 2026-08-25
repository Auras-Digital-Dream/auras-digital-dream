import { useEffect } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   The site's one scroll engine.

   Two files used to do this job. `[data-reveal]` reveals lived here and
   `.reveal-on-scroll` reveals lived in reveal.js — the same machinery
   (one observer, one reduced-motion fallback, one teardown) written twice
   against different class names, and both of them ran on the homepage at
   once. They share an observer now.

   scroll.jsx is deliberately NOT merged in: its primitives (Fan, Marquee,
   Chapters, Depth, Progress) are spring-driven and scroll-linked, which is a
   different thing from a one-shot entrance and does not belong behind an
   IntersectionObserver.

   Every part below is opt-in by what the page actually contains. A route
   with no [data-parallax] and no .scroll-progress never attaches a scroll
   listener at all — the homepage used to pay for both regardless.
   ══════════════════════════════════════════════════════════════════════════ */

/* Two reveal conventions, both kept on purpose:
     [data-reveal]      — one element, one entrance, staggered in fours.
     .reveal-on-scroll  — a container whose .reveal-child items arrive in
                          sequence while the container itself holds still.
   Same observer, same lifecycle; only the class they land on differs. */
const REVEAL_SELECTOR = "[data-reveal], .reveal-on-scroll";

function markRevealed(element) {
  if (element.hasAttribute("data-reveal")) element.classList.add("is-visible");
  if (element.classList.contains("reveal-on-scroll")) element.classList.add("is-revealed");
}

function setupReveals(reduced) {
  const targets = [...document.querySelectorAll(REVEAL_SELECTOR)];
  if (!targets.length) return undefined;

  /* Numbered once, up front, so the stylesheet can space things out and the
     observer never has to touch anything per frame. */
  let order = 0;
  for (const element of targets) {
    if (element.hasAttribute("data-reveal")) {
      element.style.setProperty("--reveal-delay", `${Math.min(order % 4, 3) * 70}ms`);
      order += 1;
    }
    if (!element.classList.contains("reveal-on-scroll")) continue;
    let childIndex = 0;
    for (const child of element.children) {
      if (!child.classList.contains("reveal-child")) continue;
      child.style.setProperty("--reveal-i", childIndex);
      childIndex += 1;
    }
  }

  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach(markRevealed);
    return undefined;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        /* A block taller than the window may never reach a fifth of itself
           on screen, so having its top well inside the viewport counts too.
           This escape hatch used to exist only for .reveal-on-scroll; both
           conventions get it now, because the failure it prevents — a tall
           section that stays invisible forever — is the worse outcome. */
        const tallAndStarted = entry.boundingClientRect.top < window.innerHeight * 0.85;
        if (entry.intersectionRatio < 0.2 && !tallAndStarted) continue;
        markRevealed(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { threshold: [0, 0.2], rootMargin: "0px 0px -8%" },
  );

  targets.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}

/* ── Scroll-linked custom properties ───────────────────────────────────────
   The reading rail and the hero parallax, both written as CSS variables so
   the stylesheet keeps the breakpoints. */
function setupScrollLinked() {
  const root = document.documentElement;
  const rail = document.querySelector(".scroll-progress");
  /* Collected once per route instead of once per frame. The set cannot
     change without a navigation, and re-running querySelectorAll inside the
     rAF callback was the most expensive thing this file did. */
  const parallax = [...document.querySelectorAll("[data-parallax]")];
  if (!rail && !parallax.length) return undefined;

  let frame = 0;
  const update = () => {
    frame = 0;
    if (rail) {
      const range = Math.max(root.scrollHeight - window.innerHeight, 1);
      root.style.setProperty("--scroll-progress", `${window.scrollY / range}`);
    }
    for (const element of parallax) {
      const rect = element.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * Number(element.dataset.parallax || 0.12);
      element.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    }
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (frame) cancelAnimationFrame(frame);
  };
}

/* ── Cursor ────────────────────────────────────────────────────────────────
   Not a scroll effect, but it shares this hook's lifecycle exactly, so it
   rides along rather than duplicating the mount/unmount plumbing. */
function setupCursor() {
  const dot = document.querySelector(".custom-cursor");
  const ring = document.querySelector(".custom-cursor-ring");
  /* The stylesheet hides the native cursor for anything carrying
     .cursor-ready, so that class must never be set unless both replacements
     are actually in the document. */
  if (!dot || !ring || !window.matchMedia("(pointer: fine)").matches) return undefined;

  let ringX = -100;
  let ringY = -100;
  let targetX = -100;
  let targetY = -100;
  let frame = requestAnimationFrame(function animate() {
    ringX += (targetX - ringX) * 0.22;
    ringY += (targetY - ringY) * 0.22;
    ring.style.setProperty("transform", `translate3d(${ringX}px,${ringY}px,0)`);
    frame = requestAnimationFrame(animate);
  });

  const onPointerMove = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    dot.style.setProperty("transform", `translate3d(${targetX}px,${targetY}px,0)`);
    document.body.classList.add("cursor-ready");
  };
  const onPointerOver = (event) =>
    document.body.classList.toggle(
      "cursor-interactive",
      Boolean(event.target.closest("a,button,input,select,textarea,[role='button']")),
    );

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerover", onPointerOver, { passive: true });
  return () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerover", onPointerOver);
    cancelAnimationFrame(frame);
    /* Leaving these on the body followed the reader onto routes that render
       no cursor divs, where the stylesheet would go on hiding the real
       cursor with nothing drawn in its place. */
    document.body.classList.remove("cursor-ready", "cursor-interactive");
  };
}

export function useScrollExperience(pageKey = "home") {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const teardowns = [setupReveals(reduced)];
    if (!reduced) teardowns.push(setupScrollLinked(), setupCursor());
    return () => teardowns.forEach((stop) => stop?.());
  }, [pageKey]);
}
