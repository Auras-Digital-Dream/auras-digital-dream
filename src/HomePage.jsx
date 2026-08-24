import { useEffect, useRef, useState, useCallback } from 'react';

/* ══════════════════════════════════════════════════════════════════════════
   HomePage — Renaissance Redesign
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Scramble Text Hook ── */
function useScramble(phrases, intervalMs = 3000) {
  const [text, setText] = useState('_');
  const idxRef = useRef(0);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  const scramble = useCallback((target) => {
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
  }, []);

  useEffect(() => {
    scramble(phrases[0]);
    const timer = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % phrases.length;
      scramble(phrases[idxRef.current]);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [phrases, intervalMs, scramble]);

  return text;
}

/* ── Intersection Observer Hook ── */
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

/* ── Particle Canvas ── */
function ParticlesCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let rafId;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 40;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        o: Math.random() * 0.3 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.globalAlpha = p.o;
        ctx.fillStyle = '#A79F83';
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="particles-canvas" />;
}

/* ── SVG Ornament ── */
function SvgOrnament() {
  const ref = useRef(null);
  const revealed = useReveal(ref, 0.5);
  return (
    <svg ref={ref} className={`svg-ornament ${revealed ? 'drawn' : ''}`} viewBox="0 0 120 40">
      <path d="M10,20 Q30,5 60,20 Q90,35 110,20 M60,20 L60,35 M60,20 L60,5 M40,20 L40,30 M80,20 L80,30" />
    </svg>
  );
}

/* ── 3D Tilt Card ── */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = (y - cy) / 12;
    const ry = (cx - x) / 12;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    el.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  };
  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

/* ── Word Reveal ── */
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

/* ══════════════════════════════════════════════════════════════════════════
   Sections
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Hero ── */
function HeroSection() {
  const scramble = useScramble([
    'Design renascentist',
    'Animații cinematice',
    'Experiențe imersive',
    'Artă digitală',
  ]);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      if (sectionRef.current) {
        sectionRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
        sectionRef.current.style.opacity = String(Math.max(0, 1 - scrolled / 600));
      }
      if (videoRef.current) {
        const duration = videoRef.current.duration || 7;
        const progress = Math.min(scrolled / 800, 1);
        videoRef.current.currentTime = progress * duration;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero" id="studio">
      <div className="hero-video-bg">
        <video ref={videoRef} muted playsInline preload="auto" loop>
          <source src="/assets/books-cinematic/hero-waves.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
      </div>

      <div ref={sectionRef} className="hero-content">
        <div className="hero-eyebrow">Portofoliu Digital</div>
        <h1 className="hero-title">
          Aura's<br />Digital Dream
        </h1>
        <p className="hero-subtitle">
          Transform ideile tale în experiențe digitale memorabile, care inspiră,
          conectează și lasă o impresie de durată.
        </p>
        <div className="scramble-text" style={{ marginBottom: '40px' }}>
          {scramble}
        </div>
        <div className="hero-actions">
          <a href="#portofoliu" className="button primary">
            Începe proiectul tău ↗
          </a>
          <a href="#despre-mine" className="button ghost">
            Descoperă povestea
          </a>
        </div>

        {/* Siglă circulară rotativă */}
        <div style={{ marginTop: '60px', position: 'relative', width: '120px', height: '120px', marginLeft: 'auto', marginRight: 'auto' }}>
          <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', animation: 'spin 20s linear infinite' }}>
            <defs>
              <path id="circlePath" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
            </defs>
            <text fill="#A79F83" fontSize="11" fontFamily="EB Garamond" letterSpacing="3">
              <textPath href="#circlePath">
                CREATIVITATE • STRATEGIE • IMPACT •
              </textPath>
            </text>
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-display)',
            fontSize: '36px',
            color: 'var(--charcoal)',
          }}>A</div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

