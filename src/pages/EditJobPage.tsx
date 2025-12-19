import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { JOB_TYPE_LABELS, SENIORITY_LABELS, LOCATIONS } from '@/lib/constants';

type Job = Database['public']['Tables']['jobs']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];

const JOB_STATUS_LABELS: Record<Job['status'], string> = {
  active: 'Activ',
  paused: 'Pauzat',
  closed: 'Închis',
};

const EditJobPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Remote');
  const [locQuery, setLocQuery] = useState('');
  const filteredLocations = LOCATIONS.filter((l) => l.toLowerCase().includes(locQuery.trim().toLowerCase()));
  const locInputRef = useRef<HTMLInputElement | null>(null);
  const onLocOpenChange = (open: boolean) => {
    if (open) setTimeout(() => locInputRef.current?.focus(), 0);
    else setLocQuery('');
  };
  const [jobType, setJobType] = useState<Job['job_type']>('remote');
  const [seniority, setSeniority] = useState<Job['seniority']>('junior');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Job['status']>('active');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('none');
  const [saving, setSaving] = useState(false);

  const companiesQuery = useQuery({
    queryKey: ['companies', user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Company[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const jobQuery = useQuery({
    queryKey: ['job', id, user?.id],
    enabled: Boolean(id && user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id!)
        .eq('employer_id', user!.id)
        .single();
      if (error) throw error;
      return data as Job;
    },
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (jobQuery.data) {
      const job = jobQuery.data;
      setTitle(job.title);
      setLocation(job.location);
      setJobType(job.job_type);
      setSeniority(job.seniority);
      setSalaryMin(job.salary_min?.toString() || '');
      setSalaryMax(job.salary_max?.toString() || '');
      setDescription(job.description);
      setStatus(job.status);
      setSelectedCompanyId(job.company_id || 'none');
    }
  }, [jobQuery.data]);

  useEffect(() => {
    if (
      !companiesQuery.isLoading &&
      companiesQuery.data &&
      companiesQuery.data.length > 0 &&
      selectedCompanyId === 'none'
    ) {
      setSelectedCompanyId(companiesQuery.data[0].id);
    }
  }, [companiesQuery.isLoading, companiesQuery.data, selectedCompanyId]);

  const selectedCompany = useMemo(
    () => companiesQuery.data?.find(c => c.id === selectedCompanyId) || null,
    [companiesQuery.data, selectedCompanyId]
  );

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || profile?.role !== 'employer') {
      toast({ variant: 'destructive', title: 'Necesită cont angajator', description: 'Autentifică-te ca angajator.' });
      return;
    }

    if (!title.trim() || title.trim().length < 10) {
      toast({ variant: 'destructive', title: 'Titlu prea scurt', description: 'Minim 10 caractere.' });
      return;
    }

    if (!description.trim() || description.trim().length < 50) {
      toast({ variant: 'destructive', title: 'Descriere prea scurtă', description: 'Minim 50 de caractere.' });
      return;
    }

    const salaryMinNumber = salaryMin ? Number(salaryMin) : null;
    const salaryMaxNumber = salaryMax ? Number(salaryMax) : null;
    if (salaryMinNumber !== null && isNaN(salaryMinNumber)) {
      toast({ variant: 'destructive', title: 'Salariu minim invalid', description: 'Introdu un număr valid.' });
      return;
    }
    if (salaryMaxNumber !== null && isNaN(salaryMaxNumber)) {
      toast({ variant: 'destructive', title: 'Salariu maxim invalid', description: 'Introdu un număr valid.' });
      return;
    }
    if (
      salaryMinNumber !== null &&
      salaryMaxNumber !== null &&
      salaryMaxNumber < salaryMinNumber
    ) {
      toast({ variant: 'destructive', title: 'Interval salariu invalid', description: 'Maxim trebuie să fie ≥ minim.' });
      return;
    }

    if (!selectedCompanyId || selectedCompanyId === 'none') {
      toast({ variant: 'destructive', title: 'Selectează compania', description: 'Este obligatoriu să alegi o companie.' });
      return;
    }

    if (!selectedCompany) {
      toast({ variant: 'destructive', title: 'Companie invalidă', description: 'Reîncarcă și selectează o companie validă.' });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          title: title.trim(),
          location: location.trim(),
          job_type: jobType,
          seniority,
          salary_min: salaryMinNumber,
          salary_max: salaryMaxNumber,
          salary_public: salaryMinNumber !== null || salaryMaxNumber !== null,
          // tech_stack removed per product request
          description: description.trim(),
          requirements: description.trim(),
          status,
          company_id: selectedCompany.id,
          company_name: selectedCompany.name,
        })
        .eq('id', id!)
        .eq('employer_id', user.id);

      if (error) throw error;

      toast({ title: 'Job salvat', description: 'Modificările au fost aplicate.' });
      navigate('/dashboard/employer');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare la salvare', description: err.message || 'Nu am putut salva.' });
    } finally {
      setSaving(false);
    }
  };

  const isLoading = jobQuery.isLoading || companiesQuery.isLoading;
  const hasNoCompanies = !companiesQuery.isLoading && (companiesQuery.data?.length || 0) === 0;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/employer">
                <ArrowLeft className="w-4 h-4 mr-1" /> Înapoi
              </Link>
            </Button>
            <div>
              <p className="text-sm text-muted-foreground">Panou angajator</p>
              <h1 className="font-heading text-3xl font-bold">Editează jobul</h1>
              <p className="text-muted-foreground">Actualizează detaliile și statusul anunțului.</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalii job</CardTitle>
          </CardHeader>
          <CardContent>
            {jobQuery.error && (
              <p className="text-destructive text-sm mb-4">{jobQuery.error.message}</p>
            )}

            {hasNoCompanies && (
              <p className="text-sm text-muted-foreground mb-4">
                Trebuie să ai cel puțin o companie. Mergi la{' '}
                <Link to="/dashboard/employer/companies" className="text-primary underline">Companiile mele</Link> pentru a crea una.
              </p>
            )}

            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titlu</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <Label>Locație</Label>
                  <Select value={location} onValueChange={setLocation} onOpenChange={onLocOpenChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alege locația" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          ref={locInputRef}
                          placeholder="Caută locație..."
                          value={locQuery}
                          onChange={(e) => setLocQuery(e.target.value)}
                          onKeyDown={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}
                          onKeyUp={(e) => { e.stopPropagation(); }}
                          onKeyPress={(e) => { e.stopPropagation(); }}
                        />
                      </div>
                      {filteredLocations.map(loc => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tip job</Label>
                  <Select value={jobType} onValueChange={(v) => setJobType(v as Job['job_type'])}>
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
                  <Select value={seniority} onValueChange={(v) => setSeniority(v as Job['seniority'])}>
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
                  <Label htmlFor="salary-min">Salariu minim (opțional)</Label>
                  <Input id="salary-min" type="number" min={0} value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="salary-max">Salariu maxim (opțional)</Label>
                  <Input id="salary-max" type="number" min={0} value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
                </div>
              </div>

              {/* Tech stack field removed per product request */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Companie (obligatoriu)</Label>
                  <Select
                    disabled={companiesQuery.isLoading || hasNoCompanies}
                    value={selectedCompanyId}
                    onValueChange={(val) => setSelectedCompanyId(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={companiesQuery.isLoading ? 'Se încarcă...' : 'Alege compania'} />
                    </SelectTrigger>
                    <SelectContent>
                      {companiesQuery.data?.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as Job['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alege statusul" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(JOB_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descriere</Label>
                <Textarea
                  id="description"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" className="bg-gradient-primary" disabled={saving || isLoading || hasNoCompanies}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {saving ? 'Se salvează...' : 'Salvează modificările'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/dashboard/employer">Renunță</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default EditJobPage;