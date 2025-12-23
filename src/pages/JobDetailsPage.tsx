import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatSalary, formatRelativeTime } from '@/lib/helpers';
import { JOB_TYPE_LABELS, SENIORITY_LABELS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, FileText, Linkedin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import type { JobWithCompany } from '@/hooks/useJobs';

const JobDetailsSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-5 w-1/4" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
);

const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [applying, setApplying] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['job-details', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, company:company_id (id, name, logo_url, website)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as JobWithCompany | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleApply = async () => {
    if (!data?.id || !user || !profile?.cv_url) return;

    setApplying(true);
    try {
      const { data: existing, error: checkErr } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', data.id)
        .eq('candidate_id', user.id)
        .limit(1);
      if (checkErr) throw checkErr;
      if (existing && existing.length > 0) {
        toast({ title: 'Ai deja aplicat', description: 'Există deja o aplicare pentru acest job.' });
        return;
      }

      const { error } = await supabase.from('applications').insert({
        job_id: data.id,
        candidate_id: user.id,
        cv_url: profile.cv_url,
        status: 'submitted',
      });
      if (error) throw error;
      toast({ title: 'Aplicare trimisă', description: 'Am înregistrat aplicarea ta.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare aplicare', description: err.message || 'Nu am putut aplica.' });
    } finally {
      setApplying(false);
    }
  };

  const [guestOpen, setGuestOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const [guestCv, setGuestCv] = useState<File | null>(null);
  const [guestAcceptTerms, setGuestAcceptTerms] = useState(false);
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  const validJobId = useMemo(() => data?.id || id || null, [data?.id, id]);

  const handleApplyClick = () => {
    if (!user) {
      // Guests apply via modal
      setGuestOpen(true);
      return;
    }

    if (profile?.role !== 'candidate') {
      toast({ variant: 'destructive', title: 'Doar candidați', description: 'Schimbă rolul în candidat pentru a aplica.' });
      return;
    }

    if (!profile.cv_url) {
      toast({ variant: 'destructive', title: 'CV lipsă', description: 'Încarcă CV-ul din profil înainte de a aplica.' });
      navigate('/dashboard/profile');
      return;
    }

    void handleApply();
  };

  const handleGuestApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validJobId) return;
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim() || !guestCv) {
      toast({ variant: 'destructive', title: 'Completează câmpurile', description: 'Nume, email, telefon și CV sunt obligatorii.' });
      return;
    }
    if (!guestAcceptTerms) {
      toast({ variant: 'destructive', title: 'Confirmă acordul', description: 'Acceptă termenii și politica de confidențialitate pentru a aplica.' });
      return;
    }
    if (guestCv.type !== 'application/pdf') {
      toast({ variant: 'destructive', title: 'Format invalid', description: 'CV-ul trebuie să fie PDF.' });
      return;
    }
    setGuestSubmitting(true);
    try {
      const safeName = `${validJobId}/${crypto.randomUUID()}-${guestCv.name}`;
      const { error: upErr } = await supabase.storage.from('guest-cvs').upload(safeName, guestCv);
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from('guest_applications').insert({
        job_id: validJobId,
        name: guestName.trim(),
        email: guestEmail.trim(),
        phone: guestPhone.trim(),
        cv_url: safeName,
        cover_letter: null,
      });
      if (insErr) throw insErr;

      toast({ title: 'Aplicare trimisă', description: 'Am înregistrat aplicarea ca invitat.' });
      setGuestOpen(false);
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');

      setGuestCv(null);
      setGuestAcceptTerms(false);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare aplicare guest', description: err.message || 'Nu am putut aplica.' });
    } finally {
      setGuestSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !data && !error) {
      navigate('/404', { replace: true });
    }
  }, [isLoading, data, error, navigate]);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Înapoi
        </Button>

        {isLoading && <JobDetailsSkeleton />}

        {error && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" /> {error.message}
          </div>
        )}

        {data && (
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                {data.company?.logo_url ? (
                  <div className="w-14 h-14 rounded border border-border bg-muted/60 flex items-center justify-center overflow-hidden">
                    <img src={data.company.logo_url} alt={data.company?.name ?? data.company_name} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded border border-border bg-muted/60 flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {(data.company?.name || data.company_name)?.[0]?.toUpperCase() ?? '—'}
                  </div>
                )}
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="leading-tight">
                    <div className="text-sm text-muted-foreground mb-1">
                      {data.company?.id ? (
                        <Link to={`/companies/${data.company.id}`} className="text-primary hover:underline">
                          {data.company?.name ?? data.company_name}
                        </Link>
                      ) : (
                        data.company?.name ?? data.company_name
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold leading-tight break-words">{data.title}</div>
                      {/* LinkedIn Share Button */}
                      <Button
                        className="ml-2 px-4 py-2 bg-[#0A66C2] text-white font-semibold flex items-center gap-2 shadow-lg hover:bg-[#0A66C2] hover:shadow-[0_0_16px_4px_#0A66C2] focus:bg-[#0A66C2] focus:shadow-[0_0_16px_4px_#0A66C2] transition-all duration-200"
                        style={{ boxShadow: '0 0 12px 2px #0A66C2' }}
                        asChild
                        title="Distribuie pe LinkedIn"
                        aria-label="Distribuie pe LinkedIn"
                      >
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-5 h-5" />
                          <span className="ml-2">Distribuie pe LinkedIn</span>
                        </a>
                      </Button>
                    </div>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{data.location}</Badge>
                    <Badge variant="secondary">{JOB_TYPE_LABELS[data.job_type]}</Badge>
                    <Badge variant="secondary">{SENIORITY_LABELS[data.seniority]}</Badge>
                    <Badge variant="secondary">{formatRelativeTime(data.created_at)}</Badge>
                  </div>
                  {data.salary_public && (data.salary_min || data.salary_max) && (
                    <div className="text-primary font-semibold">
                      {formatSalary(data.salary_min ?? undefined, data.salary_max ?? undefined)}
                    </div>
                  )}
                  {data.company?.id && (
                    <div className="pt-1">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/companies/${data.company.id}`}>Vezi profilul companiei</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Descriere</h3>
                <p className="text-muted-foreground whitespace-pre-line">{data.description}</p>
              </div>

              <div className="pt-4 border-t space-y-2">
                <h3 className="font-semibold">Aplică</h3>
                <p className="text-sm text-muted-foreground">Dacă ești autentificat ca și candidat folosim CV-ul din profil; altfel poți aplica rapid ca invitat.</p>
                <div className="flex gap-3 flex-wrap">
                  <Button className="bg-gradient-primary" disabled={applying} onClick={handleApplyClick}>
                    {applying ? <Skeleton className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                    {applying ? 'Se trimite...' : 'Aplică'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">CV-urile sunt vizualizate în siguranță de angajatorii jobului.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog
          open={guestOpen}
          onOpenChange={(open) => {
            setGuestOpen(open);
            if (!open) {
              setGuestName('');
              setGuestEmail('');
              setGuestPhone('');

              setGuestCv(null);
              setGuestAcceptTerms(false);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aplică ca invitat</DialogTitle>
              <DialogDescription>Trimite rapid un CV PDF fără cont. Angajatorul îl vede doar pentru acest job.</DialogDescription>
            </DialogHeader>
            <form className="space-y-3" onSubmit={handleGuestApply}>
              <div className="space-y-2">
                <Label>Nume</Label>
                <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Număr de telefon</Label>
                <Input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="07xxxxxxxx" pattern="0[0-9]{9}" maxLength={10} required />
              </div>
              <div className="space-y-2">
                <Label>CV (PDF)</Label>
                <Input type="file" accept="application/pdf" onChange={(e) => setGuestCv(e.target.files?.[0] || null)} required />
              </div>
              <div className="space-y-2">

              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border p-3 bg-muted/40">
                <Checkbox
                  id="guest-terms"
                  checked={guestAcceptTerms}
                  onCheckedChange={(checked) => setGuestAcceptTerms(Boolean(checked))}
                  required
                  className="mt-1"
                />
                <div className="text-sm text-foreground/90">
                  <label htmlFor="guest-terms" className="font-medium cursor-pointer">
                    Sunt de acord cu{' '}
                    <Link to="/termeni" className="text-primary hover:underline">Termenii și Condițiile</Link>
                    {' '}și{' '}
                    <Link to="/confidentialitate" className="text-primary hover:underline">Politica de Confidențialitate</Link>.
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">Necesar pentru trimiterea aplicării ca invitat.</p>
                </div>
              </div>
              <Button type="submit" className="bg-gradient-primary" disabled={guestSubmitting}>
                {guestSubmitting ? <Skeleton className="w-4 h-4 mr-2" /> : null}
                {guestSubmitting ? 'Se trimite...' : 'Trimite ca invitat'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default JobDetailsPage;
