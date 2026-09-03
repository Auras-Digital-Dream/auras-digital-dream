import { WhatsappLogo } from "@phosphor-icons/react";
import { GlobalNavigation } from "./editorial/components/GlobalNavigation.tsx";
import { MedusaForm } from "./MedusaForm";
import { SiteFooter } from "./SiteFooter.jsx";

/* Pagina de contact — fosta secțiune „Atelier" din /studio, mutată aici ca
   pagină de sine stătătoare. MedusaForm își aduce propria coregrafie de
   scroll (600vh, fixată); pagina îi adaugă doar nav-ul global și butonul
   flotant de WhatsApp, ca la celelalte pagini ale site-ului. */
export function ContactPage() {
  return (
    <main className="home">
      <GlobalNavigation currentPath="/contact" />
      <MedusaForm />
      <SiteFooter />
      <a className="whatsapp-fab" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp">
        <WhatsappLogo size={26} weight="fill" />
      </a>
    </main>
  );
}
