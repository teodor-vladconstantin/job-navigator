import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet-async';

const TermsPage = () => (
  <>
    <Helmet>
      <title>Termeni și condiții - Joben.eu</title>
      <meta name="description" content="Citește termenii și condițiile de utilizare a platformei Joben.eu." />
      <meta property="og:title" content="Termeni și condiții - Joben.eu" />
      <meta property="og:description" content="Citește termenii și condițiile de utilizare a platformei Joben.eu." />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Joben.eu" />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Termeni și condiții - Joben.eu" />
      <meta name="twitter:description" content="Citește termenii și condițiile de utilizare a platformei Joben.eu." />
      <meta name="twitter:image" content="/og-image.png" />
    </Helmet>
    <PageLayout>
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2 text-center max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Termeni și Condiții</h1>
        <p className="text-muted-foreground">Ultima actualizare: 1 Decembrie 2024</p>
        <p className="text-muted-foreground">
          Acest document stabilește modalitatea de colaborare între Joben.eu, o platformă online, și persoanele fizice sau juridice care utilizează site-ul web www.joben.eu. În acest document, stabilim următoarele denumiri: Joben.eu sau www.joben.eu ca "Noi", iar orice persoană fizică sau juridică va fi denumită "Utilizator".
        </p>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        <Section title="Acceptarea termenilor și condițiilor">
          <p>
            Accesarea platformei www.joben.eu și utilizarea serviciilor disponibile se realizează doar prin acceptarea termenilor și condițiilor prezentate în acest document. Pentru a accepta termenii și condițiile, vom solicita acordul necondiționat al utilizatorilor prin bifarea căsuței "Am citit, sunt de acord și mă voi conforma termenilor și condițiilor www.joben.eu". Prin bifarea căsuței, orice Utilizator confirmă că a citit, este de acord și se va conforma tuturor termenilor și condițiilor din acest document. De asemenea, prin bifarea căsuței, orice Utilizator confirmă acordul său cu privire la prelucrarea datelor cu caracter personal și confidențialitatea descrise mai jos.
          </p>
          <p>
            Pentru a avea informații corecte și complete, Utilizatorul trebuie să verifice periodic pagina de termeni și condiții de pe platforma www.joben.eu; informarea cu privire la toate modificările este responsabilitatea exclusivă a Utilizatorului. După acceptarea inițială a termenilor și condițiilor, neconsultarea periodică a acestora este considerată acceptare din partea Utilizatorului.
          </p>
          <p>
            Dacă nu sunteți de acord cu prevederile termenilor și condițiilor platformei www.joben.eu, vă rugăm să nu utilizați sau să încetați utilizarea serviciilor oferite de www.joben.eu.
          </p>
        </Section>

        <Section title="1. Descrierea Serviciilor Oferite">
          <p>
            www.joben.eu se adresează în principal persoanelor juridice care doresc să publice anunțuri de angajare. Persoanele fizice pot crea un cont cu intenția de a aplica la anunțurile de muncă publicate pe platformă sau pentru a fi contactate de persoane juridice care caută în mod proactiv potențiali candidați. Indiferent de statutul juridic, toți cei care dețin un cont de acces pe platforma www.joben.eu sunt denumiți "Utilizatori".
          </p>
        </Section>

        <Section title="2. Contul de Utilizator">
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">2.a Utilizator Candidat</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Eligibilitate: Vârsta minimă pentru Utilizatorii Candidați este de 18 ani.</li>
              <li>Crearea Contului: Utilizatorii Candidați pot aplica la anunțurile de angajare fără a avea un cont de Utilizator. Pentru a fi găsiți în căutările efectuate de persoane juridice, Utilizatorii Candidați pot crea un cont prin interfața: Login – Register – Joben.eu. Activarea contului este efectuată de un administrator al platformei Joben.eu.</li>
              <li>Asistență Cont: La cererea Utilizatorului Candidat, reprezentanții Joben.eu pot asista la crearea conturilor sau redactarea profilurilor, anumite servicii fiind taxabile conform politicii comerciale a platformei.</li>
              <li>Partajarea Datelor: Prin crearea unui cont, Utilizatorii Candidați consimțesc să împărtășească detaliile de contact (de exemplu, număr de telefon, email, profil LinkedIn) cu Utilizatorii Companie în scopuri de recrutare.</li>
              <li>Date Interzise: Utilizatorii Candidați nu trebuie să furnizeze informații sensibile precum adresa de domiciliu, vârsta, genul, religia sau alte date care pot duce la decizii discriminatorii în procesele de recrutare.</li>
            </ul>

            <h3 className="font-heading text-lg font-semibold">2.b Utilizator Companie</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Eligibilitate și Verificare: Doar persoanele juridice active pot crea conturi.</li>
              <li>Aprobarea Contului: Conturile Utilizatorilor Companie sunt aprobate de echipa de administrare Joben.eu.</li>
              <li>Publicarea Anunțurilor: Anunțurile sunt publicate pentru 30 de zile după plată și aprobarea administratorului. Modificările sunt supuse unei noi revizuiri și aprobări.</li>
              <li>Acces la Baza de Date: Utilizatorii Companie pot accesa baza de date a platformei strict în scopuri de recrutare.</li>
              <li>Responsabilitatea Conținutului: Utilizatorii Companie sunt singurii responsabili pentru acuratețea, legalitatea și etica anunțurilor lor de angajare.</li>
            </ul>
          </div>
        </Section>

        <Section title="3. Publicarea Anunțurilor de Angajare">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Cerințe Anunțuri: Anunțurile de angajare trebuie să respecte standardele etice și legale. Joben.eu își rezervă dreptul de a respinge anunțurile care încalcă aceste standarde fără justificare sau compensație.</li>
            <li>Structura Tarifelor: Anunțurile pot fi publicate pentru 30 de zile după plata taxei necesare sau prin utilizarea codurilor promoționale valide. Plățile nu sunt rambursabile.</li>
            <li>Proces de Revizuire: Reprezentanții Joben.eu vor revizui anunțurile pentru a se asigura că sunt complete, explicite și non-discriminatorii. Anunțurile care nu îndeplinesc aceste standarde nu vor fi aprobate.</li>
            <li>Prevenirea Fraudei: Încercările de a posta anunțuri înșelătoare sau neetice vor duce la suspendarea sau închiderea contului.</li>
          </ul>
        </Section>

        <Section title="4. Date cu Caracter Personal">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Confidențialitatea Datelor: Joben.eu valorizează confidențialitatea datelor cu caracter personal și le utilizează în conformitate cu politica sa de confidențialitate.</li>
            <li>Responsabilitatea Utilizatorului Companie: Persoanele juridice sunt responsabile pentru colectarea și prelucrarea datelor cu caracter personal în conformitate cu legile aplicabile.</li>
            <li>Drepturile Utilizatorului Candidat: Utilizatorii Candidați pot solicita ștergerea datelor lor cu caracter personal din baza de date Joben.eu prin trimiterea unei cereri scrise la admin@joben.eu.</li>
            <li>Păstrarea Datelor: Datele cu caracter personal ale Utilizatorilor Candidați vor fi stocate în baza de date Joben.eu timp de 24 de luni, cu excepția cazului în care se solicită ștergerea.</li>
          </ul>
        </Section>

        <Section title="5. Mențiuni Speciale">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Suspendarea Contului: Joben.eu poate suspenda sau anula conturile Utilizatorilor dacă există suspiciuni de utilizare abuzivă sau acțiuni împotriva intereselor platformei. Suspendarea sau anularea contului poate avea loc fără notificare prealabilă.</li>
            <li>Acuratețea Informațiilor: Deși Joben.eu se străduiește să mențină acuratețea și calitatea informațiilor de pe platformă, nu garantează corectitudinea informațiilor furnizate de Utilizatori sau anunțurilor de angajare.</li>
            <li>Responsabilitatea Utilizatorului: Utilizatorii sunt încurajați să exercite precauție atunci când răspund la anunțurile de angajare sau furnizează informații sensibile. Joben.eu nu este responsabilă pentru daunele financiare sau de reputație care decurg din utilizarea abuzivă a platformei.</li>
          </ul>
        </Section>

        <Section title="6. Forță Majoră">
          <p>
            Joben.eu nu este responsabilă pentru erorile operaționale cauzate de evenimente de forță majoră cum ar fi defecțiuni ale internetului, probleme tehnice sau circumstanțe neprevăzute precum pandemii, greve sau alte perturbări.
          </p>
        </Section>

        <Section title="7. Soluționarea Disputelor">
          <p>
            Orice dispută între Utilizatori și Joben.eu va fi soluționată mai întâi pe cale amiabilă. Dacă nu se poate ajunge la o rezolvare amiabilă, disputele vor fi trimise către instanțele competente din România.
          </p>
        </Section>

        <Section title="Contact">
          <p className="text-muted-foreground">Pentru întrebări suplimentare sau notificări, vă rugăm să contactați: admin@joben.eu</p>
        </Section>
      </div>


    </div>
  </PageLayout>
  </>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <section className="p-6 rounded-2xl border border-border bg-card shadow-card space-y-3">
    <h2 className="font-heading text-xl font-semibold">{title}</h2>
    <div className="space-y-3 text-foreground/90">{children}</div>
  </section>
);

export default TermsPage;
