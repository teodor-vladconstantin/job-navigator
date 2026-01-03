import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, UserPlus, MousePointerClick, FileText, Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CandidatesPage = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Joben.eu - Pentru Candidați | Găsește jobul ideal rapid</title>
        <meta name="description" content="Aplică simplu și rapid la joburi verificate. Fără CV-uri complicate, doar profilul tău Joben. Găsește jobul ideal în 30 de secunde." />
        <meta property="og:title" content="Joben.eu - Pentru Candidați | Găsește jobul ideal rapid" />
        <meta property="og:description" content="Aplică simplu și rapid la joburi verificate. Fără CV-uri complicate, doar profilul tău Joben." />
      </Helmet>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
            Găsește jobul ideal în <span className="text-primary">30 de secunde</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Fără formulare interminabile. Fără conturi multiple. Completezi profilul o singură dată și aplici oriunde cu un singur click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/register?role=candidate">Creează cont gratuit</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/">Vezi joburi disponibile</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-heading">Cum funcționează?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>1. Creează Profilul</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Te înregistrezi și îți completezi profilul o singură dată. Adaugi CV-ul, experiența și preferințele tale.
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>2. Găsește Joburi</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Explorezi mii de joburi remote, hybrid sau on-site. Filtrezi după salariu, locație și domeniu.
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MousePointerClick className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>3. One-Click Apply</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Ai găsit jobul perfect? Apeși butonul "Aplică" și gata! Angajatorul primește profilul tău instant.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-heading">De ce să alegi Joben.eu?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Profil Unic</h3>
                    <p className="text-muted-foreground">Nu mai completa aceleași date de 100 de ori. Profilul tău Joben este CV-ul tău universal.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Transparență</h3>
                    <p className="text-muted-foreground">Vezi salariul (unde este disponibil) și beneficiile înainte să aplici.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center p-8">
               {/* Placeholder for an image or illustration */}
               <div className="text-center">
                  <Bell className="w-24 h-24 text-primary mx-auto mb-4 opacity-80" />
                  <p className="text-2xl font-bold text-primary">Jobul tău te așteaptă</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-heading">Ești gata să începi?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Alătură-te miilor de candidați care și-au găsit jobul prin Joben.eu
          </p>
          <Button size="lg" asChild className="text-lg px-12">
            <Link to="/register?role=candidate">Începe Acum</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidatesPage;
