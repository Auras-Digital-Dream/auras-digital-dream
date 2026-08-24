import React, { useRef, useState, useEffect } from 'react';

/* ══════════════════════════════════════════════════════════════════════════
   AboutSection — Componentă standalone
   Background: imaginea #3 (renascentistă cu ochelari)
   Portret central: "aura in red"
   Text: "eu sunt" mic + "Aura" mare
   ══════════════════════════════════════════════════════════════════════════ */

function useReveal(ref, threshold = 0.15) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return revealed;
}

function WordReveal({ text, trigger }) {
  const words = text.split(' ');
  return (
    <span className={`word-reveal ${trigger ? 'revealed' : ''}`}>
      {words.map((w, i) => (
        <span key={i} style={{ transitionDelay: `${i * 0.08}s` }}>{w} </span>
      ))}
    </span>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const revealed = useReveal(ref);
  const textRef = useRef(null);
  const textRevealed = useReveal(textRef, 0.3);

  return (
    <section id="despre-mine" className="about-section">
      <div className="about-bg">
        <img src="/assets/hero.png" alt="" />
        <div className="about-bg-overlay" />
      </div>

      <div ref={ref} className={`about-content ${revealed ? 'is-revealed' : ''}`}>
        <div className="about-portrait">
          <img src="/assets/aura-cinematic-portrait.jpeg" alt="Aura" />
        </div>

        <div className="about-text" ref={textRef}>
          <span className="small">eu sunt</span>
          <h2 className="big">
            <WordReveal text="Aura" trigger={textRevealed} />
          </h2>
          <p>
            Designer vizual și art director cu o pasiune pentru estetica clasică
            reinterpretată prin lentila digitală. Cred că fiecare brand merită o
            poveste vizuală care să îl diferențieze și să îl facă memorabil.
          </p>
          <p style={{ marginTop: '20px' }}>
            De la identitate vizuală la fotografie editorială, abordez fiecare
            proiect ca pe o operă de artă — cu atenție la detalii, emoție și impact.
          </p>
          <div style={{ marginTop: '32px' }}>
            <a href="#contact" className="button primary">Hai să vorbim</a>
          </div>
        </div>
      </div>
    </section>
  );
}
