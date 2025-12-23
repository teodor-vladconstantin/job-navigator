import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JOB_TYPE_LABELS, SENIORITY_LABELS, LOCATIONS } from '@/lib/constants';
import type { Database } from '@/integrations/supabase/types';
import { Link } from 'react-router-dom';

const PostJobPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [jobType, setJobType] = useState<keyof typeof JOB_TYPE_LABELS>('remote');
  const [seniority, setSeniority] = useState<keyof typeof SENIORITY_LABELS>('junior');
  const [locations, setLocations] = useState<string[]>(['Remote']);
  const [locQuery, setLocQuery] = useState<string>('');
  const filteredLocations = LOCATIONS.filter((l) => l.toLowerCase().includes(locQuery.trim().toLowerCase()));
  const locInputRef = useRef<HTMLInputElement | null>(null);
  const onLocOpenChange = (open: boolean) => {
    if (open) {
      setTimeout(() => locInputRef.current?.focus(), 0);
    } else {
      setLocQuery('');
    }
  };
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('none');

  const { data: companies = [], isLoading: companiesLoading } = useQuery({
    queryKey: ['companies', user?.id],
    enabled: Boolean(user?.id),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Database['public']['Tables']['companies']['Row'][];
    },
  });

  useEffect(() => {
    if (!companiesLoading && companies.length > 0 && selectedCompanyId === 'none') {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companiesLoading, companies, selectedCompanyId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!user || !profile || profile.role !== 'employer') {
      toast({ variant: 'destructive', title: 'Necesită cont angajator', description: 'Autentifică-te ca angajator pentru a posta.' });
      return;
    }

    const formData = new FormData(form);
    const title = String(formData.get('title') || '').trim();
    const selectedLocation = locations.join(', ');
    const selectedJobType = jobType;
    const selectedSeniority = seniority;
    const salary_min_raw = formData.get('salary_min') as string | null;
    const salary_max_raw = formData.get('salary_max') as string | null;
    const description = String(formData.get('description') || '').trim();
    const finalCompanyId = selectedCompanyId && selectedCompanyId !== 'none' ? selectedCompanyId : null;
    if (!finalCompanyId) {
      toast({ variant: 'destructive', title: 'Selectează compania', description: 'Creează și selectează o companie înainte de a posta.' });
      return;
    }

    const selectedCompany = companies.find(c => c.id === finalCompanyId);
    const finalCompanyName = selectedCompany?.name;
    if (!finalCompanyName) {
      toast({ variant: 'destructive', title: 'Companie invalidă', description: 'Reîncarcă și selectează o companie validă.' });
      return;
    }

    const salary_min = salary_min_raw && salary_min_raw !== '' && !isNaN(Number(salary_min_raw))
      ? Number(salary_min_raw)
      : null;
    const salary_max = salary_max_raw && salary_max_raw !== '' && !isNaN(Number(salary_max_raw))
      ? Number(salary_max_raw)
      : null;

    if (title.length < 10) {
      toast({ variant: 'destructive', title: 'Titlu prea scurt', description: 'Minim 10 caractere (constrângere DB).' });
      return;
    }

    if (description.length < 50) {
      toast({ variant: 'destructive', title: 'Descriere prea scurtă', description: 'Minim 50 de caractere.' });
      return;
    }

    if (salary_min !== null && salary_max !== null && salary_max < salary_min) {
      toast({ variant: 'destructive', title: 'Salariu invalid', description: 'Maxim trebuie să fie ≥ minim.' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('jobs').insert({
        employer_id: user.id,
        title,
        company_name: finalCompanyName,
        company_id: finalCompanyId,
        location: selectedLocation,
        job_type: selectedJobType as any,
        seniority: selectedSeniority as any,
        salary_min,
        salary_max,
        salary_public: salary_min !== null || salary_max !== null,
        // tech_stack removed per product request
        description,
        requirements: description,
        status: 'active',
      });

      if (error) {
        const friendly = error.message.includes('jobs_title_check')
          ? 'Titlul trebuie să aibă minim 10 caractere.'
          : error.message;
        toast({ variant: 'destructive', title: 'Eroare la publicare', description: friendly });
        return;
      }

      toast({ title: 'Job publicat', description: 'Anunțul a fost salvat.' });
      form.reset();
      setJobType('remote');
      setSeniority('junior');
      setLocation('Remote');
      setSelectedCompanyId('none');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Postează job - Joben.eu</title>
        <meta name="description" content="Adaugă rapid un job nou pe Joben.eu și găsește candidați potriviți în câteva minute." />
        <meta property="og:title" content="Postează job - Joben.eu" />
        <meta property="og:description" content="Adaugă rapid un job nou pe Joben.eu și găsește candidați potriviți în câteva minute." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Joben.eu" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Postează job - Joben.eu" />
        <meta name="twitter:description" content="Adaugă rapid un job nou pe Joben.eu și găsește candidați potriviți în câteva minute." />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>
      <PageLayout>

      <div className="container mx-auto px-2 sm:px-4 py-6 md:py-10">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Panou angajator</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">Postează un job</h1>
            <p className="text-muted-foreground text-sm">Formular placeholder; conectăm inserția în Supabase în pasul următor.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Detalii job</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titlu</Label>
                  <Input id="title" name="title" placeholder="Ex: Frontend Engineer" required className="min-h-[44px]" />
                </div>
                <div>
                  <Label>Locații</Label>
                  <div className="border rounded-md p-2 max-h-60 overflow-y-auto bg-background">
                    <Input
                      ref={locInputRef}
                      placeholder="Caută locație..."
                      value={locQuery}
                      onChange={(e) => setLocQuery(e.target.value)}
                      className="mb-2 min-h-[44px]"
                    />
                    <div className="flex flex-wrap gap-2">
                      {filteredLocations.map(loc => (
                        <div key={loc} className="flex items-center space-x-2 py-1 min-w-[120px]">
                          <Checkbox
                            id={`loc-${loc}`}
                            checked={locations.includes(loc)}
                            onCheckedChange={(checked) => {
                              setLocations((prev) =>
                                checked ? [...prev, loc] : prev.filter((l) => l !== loc)
                              );
                            }}
                          />
                          <label htmlFor={`loc-${loc}`} className="text-sm cursor-pointer">{loc}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Companie (obligatoriu)</Label>
                  <Select
                    disabled={companiesLoading || companies.length === 0}
                    value={selectedCompanyId}
                    onValueChange={(val) => setSelectedCompanyId(val)}
                  >
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue placeholder={companiesLoading ? 'Se încarcă...' : 'Alege compania'} />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {companies.length === 0 && !companiesLoading && (
                    <p className="text-sm text-muted-foreground">
                      Trebuie să creezi o companie înainte de a posta. Mergi la{' '}
                      <Link to="/dashboard/employer/companies" className="text-primary underline">Companiile mele</Link>.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Instrucțiune</Label>
                  <p className="text-sm text-muted-foreground">Selectează o companie existentă din contul tău. Creează și gestionează companiile din tabul „Companiile mele”.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tip job</Label>
                  <Select value={jobType} onValueChange={(v) => setJobType(v as keyof typeof JOB_TYPE_LABELS)}>
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue placeholder="Alege tipul" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nivel</Label>
                  <Select value={seniority} onValueChange={(v) => setSeniority(v as keyof typeof SENIORITY_LABELS)}>
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue placeholder="Alege nivelul" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SENIORITY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary_min">Salariu minim (opțional)</Label>
                  <Input id="salary_min" name="salary_min" type="number" min={0} placeholder="12000" className="min-h-[44px]" />
                </div>
                <div>
                  <Label htmlFor="salary_max">Salariu maxim (opțional)</Label>
                  <Input id="salary_max" name="salary_max" type="number" min={0} placeholder="18000" className="min-h-[44px]" />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descriere unică (rol, responsabilități, cerințe)"
                  rows={6}
                  required
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="bg-gradient-primary w-full md:w-auto min-h-[44px] text-base" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {submitting ? 'Se trimite...' : 'Publică job'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>


    </PageLayout>
    </>
  );
};

export default PostJobPage;
