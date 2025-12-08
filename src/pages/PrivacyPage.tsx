import React from 'react';
import PageLayout from '@/components/layout/PageLayout';

const PrivacyPage = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2 text-center max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Politica de Confidențialitate</h1>
        <p className="text-muted-foreground">Ultima actualizare: 8 Decembrie 2025</p>
        <p className="text-muted-foreground">
          Această politică explică modul în care Joben.eu colectează, utilizează și protejează datele cu caracter personal ale Utilizatorilor platformei www.joben.eu ("Platforma"). Termenii "noi" sau "Joben.eu" se referă la operatorul platformei, iar "Utilizator" se referă la orice persoană fizică sau juridică ce folosește Platforma.
        </p>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        <Section title="1. Ce date colectăm">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>
              Date oferite de Utilizatorii Candidați: nume, e-mail, număr de telefon, CV, profil LinkedIn, competențe, experiență, preferințe salariale, locație, alte informații furnizate voluntar în profil sau aplicații.
            </li>
            <li>
              Date oferite de Utilizatorii Companie: denumire companie, CUI, persoană de contact, e-mail, telefon, funcție, descrieri ale rolurilor și beneficiilor, logo și link-uri către site sau profiluri sociale.
            </li>
            <li>
              Date tehnice și de utilizare: adresa IP, tip browser și dispozitiv, sistem de operare, pagini vizualizate, durata sesiunii, identificatori de sesiune, date de autentificare și loguri de securitate.
            </li>
            <li>
              Comunicații: mesajele pe care ni le transmiteți (e-mail, formular contact) și răspunsurile trimise de noi.
            </li>
          </ul>
        </Section>

        <Section title="2. Cum folosim datele">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Prestarea serviciilor: creare și administrare conturi, publicare anunțuri, aplicare la joburi, notificări privind statusul aplicațiilor.</li>
            <li>Siguranță și prevenirea abuzului: prevenirea fraudelor, monitorizare acces neautorizat, menținerea integrității Platformei.</li>
            <li>Îmbunătățirea produsului: analiză agregată și anonimizată a utilizării pentru a optimiza funcționalități și experiența Utilizatorilor.</li>
            <li>Comunicări: răspuns la solicitări, mesaje operaționale, informări despre funcționalități relevante; marketing doar cu consimțământ unde este cazul.</li>
            <li>Conformitate legală: îndeplinirea obligațiilor legale și fiscale, răspuns la solicitările autorităților.</li>
          </ul>
        </Section>

        <Section title="3. Temeiuri legale">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Executarea unui contract sau demersuri precontractuale (art. 6 alin. 1 lit. b GDPR) – furnizarea serviciilor Platformei.</li>
            <li>Consimțământ (art. 6 alin. 1 lit. a GDPR) – newsletter, comunicări comerciale, anumite cookie-uri; consimțământul poate fi retras în orice moment.</li>
            <li>Obligație legală (art. 6 alin. 1 lit. c GDPR) – facturare, arhivare, raportare către autorități.</li>
            <li>Interes legitim (art. 6 alin. 1 lit. f GDPR) – securitate, prevenire fraudă, măsurarea performanței, dezvoltarea produsului, comunicări esențiale.</li>
          </ul>
        </Section>

        <Section title="4. Durata de stocare">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Date de profil și aplicații ale Utilizatorilor Candidați: 24 de luni de la ultima interacțiune sau până la ștergere la cerere.</li>
            <li>Date ale Utilizatorilor Companie: 24 de luni de la încetarea relației contractuale sau până la ștergere la cerere, cu respectarea obligațiilor legale.</li>
            <li>Loguri tehnice și de securitate: până la 12 luni, pentru prevenirea abuzului și investigarea incidentelor.</li>
            <li>Date de facturare și documente contabile: conform obligațiilor fiscale aplicabile (minim 5 ani).</li>
          </ul>
        </Section>

        <Section title="5. Drepturile persoanelor vizate">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Dreptul de acces, rectificare și ștergere ("dreptul de a fi uitat").</li>
            <li>Dreptul la restricționare sau opoziție față de prelucrare.</li>
            <li>Dreptul la portabilitatea datelor.</li>
            <li>Dreptul de a retrage consimțământul, unde temeiul este consimțământul.</li>
            <li>Dreptul de a depune plângere la ANSPDCP: <a className="hover:text-primary transition-smooth" href="https://www.dataprotection.ro" target="_blank" rel="noreferrer">www.dataprotection.ro</a>.</li>
          </ul>
          <p className="text-muted-foreground">Pentru exercitarea drepturilor, ne puteți contacta la admin@joben.eu. Vom răspunde în termenul legal.</p>
        </Section>

        <Section title="6. Cookie-uri și tehnologii similare">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Folosim cookie-uri necesare pentru funcționarea Platformei și, unde este cazul, cookie-uri de analiză sau preferințe.</li>
            <li>Vă puteți ajusta preferințele din setările browserului sau prin bannerul de consimțământ (dacă este disponibil). Limitarea cookie-urilor poate afecta funcționarea Platformei.</li>
          </ul>
        </Section>

        <Section title="7. Cine are acces la date">
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Furnizori de servicii: găzduire, e-mail, instrumente de analiză, procesare plăți, suport tehnic – doar pe baza unor acorduri de prelucrare a datelor.</li>
            <li>Autorități publice: atunci când suntem obligați legal.</li>
            <li>Transferuri în afara UE/SEE: doar dacă există garanții adecvate (clauze contractuale standard sau decizii de adecvare), cu informarea Utilizatorilor.</li>
          </ul>
        </Section>

        <Section title="8. Securitatea datelor">
          <p className="text-muted-foreground">
            Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele (control acces, criptare la transport, loguri de securitate). Nicio platformă nu poate garanta securitatea absolută; vă recomandăm să păstrați datele de autentificare în siguranță și să semnalați imediat tentativele de phishing sau acces neautorizat.
          </p>
        </Section>

        <Section title="9. Minori">
          <p className="text-muted-foreground">
            Platforma este destinată persoanelor cu vârsta de minimum 18 ani. Nu colectăm intenționat date despre minori; dacă identificăm astfel de date, le vom șterge fără întârziere.
          </p>
        </Section>

        <Section title="10. Actualizări ale politicii">
          <p className="text-muted-foreground">
            Putem actualiza această politică pentru a reflecta modificări legislative sau funcționale. Vom publica versiunea actualizată pe Platformă, iar continuarea utilizării serviciilor după publicare reprezintă acceptarea modificărilor.
          </p>
        </Section>

        <Section title="Contact">
          <p className="text-muted-foreground">Întrebări sau solicitări privind protecția datelor: admin@joben.eu</p>
        </Section>
      </div>
    </div>
  </PageLayout>
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

export default PrivacyPage;
