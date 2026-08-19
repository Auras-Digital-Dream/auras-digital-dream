import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/* ══════════════════════════════════════════════════════════════════════════
   Scroll primitives.

   Every primitive here animates transform / opacity / clip-path only, so
   nothing it does can reflow the page or push a neighbour out of place.
   Each one degrades to a static, fully visible state under
   prefers-reduced-motion — the content is never hidden behind an animation
   that will not run.
   ══════════════════════════════════════════════════════════════════════════ */

const EASE = [0.16, 1, 0.3, 1];

/** Measures an element without causing layout thrash on resize. */
function useMeasure(ref, deps = []) {
  const [box, setBox] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(() => {
      // Border-box, not contentRect: the rail has horizontal padding and
      // contentRect would under-report the travel by both gutters.
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      setBox((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    });
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return box;
}

/* ── Reveal ────────────────────────────────────────────────────────────────
   Wipes content in from below a mask.

   The trigger lives on the MASK, not on the thing being wiped. An
   IntersectionObserver clips against ancestor overflow, so an element parked
   below an `overflow:hidden` mask reports zero intersection and would wait
   forever for an in-view event that can never fire. Observing the unclipped
   mask and driving the child through variants breaks that deadlock. */
export function Reveal({ children, delay = 0, as = "div", className = "", amount = 0.3 }) {
  const reduced = useReducedMotion();
  const Plain = as;
  const Tag = motion[as] || motion.div;
  if (reduced) return <Plain className={className}>{children}</Plain>;
  return (
    <motion.div
      className="reveal-mask"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      <Tag
        className={className}
        variants={{
          hidden: { y: "110%" },
          visible: { y: "0%", transition: { duration: 1, delay, ease: EASE } },
        }}
      >
        {children}
      </Tag>
    </motion.div>
  );
}

/* ── Lines ─────────────────────────────────────────────────────────────────
   Splits a string into words and wipes them in sequence. Keeps the whole
   string in an aria-label so screen readers read one sentence, not confetti. */
export function Lines({ text, className = "", as = "h2", delay = 0, style }) {
  const reduced = useReducedMotion();
  const Plain = as;
  const Tag = motion[as] || motion.h2;
  if (reduced) return <Plain className={className} style={style}>{text}</Plain>;
  return (
    <Tag
      className={`lines ${className}`}
      style={style}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {text.split(" ").map((word, index) => (
        <span className="lines-word" key={`${word}-${index}`} aria-hidden="true">
          <motion.span
            variants={{
              hidden: { y: "170%" },
              visible: { y: "0%", transition: { duration: 0.9, delay: delay + index * 0.045, ease: EASE } },
            }}
          >
            {word}{" "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ── Rise ──────────────────────────────────────────────────────────────────
   The workhorse entrance: a short lift with no blur, so text stays crisp. */
export function Rise({ children, delay = 0, className = "", y = 28, amount = 0.2 }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── Depth ─────────────────────────────────────────────────────────────────
   Layered parallax. `speed` is a fraction of the section's travel; positive
   drifts slower than the page, negative drifts faster. The wrapper clips,
   so a layer can never escape into the section above or below. */
export function Depth({ children, speed = 0.12, className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [`${speed * -50}%`, `${speed * 50}%`]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <div ref={ref} className={`depth ${className}`}>
      <motion.div className="depth-layer" style={reduced ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ── Chapters ──────────────────────────────────────────────────────────────
   A pinned stage whose media cross-fades between chapters as you scroll,
   while the copy for each chapter swaps in place. This is the core
   storytelling device: the page holds still and the story moves.

   Height is explicit (one viewport per chapter plus one), so the pin can
   never collapse or overlap the next section. */
export function Chapters({ items, renderMedia, renderCopy, className = "", id }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (reduced) return undefined;
    return scrollYProgress.on("change", (progress) => {
      const index = Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
      setActive((prev) => (prev === index ? prev : index));
    });
  }, [scrollYProgress, count, reduced]);

  if (reduced) {
    return (
      <section id={id} className={`chapters chapters-static ${className}`}>
        {items.map((item, index) => (
          <div className="chapter-static" key={item.key ?? index}>
            <div className="chapter-static-media">{renderMedia(item, index, true)}</div>
            <div className="chapter-static-copy">{renderCopy(item, index, true)}</div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={ref}
      className={`chapters ${className}`}
      style={{ "--chapter-count": count, height: `${(count + 1) * 100}vh` }}
    >
      <div className="chapters-stage">
        <div className="chapters-media">
          {items.map((item, index) => (
            <div
              className="chapter-media"
              key={item.key ?? index}
              data-active={index === active}
              aria-hidden={index !== active}
            >
              {renderMedia(item, index, index === active)}
            </div>
          ))}
        </div>
        <div className="chapters-copy">
          {items.map((item, index) => (
            <div
              className="chapter-copy"
              key={item.key ?? index}
              data-active={index === active}
              aria-hidden={index !== active}
            >
              {renderCopy(item, index, index === active)}
            </div>
          ))}
          <ChapterIndex count={count} active={active} />
        </div>
      </div>
    </section>
  );
}

function ChapterIndex({ count, active }) {
  return (
    <div className="chapter-index" aria-hidden="true">
      <span className="chapter-index-current">{String(active + 1).padStart(2, "0")}</span>
      <span className="chapter-index-rule">
        <span style={{ transform: `scaleX(${(active + 1) / count})` }} />
      </span>
      <span className="chapter-index-total">{String(count).padStart(2, "0")}</span>
    </div>
  );
}

/* ── Track ─────────────────────────────────────────────────────────────────
   Horizontal gallery driven by vertical scroll. The section's height is
   derived from the measured overflow, so the track always ends exactly when
   the last frame reaches the right edge — no dead scroll, no cut-off frame.

   Under reduced motion it becomes an ordinary swipeable row. */
export function Track({ children, className = "", id, label }) {
  const ref = useRef(null);
  const railRef = useRef(null);
  const reduced = useReducedMotion();
  const { width: railWidth } = useMeasure(railRef, []);
  const [viewport, setViewport] = useState(0);

  useEffect(() => {
    const update = () => setViewport(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const distance = Math.max(0, railWidth - viewport);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(raw, { stiffness: 140, damping: 32, mass: 0.5 });

  if (reduced) {
    return (
      <section id={id} className={`track track-static ${className}`} aria-label={label}>
        <div className="track-rail">{children}</div>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={ref}
      className={`track ${className}`}
      aria-label={label}
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="track-stage">
        <motion.div ref={railRef} className="track-rail" style={{ x }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/* ── ScrollCue ─────────────────────────────────────────────────────────────
   Fades out as soon as the reader starts moving, so it never lingers. */
export function ScrollCue({ label = "Derulează" }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 220], [1, 0]);
  return (
    <motion.div className="scroll-cue" style={{ opacity }} aria-hidden="true">
      <span>{label}</span>
      <i />
    </motion.div>
  );
}

/* ── Progress ──────────────────────────────────────────────────────────────
   Reading progress rail. */
export function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 40, mass: 0.3 });
  return <motion.div className="progress-rail" style={{ scaleX }} aria-hidden="true" />;
}

/* ── Fan ───────────────────────────────────────────────────────────────────
   Numbered cards stacked face-on, then fanned open along an arc as the
   section scrolls. The pivot sits well below the stage (set in CSS via
   transform-origin), so the cards swing like a hand of cards rather than
   spinning in place.

   Each card is its own component: the rotation is driven by hooks, and hooks
   cannot be called from inside a map callback. */
const TAU = Math.PI * 2;

/* One card on the ring. It is placed by the cosine and sine of its own
   angle, handed to CSS as plain numbers so the radii can stay in the
   stylesheet where the breakpoints are. Angle 0 is the front of the ring,
   nearest the viewer; the card never turns upside down because only the
   position orbits, not the card. */
function FanCard({ index, count, turn, children }) {
  const angle = useTransform(turn, (t) => (index / count + t) * TAU + Math.PI / 2);
  const cos = useTransform(angle, Math.cos);
  const sin = useTransform(angle, Math.sin);
  const zIndex = useTransform(sin, (s) => Math.round(50 + s * 40));
  return (
    <motion.div className="fan-card" style={{ "--cos": cos, "--sin": sin, zIndex }}>
      <span className="fan-card-index">{String(index + 1).padStart(2, "0")}</span>
      {children}
    </motion.div>
  );
}

export function Fan({ items, renderCard, className = "", id, label }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // 0 -> 1 is one complete revolution, spread across almost the whole pin.
  const turn = useSpring(useTransform(scrollYProgress, [0.04, 0.96], [0, 1]), {
    stiffness: 90, damping: 26, mass: 0.5,
  });
  const count = items.length;

  if (reduced) {
    return (
      <section id={id} className={`fan fan-static ${className}`} aria-label={label}>
        <div className="fan-rail">
          {items.map((item, i) => (
            <div className="fan-card" key={item.key ?? i}>
              <span className="fan-card-index">{String(i + 1).padStart(2, "0")}</span>
              {renderCard(item, i)}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={ref}
      className={`fan ${className}`}
      aria-label={label}
      style={{ height: `${140 + count * 22}vh` }}
    >
      <div className="fan-stage">
        {items.map((item, i) => (
          <FanCard key={item.key ?? i} index={i} count={count} turn={turn}>
            {renderCard(item, i)}
          </FanCard>
        ))}
      </div>
    </section>
  );
}

/* ── Marquee ───────────────────────────────────────────────────────────────
   A band of oversized outlined type set on a slant, sliding as the section
   passes. Decorative only — the text is repeated for the visual and hidden
   from assistive tech. */
export function Marquee({ text, className = "", angle = -7, speed = 0.5, repeat = 4 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], ["8%", `${-speed * 100}%`]), {
    stiffness: 110, damping: 30, mass: 0.4,
  });
  // The frieze leans toward the viewer on the way in and away on the way
  // out, so the band has a face rather than being a flat strip of type.
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], ["9deg", "0deg", "-9deg"]);
  // A MotionValue is only subscribed on a motion component; on a plain div it
  // stringifies to [object Object], which invalidates the whole transform
  // declaration — including the -7deg swing that was already there.
  return (
    <motion.div
      ref={ref}
      className={`marquee ${className}`}
      style={reduced
        ? { "--marquee-angle": `${angle}deg` }
        : { "--marquee-angle": `${angle}deg`, "--marquee-tilt": tilt }}
      aria-hidden="true"
    >
      <motion.div className="marquee-rail" style={reduced ? undefined : { x }}>
        {Array.from({ length: repeat }, (_, i) => (
          <span className="marquee-item" key={i}>{text}</span>
        ))}
      </motion.div>
    </motion.div>
  );
}
