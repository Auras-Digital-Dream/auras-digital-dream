import { useRef, useState, useEffect, useCallback } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap.js";

/* Sursă: prototip generat în Figma Make ("Medusa Contact Section Animation"),
   portat 1:1 — sprite-sheet cu 5 poze (public/assets/medusa/medusa-storyboard.png,
   grilă 2×3, background-size 200% 300%), coregrafia de scroll, spotlight-ul de
   cursor pe cadrul I, inelul de la wink. Am înlocuit @figma/astraui (nu există
   în acest proiect) cu câmpuri simple + trimiterea reală prin formsubmit.co;
   am mapat toate culorile "myth-*" pe token-urile din :root (n-am inventat
   nimic nou) și fonturile Cinzel/Cinzel Decorative pe familia existentă
   (Marcellus pentru display, EB Garamond pentru corp, sans pentru etichete —
   Amoresa rămâne semnătura site-ului, nu se atinge). Bara de progres și
   marcatorul de pe timeline animă acum `transform`, nu `width`/`top`. */

const VOID = "var(--ink-ground)";
const GOLD = "var(--gold)";
const IVORY = "var(--paper)";
const goldA = (transparentPct) => `color-mix(in srgb, ${GOLD}, transparent ${transparentPct}%)`;
const voidA = (transparentPct) => `color-mix(in srgb, ${VOID}, transparent ${transparentPct}%)`;
const ivoryA = (transparentPct) => `color-mix(in srgb, ${IVORY}, transparent ${transparentPct}%)`;

// ── Sprite-sheet frame table ─────────────────────────────────────────────────
// background-size: 200% 300% maps each 2×3 grid cell exactly to the viewport.
// Narrative arc: still → stirring → eye opens → confrontation → the wink
const FRAMES = [
  { bgPos: "0% 0%",    kicker: "I",   latin: "QUIESCENS",   sub: "Nemișcată ca piatra" },
  { bgPos: "100% 0%",  kicker: "II",  latin: "VERTE",       sub: "Nu privi în altă parte" },
  { bgPos: "0% 50%",   kicker: "III", latin: "VIDET",       sub: "Ochiul se deschide" },
  { bgPos: "100% 50%", kicker: "IV",  latin: "CONVERTITUR", sub: "Se întoarce spre tine" },
  { bgPos: "0% 100%",  kicker: "V",   latin: "NICTUS",      sub: "Clipirea" },
];
const N = FRAMES.length;

// Bell-curve crossfade: each frame is fully opaque at its center, fades at edges
function frameOpacity(p, i) {
  const center = i / (N - 1);
  const spread = 0.7 / (N - 1);
  return Math.max(0, Math.min(1, 1 - Math.abs(p - center) / spread));
}

// ── Star particle table (deterministic, no random on render) ─────────────────
const STARS = Array.from({ length: 34 }, (_, i) => ({
  x: ((i * 41 + i * i * 7 + 11) % 94) + 3,
  y: ((i * 67 + i * 23 + 7) % 88) + 6,
  r: 0.9 + (i % 3) * 0.5,
  delay: (i * 0.38) % 4.2,
  dur: 1.8 + (i * 0.29) % 2.4,
}));

const REACH_LINKS = ["SCRIE-MI", "HAI SĂ CREĂM", "CONECTEAZĂ-TE"];

