
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';


const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Pagină inexistentă | Joben.eu</title>
        <meta name="description" content="Pagina căutată nu există pe Joben.eu. Înapoi la joburi sau homepage." />
        <meta property="og:title" content="404 - Pagină inexistentă | Joben.eu" />
        <meta property="og:description" content="Pagina căutată nu există pe Joben.eu. Înapoi la joburi sau homepage." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Joben.eu" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="404 - Pagină inexistentă | Joben.eu" />
        <meta name="twitter:description" content="Pagina căutată nu există pe Joben.eu. Înapoi la joburi sau homepage." />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>
      <PageLayout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="font-heading font-extrabold text-8xl bg-gradient-primary bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="font-heading font-bold text-3xl mb-4 text-primary">
              Pagina nu există
            </h2>
            <p className="text-muted-foreground text-lg">
              Ne pare rău, dar pagina pe care o cauți nu poate fi găsită.<br />
              Poate a fost mutată sau nu a existat niciodată.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-primary hover:shadow-button transition-smooth">
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Înapoi acasă
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/">
                <Search className="w-5 h-5 mr-2" />
                Caută joburi
              </Link>
            </Button>
          </div>
        </div>
      </div>

    </PageLayout>
    </>
  );
};

export default NotFoundPage;
