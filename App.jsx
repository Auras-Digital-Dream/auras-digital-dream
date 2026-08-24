import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import AboutSection from './AboutSection';
import EditorialPage from './EditorialPage';
import Footer from './Footer';
import './main.css';

/* ── Scroll to top on route change ── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

/* ── Scroll Progress Bar ── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

/* ── Custom Cursor ── */
function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  if (isTouch) return null;

  return (
    <>
      <div
        className="custom-cursor"
        style={{
          transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
          opacity: visible ? 1 : 0,
        }}
      />
      <div
        className="custom-cursor-ring"
        style={{
          transform: `translate(${pos.x - 16}px, ${pos.y - 16}px)`,
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
}

/* ── Masthead ── */
function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="masthead" style={{ background: scrolled ? 'rgba(237,237,233,0.92)' : 'rgba(237,237,233,0.75)' }}>
      <button className="masthead-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img src="/assets/logo-lovera.jpg" alt="LOVERA" />
        <span>Aura's Digital Dream</span>
      </button>

      <nav className="masthead-nav">
        <button onClick={() => scrollTo('studio')}>Studio</button>
        <button onClick={() => scrollTo('servicii')}>Servicii</button>
        <button onClick={() => scrollTo('portofoliu')}>Portofoliu</button>
        <button onClick={() => scrollTo('despre-mine')}>Despre Mine</button>
        <button onClick={() => scrollTo('insights')}>Insights</button>
        <button className="masthead-cta" onClick={() => scrollTo('contact')}>
          Hai să creăm ↗
        </button>
      </nav>

      <button className="masthead-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Meniu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {menuOpen ? (
            <><path d="M18 6L6 18M6 6l12 12"/></>
          ) : (
            <><path d="M3 12h18M3 6h18M3 18h18"/></>
          )}
        </svg>
      </button>

      {menuOpen && (
        <div className="mobile-nav" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(237,237,233,0.95)',
          backdropFilter: 'blur(20px)',
          padding: '24px var(--gutter)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          borderBottom: '1px solid var(--beige-gold)',
        }}>
          {['Studio','Servicii','Portofoliu','Despre Mine','Insights'].map((item) => (
            <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(' ','-'))}
              style={{ background:'none', border:'none', fontFamily:'var(--font-body)', fontSize:'16px', textAlign:'left', cursor:'pointer', color:'var(--charcoal)' }}>
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

/* ── Main App ── */
function AppContent() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Masthead />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editorial" element={<EditorialPage />} />
      </Routes>

      {isHome && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
