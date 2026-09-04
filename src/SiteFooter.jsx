import { FacebookLogo, InstagramLogo, LinkedinLogo, TiktokLogo, WhatsappLogo } from "@phosphor-icons/react";

/* Un singur footer, folosit pe toate paginile (Acasă, Studio, Cărțile mele,
   Contact, paginile de proiect) — vezi src/renaissance-refresh.css pentru
   arcada și decuparea imaginii. */
export function SiteFooter() {
  return (
    <footer className="site-footer bg-ink-marble" id="footer">
      <div className="footer-image" aria-hidden="true">
        <img src="/assets/footer-bg.webp" alt="" />
      </div>
      <div className="footer-plinth">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <img src="/assets/logo.webp" alt="" aria-hidden="true" />
            <div>
              <strong>Aura's Digital Dream</strong>
              <p>Marketing, design și soluții digitale, cu suflet.</p>
            </div>
          </div>
          <nav className="footer-social" aria-label="Rețele sociale">
            <a href="https://www.instagram.com/aurasdigitaldream" aria-label="Instagram"><InstagramLogo size={20} /></a>
            <a href="https://www.facebook.com/auratrendvault" aria-label="Facebook"><FacebookLogo size={20} /></a>
            <a href="https://www.tiktok.com/@aurasdigitaldream" aria-label="TikTok"><TiktokLogo size={20} /></a>
            <a href="https://www.linkedin.com/in/aurelia-dobre-a033b2104" aria-label="LinkedIn"><LinkedinLogo size={20} /></a>
            <a href="https://wa.me/40762509423" aria-label="WhatsApp"><WhatsappLogo size={20} /></a>
          </nav>
          <p className="footer-legal">© 2026 Aura's Digital Dream. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