export function MedusaForm() {
  const outerRef = useRef(null);
  const frameRefs = useRef([]);
  const ringRef = useRef(null);
  const progressFillRef = useRef(null);
  const pctRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const timelineMarkerRef = useRef(null);
  const timelinePctRef = useRef(null);
  const scrollHintRef = useRef(null);
  const honeyRef = useRef(null);
  const trackHeightRef = useRef(0);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const [activeFrame, setActiveFrame] = useState(0);
  const [formVisible, setFormVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [submitState, setSubmitState] = useState("idle");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const formVisibleRef = useRef(false);
  const activeFrameRef = useRef(0);

  useEffect(() => {
    if (timelineTrackRef.current) trackHeightRef.current = timelineTrackRef.current.offsetHeight;
  }, []);

  const updateDOM = useCallback((p) => {
    frameRefs.current.forEach((el, i) => {
      if (el) el.style.opacity = String(frameOpacity(p, i));
    });

    if (progressFillRef.current) progressFillRef.current.style.transform = `scaleX(${p})`;
    if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;

    if (timelineMarkerRef.current) {
      const h = trackHeightRef.current || 0;
      timelineMarkerRef.current.style.transform = `translate(-50%, -50%) translateY(${p * h}px)`;
    }
    if (timelinePctRef.current) timelinePctRef.current.textContent = `${Math.round(p * 100)}%`;

    if (ringRef.current) {
      const rp = Math.max(0, Math.min(1, (p - 0.74) / 0.22));
      ringRef.current.style.opacity = String(rp * 0.88);
      ringRef.current.style.transform = `translate(-50%, -50%) scale(${0.4 + rp * 0.85})`;
    }

    if (scrollHintRef.current) scrollHintRef.current.style.opacity = String(Math.max(0, 1 - p * 10));

    const newFrame = Math.min(N - 1, Math.round(p * (N - 1)));
    if (newFrame !== activeFrameRef.current) {
      activeFrameRef.current = newFrame;
      setActiveFrame(newFrame);
    }

    const shouldShow = p >= 0.86;
    if (shouldShow !== formVisibleRef.current) {
      formVisibleRef.current = shouldShow;
      setFormVisible(shouldShow);
    }
  }, []);

  useGSAP(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      scrub: reduced ? true : 0.85, // instant catch-up under reduced motion — no smoothing lag
      onUpdate: (self) => updateDOM(self.progress),
    });
  }, { scope: outerRef, dependencies: [updateDOM] });

  const handleMouseMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (honeyRef.current && honeyRef.current.value) return;
    setSubmitState("sending");
    setSubmitError(false);
    try {
      const response = await fetch("https://formsubmit.co/ajax/aurastrendvault@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nume: name,
          email,
          mesaj: message,
          _subject: "Mesaj nou — formularul Medusa (Studio)",
          _template: "table",
          _replyto: email,
        }),
      });
      if (!response.ok) throw new Error("Delivery failed");
      setSubmitState("done");
      setTimeout(() => setFormSubmitted(true), 820);
    } catch {
      setSubmitState("idle");
      setSubmitError(true);
    }
  }, [name, email, message]);

  const isFrameIV = activeFrame === 3 && !formVisible;
  const isFrameII = activeFrame === 1 && !formVisible;
  const isFrameIII = activeFrame === 2 && !formVisible;
  const showEyeRect = (activeFrame === 0 || activeFrame === 2 || activeFrame === 4) && !formVisible;

  return (
    <div ref={outerRef} id="atelier" aria-label="Contact — Atelierul" style={{ height: "600vh", background: VOID }}>
      <svg width="0" height="0" style={{ position: "absolute", overflow: "hidden" }} aria-hidden="true">
        <defs>
          <filter id="atelier-grain" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.68 0.52" numOctaves="4" seed="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" />
          </filter>
        </defs>
      </svg>

      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: VOID }}>

        {/* Conținut real, mereu vizibil — pentru motoare de căutare și cititoare de
            ecran deopotrivă; restul secțiunii e decorativ (aria-hidden) sau depinde
            de scroll. Stă discret sub kicker, nu concurează cu el vizual. */}
        <h1 style={{ position: "absolute", left: "2.5rem", top: "5.4rem", margin: 0, maxWidth: "20rem", color: ivoryA(45), fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "10px", letterSpacing: "0.04em", lineHeight: 1.5, pointerEvents: "none" }}>
          Contact — Atelierul. Scrie-mi povestea proiectului tău: numele, emailul și mesajul tău ajung direct la Aura, prin formularul de la finalul acestei pagini.
        </h1>
        <ul style={{ position: "absolute", left: "2.5rem", top: "9.4rem", margin: 0, padding: 0, listStyle: "none", maxWidth: "18rem", color: ivoryA(60), fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "9px", letterSpacing: "0.04em", lineHeight: 1.7, pointerEvents: "none" }}>
          {FRAMES.map((f) => <li key={f.kicker}>{f.kicker} — {f.latin}: {f.sub}.</li>)}
        </ul>

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
          {STARS.map((s, i) => (
            <div key={i} className="atelier-star" style={{
              position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
              width: `${s.r * 2}px`, height: `${s.r * 2}px`, borderRadius: "50%",
              background: GOLD, opacity: 0.06,
              animation: `atelier-star-breathe ${s.dur}s ${s.delay}s ease-in-out infinite alternate`,
            }} />
          ))}
        </div>

        <div className="atelier-stage" onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}
          style={{
            position: "absolute", inset: 0,
            transform: formVisible ? "translateX(-18%) scale(0.965)" : "translateX(0) scale(1)",
            transition: "transform 1.15s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>

          {FRAMES.map((frame, i) => (
            <div key={i} className="atelier-frame" ref={(el) => { frameRefs.current[i] = el; }}
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "url(/assets/medusa/medusa-storyboard.png)",
                backgroundSize: "200% 300%", backgroundPosition: frame.bgPos, backgroundRepeat: "no-repeat",
                opacity: i === 0 ? 1 : 0, willChange: "opacity",
              }} />
          ))}

          <div style={{
            position: "absolute", inset: 0,
            background: [
              `radial-gradient(ellipse 48% 58% at 50% 34%, ${goldA(78)} 0%, transparent 65%)`,
              `radial-gradient(ellipse 30% 40% at 35% 28%, ${goldA(90)} 0%, transparent 60%)`,
            ].join(", "),
            mixBlendMode: "screen", pointerEvents: "none",
          }} />

          <div aria-hidden="true" style={{
            position: "absolute", left: "27%", top: "33%", width: "21%", height: "9.5%",
            opacity: showEyeRect ? 0.62 : 0, transition: "opacity 0.55s ease", pointerEvents: "none",
          }}>
            {[
              { top: 0, left: 0, borderTop: `1px solid var(--gold-line)`, borderLeft: `1px solid var(--gold-line)`, width: 14, height: 14 },
              { top: 0, right: 0, borderTop: `1px solid var(--gold-line)`, borderRight: `1px solid var(--gold-line)`, width: 14, height: 14 },
              { bottom: 0, left: 0, borderBottom: `1px solid var(--gold-line)`, borderLeft: `1px solid var(--gold-line)`, width: 14, height: 14 },
              { bottom: 0, right: 0, borderBottom: `1px solid var(--gold-line)`, borderRight: `1px solid var(--gold-line)`, width: 14, height: 14 },
            ].map((corner, i) => <div key={i} style={{ position: "absolute", ...corner }} />)}
          </div>

          <div ref={ringRef} aria-hidden="true" style={{
            position: "absolute", top: "40%", left: "40%", width: "300px", height: "300px", borderRadius: "50%",
            border: `1px solid ${goldA(40)}`, opacity: 0, transform: "translate(-50%,-50%) scale(0.4)",
            willChange: "opacity, transform", pointerEvents: "none",
          }}>
            {[
              { inset: "-80px", pct: 58 },
              { inset: "-160px", pct: 72 },
              { inset: "-240px", pct: 83 },
              { inset: "-330px", pct: 91 },
            ].map(({ inset, pct }, i) => (
              <div key={i} style={{ position: "absolute", inset, borderRadius: "50%", border: `1px solid ${goldA(pct)}` }} />
            ))}
            <div style={{ position: "absolute", top: "50%", left: "50%", width: "8px", height: "8px", borderRadius: "50%", background: goldA(50), transform: "translate(-50%,-50%)" }} />
          </div>

          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            background: isHovering
              ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, transparent 52px, ${voidA(50)} 140px, ${voidA(10)} 330px)`
              : voidA(56),
            transition: isHovering ? "none" : "background 0.75s ease", pointerEvents: "none",
          }} />

          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, background: "rgba(200, 183, 150, 0.28)", filter: "url(#atelier-grain)",
            maskImage: isHovering ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, black 55px, transparent 175px)` : "none",
            WebkitMaskImage: isHovering ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, black 55px, transparent 175px)` : "none",
            mixBlendMode: "overlay", opacity: 0.55, pointerEvents: "none",
          }} />

          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${voidA(3)} 0%, ${voidA(75)} 26%, transparent 50%)`, pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 82% at 50% 42%, transparent 40%, ${voidA(30)} 100%)`, pointerEvents: "none" }} />
        </div>

        <div aria-hidden="true" style={{
          position: "absolute", left: "2.2rem", top: "50%", height: "38vh", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none",
          opacity: isFrameIII ? 1 : 0.15, transition: "opacity 0.55s ease",
        }}>
          <div style={{ color: GOLD, fontFamily: "var(--font-project)", fontSize: "8px", marginBottom: "0.4rem" }}>✦</div>
          <div ref={timelineTrackRef} style={{ position: "relative", width: "1px", flex: 1, background: `linear-gradient(to bottom, ${GOLD}, ${goldA(85)})` }}>
            <div ref={timelineMarkerRef} style={{
              position: "absolute", top: 0, left: "50%", width: "6px", height: "6px", borderRadius: "50%",
              background: GOLD, transform: "translate(-50%, -50%)", willChange: "transform",
            }} />
          </div>
          <span ref={timelinePctRef} style={{ color: GOLD, fontFamily: "var(--font-project)", fontSize: "9px", letterSpacing: "0.22em", marginTop: "0.4rem" }}>0%</span>
        </div>

        <div style={{ position: "absolute", top: "2rem", left: "2.5rem", display: "flex", alignItems: "center", gap: "0.75rem", pointerEvents: "none" }}>
          <div style={{ width: "18px", height: "1px", background: GOLD, opacity: 0.42 }} />
          <span style={{ color: goldA(48), fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase" }}>Atelierul · MMXXVI</span>
        </div>

        <div ref={scrollHintRef} aria-hidden="true" style={{
          position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", pointerEvents: "none",
        }}>
          <span style={{ color: ivoryA(72), fontFamily: "var(--font-sans)", fontSize: "8px", letterSpacing: "0.45em", textTransform: "uppercase" }}>Derulează</span>
          <div style={{ width: "1px", height: "28px", background: `linear-gradient(to bottom, ${goldA(50)}, transparent)` }} />
        </div>

        <div style={{ position: "absolute", bottom: "3.5rem", left: "3rem", pointerEvents: "none", opacity: formVisible ? 0 : 1, transition: "opacity 0.38s ease" }}>
          <div style={{ color: GOLD, fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "0.44em", textTransform: "uppercase", marginBottom: "0.9rem" }}>
            MMXXVI · ATELIERUL · {FRAMES[activeFrame].kicker}
          </div>
          <div key={`latin-${activeFrame}`} className="atelier-narrative-latin" style={{
            color: IVORY, fontFamily: "var(--font-project)", fontSize: "clamp(1.9rem, 4.2vw, 3.6rem)",
            fontWeight: 400, letterSpacing: "0.09em", textTransform: "uppercase", lineHeight: 1,
            animation: "atelier-fade-up 0.44s cubic-bezier(0.16,1,0.3,1)",
          }}>{FRAMES[activeFrame].latin}</div>
          <div key={`sub-${activeFrame}`} className="atelier-narrative-sub" style={{
            color: ivoryA(30), fontFamily: "var(--font-body)", fontSize: "0.8rem", letterSpacing: "0.28em",
            textTransform: "uppercase", marginTop: "0.55rem", animation: "atelier-fade-up 0.5s 0.07s cubic-bezier(0.16,1,0.3,1) both",
          }}>{FRAMES[activeFrame].sub}</div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
            <div style={{ width: "144px", height: "1px", background: goldA(84), position: "relative", overflow: "hidden" }}>
              <div ref={progressFillRef} style={{ position: "absolute", inset: 0, background: GOLD, transform: "scaleX(0)", transformOrigin: "left", willChange: "transform" }} />
            </div>
            <span ref={pctRef} style={{ color: goldA(52), fontFamily: "var(--font-sans)", fontSize: "8.5px", letterSpacing: "0.28em" }}>0%</span>
          </div>
        </div>

        <div aria-hidden="true" style={{
          position: "absolute", right: "5%", top: "50%",
          transform: `translateY(-50%) translateX(${isFrameII ? "0" : "24px"})`,
          opacity: isFrameII ? 1 : 0, transition: "opacity 0.5s ease, transform 0.62s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "flex-end",
        }}>
          <div style={{ color: GOLD, fontFamily: "var(--font-project)", fontSize: "9px", letterSpacing: "0.1em", marginBottom: "0.5rem", animation: isFrameII ? "atelier-glow-pulse 2.4s ease-in-out infinite" : "none" }}>✦</div>
          {["N", "U", "P", "R", "I", "V", "I"].map((char, i) => (
            <div key={i} style={{
              color: IVORY, fontFamily: "var(--font-project)", fontSize: "0.95rem", letterSpacing: "0.4em",
              lineHeight: 1.52, opacity: 0.88, animation: isFrameII ? `atelier-char-drop 0.38s ${i * 0.045}s both` : "none",
            }}>{char === " " ? " " : char}</div>
          ))}
          <div style={{ width: "1px", height: "44px", background: `linear-gradient(to bottom, ${goldA(38)}, transparent)`, marginTop: "0.45rem" }} />
        </div>

        <div style={{
          position: "absolute", right: "5%", top: "50%",
          transform: `translateY(-50%) translateX(${isFrameIV ? "0" : "22px"})`,
          opacity: isFrameIV ? 1 : 0, transition: "opacity 0.48s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: isFrameIV ? "all" : "none", display: "flex", flexDirection: "column", gap: "1.6rem",
        }}>
          {REACH_LINKS.map((link, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              <span style={{
                color: IVORY, fontFamily: "var(--font-project)", fontSize: "0.68rem", letterSpacing: "0.42em",
                textTransform: "uppercase", opacity: 0.82, cursor: "default",
                animation: isFrameIV ? `atelier-fade-up 0.45s ${i * 0.1}s both` : "none", transition: "opacity 0.2s ease",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.82"; }}
              >{link}</span>
              <div style={{ height: "1px", background: GOLD, opacity: 0.22, animation: isFrameIV ? `atelier-fade-up 0.5s ${i * 0.1 + 0.08}s both` : "none" }} />
            </div>
          ))}
        </div>

        <div className="atelier-form-panel" style={{
          position: "absolute", top: 0, right: 0, height: "100%", width: "46%",
          display: "flex", alignItems: "center", padding: "0 5.5% 0 3%",
          transform: formVisible ? "translateX(0)" : "translateX(110%)",
          opacity: formVisible ? 1 : 0,
          transition: "transform 1.15s cubic-bezier(0.16,1,0.3,1), opacity 0.65s ease",
          background: `linear-gradient(to right, transparent, ${voidA(12)} 15%, ${voidA(4)} 38%)`,
          pointerEvents: formVisible ? "all" : "none",
        }}>
          <div style={{ width: "100%" }}>
            <div style={{ color: GOLD, fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "1.6rem" }}>MMXXVI · ATELIERUL</div>
            <h2 style={{ color: IVORY, fontFamily: "var(--font-project)", fontSize: "clamp(1.65rem, 3.2vw, 2.6rem)", fontWeight: 400, letterSpacing: "0.07em", lineHeight: 1.18, textTransform: "uppercase", margin: "0 0 2.2rem 0" }}>
              Spune-mi<br />povestea ta
            </h2>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} style={{ position: "relative" }}>
                  <div style={{ position: "absolute", inset: "-9px", borderRadius: "14px", background: `radial-gradient(ellipse at 50% 50%, ${goldA(78)} 0%, transparent 68%)`, opacity: focusedField === "name" ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none" }} />
                  <label>
                    <span className="atelier-field-label">Nume</span>
                    <input className="atelier-field-input" type="text" placeholder="Numele tău" value={name} onChange={(e) => setName(e.target.value)} required />
                  </label>
                </div>

                <div onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} style={{ position: "relative" }}>
                  <div style={{ position: "absolute", inset: "-9px", borderRadius: "14px", background: `radial-gradient(ellipse at 50% 50%, ${goldA(78)} 0%, transparent 68%)`, opacity: focusedField === "email" ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none" }} />
                  <label>
                    <span className="atelier-field-label">Email</span>
                    <input className="atelier-field-input" type="email" placeholder="adresa@email.ro" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </label>
                </div>

                <div onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)} style={{ position: "relative" }}>
                  <div style={{ position: "absolute", inset: "-9px", borderRadius: "14px", background: `radial-gradient(ellipse at 50% 50%, ${goldA(78)} 0%, transparent 68%)`, opacity: focusedField === "message" ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none" }} />
                  <label>
                    <span className="atelier-field-label">Mesaj</span>
                    <textarea className="atelier-field-input" placeholder="Spune-mi povestea ta…" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} required />
                  </label>
                </div>

                <input ref={honeyRef} type="text" tabIndex="-1" autoComplete="off" className="atelier-honey" aria-hidden="true" name="website" />

                <div style={{
                  marginTop: "0.2rem",
                  transform: submitState === "sending" ? "scaleY(0.78) scaleX(1.06)" : submitState === "done" ? "scale(1.04)" : "scale(1)",
                  opacity: submitState === "sending" ? 0.6 : 1,
                  transition: "transform 0.38s cubic-bezier(0.34,1.56,0.64,1), opacity 0.28s ease",
                }}>
                  <button className="atelier-submit-btn" type="submit" disabled={submitState !== "idle"}>
                    {submitState === "idle" ? "Trimite" : submitState === "sending" ? "· · ·" : "✦"}
                  </button>
                </div>
                {submitError && <p style={{ color: goldA(10), fontFamily: "var(--font-body)", fontSize: "0.85rem", marginTop: "0.4rem" }} role="alert">Ceva nu a mers. Te rugăm să încerci din nou.</p>}
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "2.5rem 0", animation: "atelier-fade-up 0.65s cubic-bezier(0.16,1,0.3,1)" }}>
                <div style={{ color: GOLD, fontFamily: "var(--font-project)", fontSize: "2.1rem", letterSpacing: "0.2em", marginBottom: "1rem", animation: "atelier-rotate-in 0.72s cubic-bezier(0.34,1.56,0.64,1)" }}>✦</div>
                <div style={{ color: IVORY, fontFamily: "var(--font-sans)", fontSize: "0.8rem", letterSpacing: "0.36em", textTransform: "uppercase" }}>Povestea ta a fost primită</div>
                <div style={{ color: ivoryA(30), fontFamily: "var(--font-body)", fontSize: "1rem", letterSpacing: "0.08em", marginTop: "0.5rem", fontStyle: "italic" }}>Îți răspundem în curând</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
