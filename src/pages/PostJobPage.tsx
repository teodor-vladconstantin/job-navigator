import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
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
  const [location, setLocation] = useState<string>('Remote');
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
    const selectedLocation = location.trim();
    const selectedJobType = jobType;
    const selectedSeniority = seniority;
    const salary_min_raw = formData.get('salary_min') as string | null;
    const salary_max_raw = formData.get('salary_max') as string | null;
    const tech_stack_raw = String(formData.get('tech_stack') || '').trim();
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
    const tech_stack = tech_stack_raw
      ? tech_stack_raw.split(',').map(t => t.trim()).filter(Boolean)
      : [];

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
        tech_stack,
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
    <PageLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Panou angajator</p>
            <h1 className="font-heading text-3xl font-bold">Postează un job</h1>
            <p className="text-muted-foreground">Formular placeholder; conectăm inserția în Supabase în pasul următor.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalii job</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titlu</Label>
                  <Input id="title" name="title" placeholder="Ex: Frontend Engineer" required />
                </div>
                <div>
                  <Label>Locație</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alege locația" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map(loc => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                  <Input id="salary_min" name="salary_min" type="number" min={0} placeholder="12000" />
                </div>
                <div>
                  <Label htmlFor="salary_max">Salariu maxim (opțional)</Label>
                  <Input id="salary_max" name="salary_max" type="number" min={0} placeholder="18000" />
                </div>
              </div>

              <div>
                <Label htmlFor="tech_stack">Tech stack (separat prin virgule)</Label>
                <Input id="tech_stack" name="tech_stack" placeholder="React, TypeScript, Tailwind" />
              </div>

              <div>
                <Label htmlFor="description">Job description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descriere unică (rol, responsabilități, cerințe)"
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="bg-gradient-primary" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {submitting ? 'Se trimite...' : 'Publică job'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PostJobPage;
