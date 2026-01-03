import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Users, Target, ArrowRight, Check, Sparkles, Code, PenTool, Linkedin, Flame } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { ContactModal } from "@/components/ContactModal";

const JobenAiPage = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");

  const handleOpenContact = (agentName: string) => {
    setSelectedAgent(agentName);
    setIsContactOpen(true);
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Joben AI - Agenți Digitali pentru Afacerea Ta | Recrutare & Marketing</title>
        <meta name="description" content="Automatizează recrutarea, marketingul și crearea de conținut cu agenții noștri AI. Descoperă Joben Recruiter, Growth, SEO Writer și Social Brand." />
        <meta property="og:title" content="Joben AI - Agenți Digitali pentru Afacerea Ta" />
        <meta property="og:description" content="Automatizează recrutarea, marketingul și crearea de conținut cu agenții noștri AI. Descoperă Joben Recruiter, Growth, SEO Writer și Social Brand." />
      </Helmet>
      
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        defaultAgent={selectedAgent}
      />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-purple-500/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Soluții de Automatizare Inteligente</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
            Construiește-ți <span className="text-purple-600">Echipa Digitală</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Alege agenții inteligenți de care ai nevoie. De la recrutare și HR, până la vânzări și marketing, avem soluția automatizată pentru tine.
          </p>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Agent 1: HR & Recrutare */}
            <Card className="flex flex-col border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Joben Recruiter</CardTitle>
                    <CardDescription>Sistem complet de ATS & Sourcing</CardDescription>
                  </div>
                  <Badge variant="secondary">HR</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-6">
                  Automatizează întregul proces de angajare. Centralizează candidații, trimite email-uri automate și găsește talente pasive.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Bază de date centralizată (ATS)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Email-uri automate către candidați</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Pipeline vizual de recrutare</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleOpenContact("Joben Recruiter")}>
                  Implementează <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Agent 2: Marketing & Sales */}
            <Card className="flex flex-col border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Joben Growth</CardTitle>
                    <CardDescription>Lead Generation & Outreach</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Marketing</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-6">
                  Agentul ideal pentru echipele de marketing și vânzări. Identifică clienți potențiali și inițiază conversații calificate.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Identificare Lead-uri B2B</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Campanii LinkedIn Automate</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Cold Email Outreach</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleOpenContact("Joben Growth")}>
                  Implementează <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Agent 3: SEO Content */}
            <Card className="flex flex-col border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <PenTool className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Joben SEO Writer</CardTitle>
                    <CardDescription>Content Writing & WordPress</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">Content</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-6">
                  Scrie articole optimizate SEO și le publică direct pe site-ul tău WordPress. Include imagini, meta tags și formatare corectă.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Keyword Research Automat</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Scriere & Optimizare SEO</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Publicare Directă în WordPress</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => handleOpenContact("Joben SEO Writer")}>
                  Implementează <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Agent 4: LinkedIn Brand */}
            <Card className="flex flex-col border-indigo-200 dark:border-indigo-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Linkedin className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Joben Social Brand</CardTitle>
                    <CardDescription>LinkedIn Content & Branding</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Social</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-6">
                  Transformă-ți profilul de LinkedIn într-un magnet de oportunități. Generează și postează conținut viral automat, cu imagini incluse.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Subiecte Trending & Hooks</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Scriere (GPT-4) & Imagini (DALL-E)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Programare Automată Postări</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => handleOpenContact("Joben Social Brand")}>
                  Implementează <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Agent 5: Trend Surfer */}
            <Card className="flex flex-col border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Flame className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Joben Trend Surfer</CardTitle>
                    <CardDescription>Viral News & Multi-platform</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Viral</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-6">
                  Nu rata niciun trend. Monitorizează Google Trends, cercetează subiectul cu Perplexity AI și postează automat pe toate rețelele.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Google Trends Monitor</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Perplexity Deep Research</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>LinkedIn, X (Twitter) & FB</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => handleOpenContact("Joben Trend Surfer")}>
                  Implementează <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Agent 6: Custom */}
            <Card className="flex flex-col border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-900/50">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">Agent Custom</CardTitle>
                    <CardDescription>Soluție personalizată</CardDescription>
                  </div>
                  <Badge variant="outline">Dev</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-6">
                  Ai un flux de lucru specific care necesită automatizare? Construim agenți personalizați pe infrastructura noastră.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Bot className="w-4 h-4 text-slate-400" />
                    <span>Analiză de procese</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Bot className="w-4 h-4 text-slate-400" />
                    <span>Mentenanță și suport</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleOpenContact("Agent Custom")}>
                  Discută cu noi <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Cum funcționează?</h2>
            <p className="text-lg text-muted-foreground">
              Procesul nostru este simplu și transparent. În mai puțin de 48 de ore poți avea propriul tău agent AI funcțional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 dark:from-purple-800 dark:via-blue-800 dark:to-purple-800 -z-10"></div>

            {/* Step 1 */}
            <div className="relative bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-24 h-24 mx-auto bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-background relative z-10">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Users className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-background">1</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Analiză & Selecție</h3>
              <p className="text-muted-foreground leading-relaxed">
                Identificăm împreună nevoile afacerii tale și alegem agentul potrivit din catalog, sau proiectăm unul custom.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-24 h-24 mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-background relative z-10">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Code className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-background">2</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Configurare & Training</h3>
              <p className="text-muted-foreground leading-relaxed">
                Personalizăm agentul cu datele tale, tonul brandului și îl integrăm cu sistemele existente (CRM, Site, etc).
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-background p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all text-center group">
              <div className="w-24 h-24 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-background relative z-10">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-background">3</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Lansare & Automatizare</h3>
              <p className="text-muted-foreground leading-relaxed">
                Agentul intră în producție și începe să lucreze 24/7. Primești rapoarte periodice și optimizări continue.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800 text-purple-800 dark:text-purple-300 max-w-2xl mx-auto">
              <Bot className="w-6 h-6 shrink-0" />
              <p className="text-sm font-medium">
                Nu ești sigur ce ți se potrivește? Consultanții noștri te pot ajuta să construiești o strategie de automatizare completă.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default JobenAiPage;