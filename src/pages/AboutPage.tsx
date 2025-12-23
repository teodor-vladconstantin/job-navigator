import { CheckCircle2 } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet-async';

const bullets = {
  transparenta: [
    'Informații clare despre joburi',
    'Salariu vizibil (când angajatorul alege)',
    'Proces simplu de aplicare',
  ],
  simplitate: [
    'Fără formulare interminabile',
    'One-click apply pentru candidați autentificați',
    'Interfață intuitivă',
  ],
  incluziune: [
    'Job board general, nu limitat la tech',
    'Oportunități pentru toate nivelurile',
    'Accesibil pentru toți profesioniștii',
  ],
};

const AboutPage = () => (
  <>
    <Helmet>
      <title>Despre Joben.eu - Platformă rapidă pentru joburi</title>
      <meta name="description" content="Află misiunea și valorile Joben.eu, platforma unde aplici la joburi în &lt;30 secunde, fără formulare inutile." />
      <meta property="og:title" content="Despre Joben.eu - Platformă rapidă pentru joburi" />
      <meta property="og:description" content="Află misiunea și valorile Joben.eu, platforma unde aplici la joburi în &lt;30 secunde, fără formulare inutile." />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Joben.eu" />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Despre Joben.eu - Platformă rapidă pentru joburi" />
      <meta name="twitter:description" content="Află misiunea și valorile Joben.eu, platforma unde aplici la joburi în &lt;30 secunde, fără formulare inutile." />
      <meta name="twitter:image" content="/og-image.png" />
    </Helmet>
    <PageLayout>
    <div className="bg-gradient-hero">
      <div className="container mx-auto px-4 py-12 md:py-16 space-y-12">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-primary">Despre joben.eu</p>
          <h1 className="font-heading font-extrabold text-3xl md:text-5xl leading-tight">
            Conectăm talente cu oportunități în România
          </h1>
          <p className="text-muted-foreground text-lg">
            Platforma unde aplici la joburi în mai puțin de 30 de secunde. Fără formulare interminabile, doar potriviri rapide între candidați și angajatori.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
            <h2 className="font-heading text-2xl font-semibold mb-3">Misiunea noastră</h2>
            <p className="text-muted-foreground leading-relaxed">
              Misiunea noastră este să simplificăm procesul de căutare a unui loc de muncă și de recrutare, oferind o platformă intuitivă, rapidă și accesibilă pentru toți profesioniștii din România, indiferent de domeniul de activitate.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
            <h2 className="font-heading text-2xl font-semibold mb-3">Viziunea noastră</h2>
            <p className="text-muted-foreground leading-relaxed">
              Viziunea noastră este să devenim principala platformă de conectare între talente și oportunități profesionale în România, unde fiecare candidat găsește jobul potrivit și fiecare angajator găsește candidatul ideal, într-un mod simplu, transparent și eficient.
            </p>
          </div>
        </div>

        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Valorile noastre</h2>
            <p className="text-muted-foreground">Tot ce construim pornește de la transparență, simplitate și incluziune.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard title="Transparență" items={bullets.transparenta} />
            <ValueCard title="Simplitate" items={bullets.simplitate} />
            <ValueCard title="Incluziune" items={bullets.incluziune} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-card space-y-3">
            <h3 className="font-heading text-xl font-semibold">Pentru Candidați</h3>
            <p className="text-muted-foreground">Găsește jobul potrivit din toate industriile</p>
            <p className="text-muted-foreground">Aplică rapid cu un singur click</p>
            <p className="text-muted-foreground">Creează cont candidat</p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card shadow-card space-y-3">
            <h3 className="font-heading text-xl font-semibold">Pentru Angajatori</h3>
            <p className="text-muted-foreground">Găsește candidați calificați rapid și eficient</p>
            <p className="text-muted-foreground">Postează joburi în câteva minute</p>
            <p className="text-muted-foreground">Gestionează aplicațiile într-un singur loc</p>
            <p className="text-muted-foreground">Contactează candidații potriviți</p>
          </div>
        </section>

        <section className="text-center py-10 rounded-3xl bg-gradient-primary text-white shadow-card">
          <h3 className="font-heading text-3xl font-bold mb-3">Ai întrebări sau sugestii?</h3>
          <p className="text-white/90 mb-6">Suntem aici să te ajutăm. Contactează-ne și îți vom răspunde în cel mai scurt timp.</p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-smooth text-white font-semibold"
          >
            Contactează-ne
          </a>
        </section>
      </div>


    </div>
  </PageLayout>
  </>
);

interface ValueCardProps {
  title: string;
  items: string[];
}

const ValueCard = ({ title, items }: ValueCardProps) => (
  <div className="p-6 rounded-2xl border border-border bg-card shadow-card space-y-3">
    <h3 className="font-heading text-xl font-semibold">{title}</h3>
    <ul className="space-y-2 text-muted-foreground">
      {items.map(item => (
        <li key={item} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary mt-1" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default AboutPage;
