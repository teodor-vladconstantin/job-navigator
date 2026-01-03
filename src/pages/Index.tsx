import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ForgotPasswordPage from './ForgotPasswordPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Zap, Clock, Sparkles } from 'lucide-react';
import JobFilters, { JobFiltersState } from '@/components/jobs/JobFilters';
import JobList from '@/components/jobs/JobList';
import { useJobs } from '@/hooks/useJobs';
import { useDebounce } from '@/hooks/useDebounce';

const Index = () => {
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<JobFiltersState>({
    location: 'all',
    jobTypes: [],
    seniorities: [],
  });
  const searchSectionRef = useRef<HTMLElement | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  const { jobs, totalPages, isLoading } = useJobs({
    search: debouncedSearch,
    location: filters.location,
    jobTypes: filters.jobTypes,
    seniorities: filters.seniorities,
    page: currentPage,
    pageSize: 9,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: JobFiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleFiltersReset = () => {
    setFilters({
      location: 'all',
      jobTypes: [],
      seniorities: [],
    });
    setSearchInput('');
    setCurrentPage(1);
  };

  const scrollToJobs = () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > currentPage) {
      scrollToJobs();
    }
    setCurrentPage(newPage);
  };

  return (
    <>
      <Helmet>
        <title>Joben.eu - Aplică la joburi în &lt;30 secunde</title>
        <meta name="description" content="Caută și aplică la joburi rapid, fără cont. Platformă modernă pentru candidați și angajatori din România." />
        <meta property="og:title" content="Joben.eu - Aplică la joburi în &lt;30 secunde" />
        <meta property="og:description" content="Caută și aplică la joburi rapid, fără cont. Platformă modernă pentru candidați și angajatori din România." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Joben.eu" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Joben.eu - Aplică la joburi în &lt;30 secunde" />
        <meta name="twitter:description" content="Caută și aplică la joburi rapid, fără cont. Platformă modernă pentru candidați și angajatori din România." />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>
      <PageLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-14 sm:py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-2 sm:px-4 relative z-10">
          <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Aplică instant la joburi
            </div>
            
            <h1 className="font-heading font-extrabold text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 leading-tight break-words">
              Aplică la joburi rapid{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                &lt;30 secunde
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-xs sm:max-w-2xl mx-auto">
              Fără formulare interminabile. Fără pierderi de timp. Doar tu și jobul potrivit în câteva click-uri.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xs sm:max-w-2xl mx-auto mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-2 rounded-2xl bg-background shadow-glow border border-border">
                <div className="flex-1 flex items-center gap-2 px-2 sm:px-4">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Caută poziție, industrie sau companie..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="bg-gradient-primary hover:shadow-button transition-smooth w-full sm:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  Caută joburi
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-xs sm:max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  &lt;30s
                </div>
                <p className="text-sm text-muted-foreground">Timp mediu aplicare</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  &lt;1 min
                </div>
                <p className="text-sm text-muted-foreground">Postezi job în</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <p className="text-sm text-muted-foreground">Vizibilitate maximă</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-8 sm:py-12 bg-background" ref={searchSectionRef}>
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-1/4 mb-4 lg:mb-0 lg:sticky lg:top-4 z-20">
              <JobFilters
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleFiltersReset}
              />
            </div>

            {/* Job List */}
            <div className="w-full lg:w-3/4">
              <JobList
                jobs={jobs}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4">
              De ce joben.eu?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xs sm:max-w-2xl mx-auto">
              Simplificăm procesul de aplicare la joburi pentru că timpul tău este prețios
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-xs sm:max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">
                Rapid ca fulgerul
              </h3>
              <p className="text-muted-foreground">
                Aplică în mai puțin de 30 de secunde. Un click, un CV, gata.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">
                Fără formularе
              </h3>
              <p className="text-muted-foreground">
                Nu mai completa aceleași informații de zeci de ori. Salvăm tot automat.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">
                Doar joburi relevante
              </h3>
              <p className="text-muted-foreground">
                Filtrăm joburile să găsești exact ce cauți. Remote, hybrid sau onsite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-20 bg-gradient-primary">
        <div className="container mx-auto px-2 sm:px-4 text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-2 sm:mb-4">
            Gata să-ți găsești jobul perfect?
          </h2>
          <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8 max-w-xs sm:max-w-2xl mx-auto">
            Înregistrează-te acum și aplică la primul job în mai puțin de un minut
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="shadow-button text-white" asChild>
              <Link to="/register">Înregistrare gratuită</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
              type="button"
              onClick={scrollToJobs}
            >
              Vezi joburi
            </Button>
          </div>
        </div>
      </section>

    </PageLayout>
    </>
  );
};

export default Index;
