import { useEffect } from "react";

export function useScrollExperience(pageKey = "home") {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealItems = [...document.querySelectorAll("[data-reveal]")];
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(item);
    });
    let frame = 0;
    const update = () => {
      const range = Math.max(root.scrollHeight - window.innerHeight, 1);
      root.style.setProperty("--scroll-progress", `${window.scrollY / range}`);
      document.querySelectorAll("[data-parallax]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * Number(element.dataset.parallax || 0.12);
        element.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
      });
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const cursor = document.querySelector(".custom-cursor");
    const cursorRing = document.querySelector(".custom-cursor-ring");
    /* The stylesheet hides the native cursor for anything carrying
       .cursor-ready, so that class must never be set unless both
       replacements are actually in the document. The optional chaining
       below meant a missing pair failed silently: no error, no cursor. */
    const finePointer = window.matchMedia("(pointer: fine)").matches && cursor && cursorRing;
    let ringX = -100;
    let ringY = -100;
    let targetX = -100;
    let targetY = -100;
    let cursorFrame = 0;
    const animateCursor = () => {
      ringX += (targetX - ringX) * 0.22;
      ringY += (targetY - ringY) * 0.22;
      cursorRing?.style.setProperty("transform", `translate3d(${ringX}px,${ringY}px,0)`);
      cursorFrame = requestAnimationFrame(animateCursor);
    };
    const onPointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor?.style.setProperty("transform", `translate3d(${targetX}px,${targetY}px,0)`);
      document.body.classList.add("cursor-ready");
    };
    const onPointerOver = (event) => document.body.classList.toggle("cursor-interactive", Boolean(event.target.closest("a,button,input,select,textarea,[role='button']")));
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerover", onPointerOver, { passive: true });
      cursorFrame = requestAnimationFrame(animateCursor);
    }
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      if (frame) cancelAnimationFrame(frame);
      if (cursorFrame) cancelAnimationFrame(cursorFrame);
    };
  }, [pageKey]);
}
