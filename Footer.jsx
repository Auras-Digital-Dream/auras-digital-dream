import { useEffect, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════════════════════════
   Footer — Renaissance Redesign
   Background: Imaginea #5 (mese de femei cu laptopuri)
   Text: "auras digital dream" + social media + animație loop
   ══════════════════════════════════════════════════════════════════════════ */

function ScrambleLoop({ phrases, intervalMs = 2500 }) {
  const [text, setText] = useState(phrases[0]);
  const idxRef = useRef(0);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  useEffect(() => {
    const scramble = (target) => {
      let iteration = 0;
      const int = setInterval(() => {
        setText(
          target
            .split('')
            .map((letter, i) => (i < iteration ? target[i] : chars[Math.floor(Math.random() * chars.length)]))
            .join('')
        );
        if (iteration >= target.length) clearInterval(int);
        iteration += 1 / 2;
      }, 30);
    };

    scramble(phrases[0]);
    const timer = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % phrases.length;
      scramble(phrases[idxRef.current]);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [phrases, intervalMs]);

  return <span>{text}</span>;
}

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Background image #5 */}
      <div className="footer-bg">
        <img src="/assets/footer-bg.jpg" alt="" />
        <div className="footer-bg-overlay" />
      </div>

      <div className="footer-content">
        {/* Brand text */}
        <div className="footer-brand-text">
          auras<br />digital dream
        </div>

        {/* Loop animation text */}
        <div className="footer-loop-text">
          <ScrambleLoop
            phrases={[
              'Creativitate fără limite',
              'Design care inspiră',
              'Artă digitală pură',
              'Experiențe memorabile',
            ]}
          />
        </div>

        {/* Social media icons */}
        <div className="footer-social">
          <a href="https://instagram.com/auras.digital.dream" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="https://behance.net/aurasdigitaldream" target="_blank" rel="noopener noreferrer" aria-label="Behance">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h6a4 4 0 0 1 4 4 4 4 0 0 1-4 4H3V3z"/>
              <path d="M3 11h7a4 4 0 0 1 4 4 4 4 0 0 1-4 4H3v-8z"/>
              <line x1="15" y1="4" x2="21" y2="4"/>
              <line x1="15" y1="20" x2="21" y2="20"/>
              <path d="M18 4a3 3 0 0 1 0 6"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/aurasdigitaldream" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a href="https://pinterest.com/aurasdigitaldream" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="8" x2="12" y2="21"/>
              <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
              <path d="M8.5 9.5a4 4 0 0 1 7 0"/>
            </svg>
          </a>
        </div>

        {/* Legal */}
        <div className="footer-legal">
          © {new Date().getFullYear()} Aura's Digital Dream. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
}
