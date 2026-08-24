import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ══════════════════════════════════════════════════════════════════════════
   EditorialPage — Imagini Editoriale
   Cele 7 portrete într-o galerie imersivă cu scroll storytelling
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

/* ── Parallax Image ── */
function ParallaxImage({ src, alt, speed = 0.3, className = '', style = {} }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      setOffset((progress - 0.5) * 100 * speed);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden', ...style }}>
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '120%',
          objectFit: 'cover',
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.1s linear',
        }}
      />
    </div>
  );
}

/* ── Editorial Item with Overlay ── */
function EditorialItem({ src, alt, title, category, span = 'span-6', tall = false, bw = false }) {
  const ref = useRef(null);
  const revealed = useReveal(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`editorial-item ${span} ${tall ? 'tall' : 'wide'} ${bw ? 'bw' : ''} ${revealed ? 'is-revealed' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <ParallaxImage src={src} alt={alt} speed={0.2} style={{ height: '100%', borderRadius: 'var(--radius)' }} />
      <div className="overlay" style={{ opacity: hovered ? 1 : 0 }}>
        <div>
          <span style={{ display: 'block', marginBottom: '8px', color: 'var(--beige-gold)' }}>{category}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--cream)' }}>{title}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function EditorialPage() {
  const heroRef = useRef(null);
  const heroRevealed = useReveal(heroRef);

  const images = [
    {
      src: '/assets/editorial-aura-red.jpg',
      alt: 'Aura in Red',
      title: 'Aura in Red',
      category: 'Portret Editorial',
      span: 'span-6',
      tall: true,
      bw: false,
    },
    {
      src: '/assets/editorial-details-face.jpg',
      alt: 'Details Over Face',
      title: 'Fragmente de Ego',
      category: 'Colaj Artistic',
      span: 'span-6',
      tall: true,
      bw: false,
    },
    {
      src: '/assets/editorial-bw-portrait.jpg',
      alt: 'Black and White Portrait',
      title: 'Lumina și Umbra',
      category: 'Portret B&W',
      span: 'span-4',
      tall: false,
      bw: true,
    },
    {
      src: '/assets/editorial-contrast.jpg',
      alt: 'Contrast Portrait',
      title: 'Contrast',
      category: 'Portret Color',
      span: 'span-4',
      tall: false,
      bw: true,
    },
    {
      src: '/assets/editorial-elegant.jpg',
      alt: 'Elegant Photo',
      title: 'Eleganță Naturală',
      category: 'Lifestyle',
      span: 'span-4',
      tall: false,
      bw: false,
    },
    {
      src: '/assets/editorial-nyt.jpg',
      alt: 'New York Times',
      title: 'Breaking News',
      category: 'Art Direction',
      span: 'span-8',
      tall: true,
      bw: false,
    },
    {
      src: '/assets/editorial-upside-down.jpg',
      alt: 'Upside Down',
      title: 'Perspectivă Inversă',
      category: 'Conceptual',
      span: 'span-4',
      tall: true,
      bw: false,
    },
  ];

  return (
    <main style={{ background: 'var(--paper)', paddingTop: '80px' }}>
      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px var(--gutter)',
          position: 'relative',
          overflow: 'clip',
        }}
      >
        <div className="mesh-gradient" />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-kicker">Proiecte Editoriale</div>
          <h1
            className="section-title"
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              opacity: heroRevealed ? 1 : 0,
              transform: heroRevealed ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            Imagini<br />Editoriale
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              color: 'var(--bronze-light)',
              maxWidth: '560px',
              margin: '24px auto 0',
              lineHeight: 1.7,
              opacity: heroRevealed ? 1 : 0,
              transform: heroRevealed ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          >
            O colecție de portrete, concepte și direcții artistice care definesc
            estetica mea vizuală — între clasic și contemporan.
          </p>
        </div>
      </section>

      {/* Back link */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 var(--gutter) 40px' }}>
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--bronze-light)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.3s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--teal-dark)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--bronze-light)'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Înapoi la pagina principală
        </Link>
      </div>

      {/* Gallery Grid */}
      <section style={{ padding: '0 var(--gutter) 120px' }}>
        <div className="editorial-grid">
          {images.map((img, i) => (
            <EditorialItem key={i} {...img} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px var(--gutter)',
        textAlign: 'center',
        background: 'var(--charcoal)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 56px)',
          color: 'var(--cream)',
          marginBottom: '24px',
        }}>
          Vrei o ședință foto?
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          color: 'var(--bronze-light)',
          marginBottom: '32px',
        }}>
          Hai să discutăm despre conceptul tău.
        </p>
        <a href="mailto:hello@aurastudios.ro" className="button primary" style={{
          background: 'var(--cream)',
          color: 'var(--charcoal)',
        }}>
          Contactează-mă
        </a>
      </section>
    </main>
  );
}
