import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/* A single gold thread down the left margin, drawn as you scroll, with a
 * seal lighting at each section it passes.
 *
 * The drawn length is a scaleY on a one-pixel bar rather than a dash offset
 * on an SVG path: same picture, but it stays on the compositor, so a line
 * spanning the whole document costs nothing to redraw while the page moves.
 *
 * It lives in the gutter and never crosses the text column, so it needs no
 * stacking games with the sections it passes.
 */
export function GoldLine() {
  const railRef = useRef(null);
  const nodeRefs = useRef([]);
  const litRef = useRef(-1);
  const reduced = useReducedMotion();
  const [marks, setMarks] = useState([]);

  // Where each section starts, as a share of the whole page.
  useEffect(() => {
    const measure = () => {
      const height = document.documentElement.scrollHeight;
      if (!height) return;
      const found = [...document.querySelectorAll("main.home > section")].map((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        return { top, pct: (top / height) * 100 };
      });
      setMarks(found.filter((m) => m.pct > 1 && m.pct < 99));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("load", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", measure);
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;

    // Nothing to draw and nothing to wait for: the thread is simply there.
    if (reduced) {
      rail.style.setProperty("--draw", "1");
      nodeRefs.current.forEach((el) => el && el.classList.add("is-lit"));
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const range = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / range, 0), 1);
      rail.style.setProperty("--draw", progress.toFixed(4));

      // A seal lights once the drawn end has reached it. Only touch the DOM
      // when the count actually changes, not on every frame.
      const drawn = progress * doc.scrollHeight;
      let lit = 0;
      while (lit < marks.length && marks[lit].top <= drawn) lit += 1;
      if (lit !== litRef.current) {
        litRef.current = lit;
        nodeRefs.current.forEach((el, i) => el && el.classList.toggle("is-lit", i < lit));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, marks]);

  return (
    <div className="goldline" ref={railRef} aria-hidden="true">
      <span className="goldline-track" />
      <span className="goldline-draw" />
      {marks.map((mark, i) => (
        <i
          key={mark.pct}
          className="goldline-seal"
          style={{ top: `${mark.pct}%` }}
          ref={(el) => { nodeRefs.current[i] = el; }}
        />
      ))}
    </div>
  );
}
