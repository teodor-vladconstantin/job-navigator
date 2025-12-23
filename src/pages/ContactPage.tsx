import { Clock, Mail, MessageSquare } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet-async';

const ContactPage = () => (
  <>
    <Helmet>
      <title>Contact Joben.eu - Suport rapid pentru candidați și angajatori</title>
      <meta name="description" content="Contactează Joben.eu pentru suport, întrebări sau colaborări. Răspundem rapid la orice solicitare." />
      <meta property="og:title" content="Contact Joben.eu - Suport rapid pentru candidați și angajatori" />
      <meta property="og:description" content="Contactează Joben.eu pentru suport, întrebări sau colaborări. Răspundem rapid la orice solicitare." />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Joben.eu" />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Contact Joben.eu - Suport rapid pentru candidați și angajatori" />
      <meta name="twitter:description" content="Contactează Joben.eu pentru suport, întrebări sau colaborări. Răspundem rapid la orice solicitare." />
      <meta name="twitter:image" content="/og-image.png" />
    </Helmet>
    <PageLayout>
    <div className="container mx-auto px-4 py-12 space-y-10">
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Contact</h1>
        <p className="text-muted-foreground">
          Suntem aici să te ajutăm. Scrie-ne și revenim rapid cu un răspuns clar și acționabil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="md:col-span-2 p-6 rounded-2xl border border-border bg-card shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-semibold">Scrie-ne direct</h2>
              <p className="text-muted-foreground">admin@joben.eu</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Trimite-ne contextul tău (companie, rol, ce cauți) și revenim cu pașii următori. Pentru cereri urgente,
            te rugăm să menționezi termenul limită.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:admin@joben.eu"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-smooth"
            >
              <MessageSquare className="w-4 h-4" />
              Trimite email
            </a>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Răspundem în &lt; 24h (Luni–Vineri)
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-muted/40 space-y-3">
          <h3 className="font-heading text-lg font-semibold">Program suport</h3>
          <p className="text-muted-foreground text-sm">Luni–Vineri, 09:00–18:00 EET</p>
          <div className="h-px bg-border" />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Întrebări despre cont și acces</li>
            <li>• Suport candidați și aplicații</li>
            <li>• Publicare și promovare joburi</li>
            <li>• Parteneriate și colaborări media</li>
            <li>• Feedback despre produs</li>
          </ul>
        </div>
      </div>
    </div>


  </PageLayout>
  </>
);

export default ContactPage;
