import { useEffect } from "react";

/* A scroll reveal built on IntersectionObserver and nothing else.
 *
 * Mark a container .reveal-on-scroll. If it has direct children carrying
 * .reveal-child they come in one after another and the container itself
 * stays put; otherwise the container is what moves. Only opacity and
 * transform are touched, so the whole thing stays on the compositor.
 *
 * Under prefers-reduced-motion, and if the observer is unavailable at all,
 * everything is revealed on the spot — content can never be left hidden by
 * a script that did not run.
 */
export function useRevealOnScroll(deps = []) {
  useEffect(() => {
    const targets = [...document.querySelectorAll(".reveal-on-scroll")];
    if (!targets.length) return undefined;

    // Number the children once, so the stylesheet can space them out without
    // the observer having to touch anything per frame.
    for (const el of targets) {
      let index = 0;
      for (const child of el.children) {
        if (child.classList.contains("reveal-child")) {
          child.style.setProperty("--reveal-i", index);
          index += 1;
        }
      }
    }

    const reveal = (el) => el.classList.add("is-revealed");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // A block taller than the window may never reach a fifth of itself
          // on screen, so having its top well inside the viewport counts too.
          const tallAndStarted = entry.boundingClientRect.top < window.innerHeight * 0.85;
          if (entry.intersectionRatio < 0.2 && !(entry.isIntersecting && tallAndStarted)) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { threshold: [0, 0.2], rootMargin: "0px 0px -6%" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
