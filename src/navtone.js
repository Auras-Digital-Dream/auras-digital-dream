import { useEffect } from "react";

/* Tells the navbar what it is sitting on.
 *
 * Each section's tone is read from its own computed text colour rather than
 * a hand-kept list: a section that sets light type is a section with a dark
 * ground, and that holds for the ones backed by video and gradients too,
 * where the background colour itself says nothing.
 *
 * The band boundaries are cached, so scrolling is one array walk and a
 * single attribute write, and only when the answer actually changes.
 */
const LIGHT_TEXT = 0.4; // luminance above this means the section sets light type

function luminance(color) {
  const parts = color.match(/[\d.]+/g);
  if (!parts) return 0;
  const [r, g, b] = parts.slice(0, 3).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function useNavTone(selector = ".masthead") {
  useEffect(() => {
    const nav = document.querySelector(selector);
    if (!nav) return undefined;

    let bands = [];
    const measure = () => {
      bands = [...document.querySelectorAll("main.home > section, main.home > footer")].map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        return { top, bottom: top + rect.height, dark: luminance(getComputedStyle(el).color) > LIGHT_TEXT };
      });
    };

    let current = "";
    let frame = 0;
    const update = () => {
      frame = 0;
      // Look at what is behind the middle of the bar, not its top edge.
      const probe = window.scrollY + nav.offsetHeight * 0.5;
      let tone = "dark";
      for (const band of bands) {
        if (probe >= band.top && probe < band.bottom) {
          tone = band.dark ? "dark" : "light";
          break;
        }
      }
      if (tone !== current) {
        current = tone;
        nav.dataset.tone = tone;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    update();
    const observer = new ResizeObserver(() => { measure(); update(); });
    observer.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [selector]);
}