/* ── Services ── */
function ServicesSection() {
  const ref = useRef(null);
  const revealed = useReveal(ref);
  const services = [
    { title: 'Identitate Vizuală', desc: 'Logo, paletă, tipografie și sistem vizual complet pentru brandul tău.' },
    { title: 'Web Design', desc: 'Site-uri care spun povești. Fiecare pixel are un scop.' },
    { title: 'Social Media', desc: 'Conținut vizual coerent care construiește comunitate.' },
    { title: 'Editorial', desc: 'Layout-uri pentru cărți, reviste și publicații de artă.' },
    { title: 'Fotografie', desc: 'Portrete editoriale și sesiuni conceptuale.' },
    { title: 'Art Direction', desc: 'Viziune artistică pentru campanii și proiecte speciale.' },
  ];

  return (
    <section id="servicii" style={{ padding: '120px var(--gutter)', background: 'var(--paper)' }}>
      <div ref={ref} className={`reveal-on-scroll ${revealed ? 'is-revealed' : ''}`}>
        <div className="section-head">
          <div className="section-kicker">Ce ofer</div>
          <h2 className="section-title">Servicii</h2>
          <p className="section-lead">Fiecare proiect este o colaborare. Aduc expertiză vizuală, strategie și pasiune.</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {services.map((s, i) => (
          <TiltCard key={i}>
            <div className="glass-panel" style={{ padding: '40px 32px', height: '100%' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(195,190,164,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                color: 'var(--teal-dark)',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                color: 'var(--charcoal)',
                marginBottom: '12px',
                fontWeight: 400,
              }}>{s.title}</h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'var(--bronze-light)',
                lineHeight: 1.7,
              }}>{s.desc}</p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

/* ── Portfolio ── */
function PortfolioSection() {
  const ref = useRef(null);
  const revealed = useReveal(ref);
  const projects = [
    { title: 'Lovera Brand', category: 'Identitate Vizuală', img: '/portfolio/auras-trend-vault/editorial-2026/editorial-golden-light.jpeg' },
    { title: 'Renaissance Editorial', category: 'Fotografie', img: '/portfolio/auras-trend-vault/editorial-2026/editorial-black-white.jpeg' },
    { title: 'Digital Dreams', category: 'Web Design', img: '/portfolio/auras-trend-vault/editorial-2026/editorial-city-motion.jpeg' },
    { title: 'The New York Times', category: 'Art Direction', img: '/portfolio/auras-trend-vault/editorial-2026/vogue-cover.jpeg' },
  ];

  return (
    <section id="portofoliu" style={{ padding: '120px var(--gutter)', background: 'var(--cream)', position: 'relative' }}>
      <div className="mesh-gradient" />
      <ParticlesCanvas />

      <div ref={ref} className={`reveal-on-scroll ${revealed ? 'is-revealed' : ''}`} style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-head">
          <div className="section-kicker">Lucrări selectate</div>
          <h2 className="section-title">Portofoliu</h2>
          <p className="section-lead">Proiecte care îmbină estetica clasică cu tehnologia modernă.</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
      }}>
        {projects.map((p, i) => (
          <TiltCard key={i}>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              aspectRatio: i % 3 === 0 ? '4/5' : '3/4',
              cursor: 'pointer',
            }}>
              <img
                src={p.img}
                alt={p.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.2s var(--ease-out)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(transparent 50%, rgba(26,24,21,0.7) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '32px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--beige-gold)',
                  marginBottom: '8px',
                }}>{p.category}</span>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  color: 'var(--cream)',
                  fontWeight: 400,
                }}>{p.title}</h3>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

/* ── About ── */
function AboutSectionInline() {
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

/* ── Process / Transition ── */
function ProcessSection() {
  const ref = useRef(null);
  const revealed = useReveal(ref);

  return (
    <section style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'clip',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}>
        <img
          src="/assets/editorial/golden-portrait-clean.jpg"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(237,237,233,0.9) 0%, rgba(237,237,233,0.4) 100%)',
        }} />
      </div>

      <div ref={ref} className={`reveal-on-scroll ${revealed ? 'is-revealed' : ''}`} style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '600px',
        padding: 'var(--gutter)',
      }}>
        <div className="section-kicker">Procesul meu</div>
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '24px' }}>
          De la idee<br />la realitate
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          color: 'var(--bronze-light)',
          lineHeight: 1.8,
          marginBottom: '32px',
        }}>
          Fiecare proiect începe cu o conversație. Ascult, înțeleg viziunea ta,
          apoi traduc emoția în formă vizuală. Designul nu e doar frumos — e funcțional,
          strategic și autentic.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['Discovery', 'Concept', 'Design', 'Lansare'].map((step, i) => (
            <div key={step} style={{
              padding: '12px 24px',
              background: 'rgba(195,190,164,0.2)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--charcoal)',
              border: '1px solid var(--beige-gold)',
            }}>
              {String(i + 1).padStart(2, '0')} {step}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Insights / Testimonials ── */
function InsightsSection() {
  const ref = useRef(null);
  const revealed = useReveal(ref);

  return (
    <section id="insights" style={{ padding: '120px var(--gutter)', background: 'var(--paper)' }}>
      <div ref={ref} className={`reveal-on-scroll ${revealed ? 'is-revealed' : ''}`}>
        <div className="section-head">
          <div className="section-kicker">Impresii</div>
          <h2 className="section-title">Insights</h2>
          <p className="section-lead">Cuvinte de la cei cu care am lucrat.</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {[
          { quote: 'Aura a transformat viziunea noastră într-o identitate vizuală care ne reprezintă perfect. Atentă la detalii și creativă.', author: 'Client Lovera' },
          { quote: 'Colaborarea a fost fluidă, iar rezultatul a depășit așteptările. Recomand cu încredere.', author: 'Client Editorial' },
        ].map((t, i) => (
          <TiltCard key={i}>
            <div className="glass-panel" style={{ padding: '40px' }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '20px',
                fontStyle: 'italic',
                color: 'var(--charcoal)',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}>"{t.quote}"</p>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--bronze-light)',
              }}>— {t.author}</span>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

/* ── Contact CTA ── */
function ContactSection() {
  const ref = useRef(null);
  const revealed = useReveal(ref);

  return (
    <section id="contact" style={{
      padding: '120px var(--gutter)',
      background: 'var(--charcoal)',
      textAlign: 'center',
    }}>
      <div ref={ref} className={`reveal-on-scroll ${revealed ? 'is-revealed' : ''}`}>
        <div className="section-kicker" style={{ color: 'var(--beige-gold)' }}>Contact</div>
        <h2 className="section-title" style={{ color: 'var(--cream)', marginBottom: '24px' }}>
          Hai să creăm<br />împreună
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          color: 'var(--bronze-light)',
          maxWidth: '480px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Ai un proiect în minte? Să îl transformăm în realitate.
        </p>
        <a href="mailto:hello@aurastudios.ro" className="button primary" style={{
          background: 'var(--cream)',
          color: 'var(--charcoal)',
        }}>
          hello@aurastudios.ro
        </a>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HomePage Export
   ══════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SvgOrnament />
      <ServicesSection />
      <SvgOrnament />
      <PortfolioSection />
      <SvgOrnament />
      <AboutSectionInline />
      <SvgOrnament />
      <ProcessSection />
      <SvgOrnament />
      <InsightsSection />
      <SvgOrnament />
      <ContactSection />
    </main>
  );
}
