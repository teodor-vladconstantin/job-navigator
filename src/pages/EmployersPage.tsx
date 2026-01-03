import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, LayoutDashboard, Zap, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const EmployersPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Joben.eu - Pentru Angajatori | Recrutare Simplificată</title>
        <meta name="description" content="Postează joburi gratuit și găsește candidații potriviți. Sistem ATS inclus, dashboard intuitiv și acces la talente verificate." />
        <meta property="og:title" content="Joben.eu - Pentru Angajatori | Recrutare Simplificată" />
        <meta property="og:description" content="Postează joburi gratuit și găsește candidații potriviți. Sistem ATS inclus, dashboard intuitiv și acces la talente verificate." />
      </Helmet>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
            Recrutare simplificată pentru <span className="text-primary">companii moderne</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Postează joburi gratuit. Gestionează candidații într-un dashboard intuitiv. Găsește talentul potrivit mai repede.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/register?role=employer">Postează un Job Gratuit</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/contact">Contactează-ne</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <CreditCard className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Postare Gratuită</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Începe fără riscuri. Primele tale anunțuri de angajare sunt complet gratuite. Plătești doar pentru promovare extra dacă dorești.
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <LayoutDashboard className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Dashboard Intuitiv</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Vezi toți aplicanții într-un singur loc. Gestionează statusul lor, descarcă CV-uri și programează interviuri direct din platformă.
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Acces Direct la Talente</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Candidații noștri au profile complete și standardizate. Vezi rapid experiența și skill-urile relevante fără să deschizi 10 fișiere diferite.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 font-heading">Totul sub control</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Managementul candidaților</h3>
                    <p className="text-muted-foreground">Mută candidații prin etapele de recrutare (Nou, Interviu, Ofertă, Respins).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Pagina companiei</h3>
                    <p className="text-muted-foreground">Îți construiești brandul de angajator cu o pagină de companie dedicată.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-background rounded-xl shadow-2xl p-6 border border-border">
               {/* Abstract representation of a dashboard */}
               <div className="space-y-4">
                  <div className="h-8 w-1/3 bg-muted rounded animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-primary/10 rounded p-4">
                        <div className="h-4 w-1/2 bg-primary/20 rounded mb-2"></div>
                        <div className="h-8 w-full bg-primary/10 rounded"></div>
                    </div>
                    <div className="h-24 bg-muted rounded p-4"></div>
                    <div className="h-24 bg-muted rounded p-4"></div>
                  </div>
                  <div className="h-40 bg-muted rounded w-full"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading">Găsește următorul coleg</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Nu pierde timpul cu procese complicate. Recrutează eficient cu Joben.eu.
          </p>
          <Button size="lg" asChild className="text-lg px-12">
            <Link to="/register?role=employer">Creează Cont de Angajator</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default EmployersPage;
