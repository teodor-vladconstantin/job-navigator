import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, TrendingUp, FileText } from 'lucide-react';
import { formatRelativeTime, formatSalary, truncateText } from '@/lib/helpers';
import { JOB_TYPE_LABELS, SENIORITY_LABELS } from '@/lib/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import type { JobWithCompany } from '@/hooks/useJobs';

interface JobCardProps {
  job: JobWithCompany;
}

const JobCard = ({ job }: JobCardProps) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [applying, setApplying] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestCover, setGuestCover] = useState('');
  const [guestCv, setGuestCv] = useState<File | null>(null);
  const [guestAcceptTerms, setGuestAcceptTerms] = useState(false);
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  const validJobId = useMemo(() => job.id, [job.id]);

  const handleApply = async () => {
    if (!user || !profile?.cv_url || !validJobId) return;

    setApplying(true);
    try {
      // Avoid duplicate applications
      const { data: existing, error: checkErr } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', validJobId)
        .eq('candidate_id', user.id)
        .limit(1);
      if (checkErr) throw checkErr;
      if (existing && existing.length > 0) {
        toast({ title: 'Ai deja aplicat', description: 'Există deja o aplicare pentru acest job.' });
        return;
      }

      const { error } = await supabase.from('applications').insert({
        job_id: validJobId,
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

  const handleApplyClick = () => {
    if (!user) {
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
    if (!guestName.trim() || !guestEmail.trim() || !guestCv) {
      toast({ variant: 'destructive', title: 'Completează câmpurile', description: 'Nume, email și CV sunt obligatorii.' });
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
        cv_url: safeName,
        cover_letter: guestCover.trim() || null,
      });
      if (insErr) throw insErr;

      toast({ title: 'Aplicare trimisă', description: 'Am înregistrat aplicarea ca invitat.' });
      setGuestOpen(false);
      setGuestName('');
      setGuestEmail('');
      setGuestCover('');
      setGuestCv(null);
      setGuestAcceptTerms(false);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare aplicare guest', description: err.message || 'Nu am putut aplica.' });
    } finally {
      setGuestSubmitting(false);
    }
  };

  const companyName = job.company?.name ?? job.company_name;
  const logoUrl = job.company?.logo_url;

  return (
    <Card className="group hover:shadow-card transition-smooth border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3 flex-1">
            {logoUrl ? (
              <div className="w-12 h-12 rounded border border-border bg-muted/60 flex items-center justify-center overflow-hidden">
                <img src={logoUrl} alt={companyName} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded border border-border bg-muted/60 flex items-center justify-center text-sm font-medium text-muted-foreground">
                {companyName?.[0]?.toUpperCase() ?? '—'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link to={`/jobs/${job.id}`}>
                <h3 className="font-heading font-semibold text-xl mb-1 group-hover:text-primary transition-smooth truncate">
                  {job.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground font-medium truncate">{companyName}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {JOB_TYPE_LABELS[job.job_type]}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {SENIORITY_LABELS[job.seniority]}
          </Badge>
        </div>

        {job.salary_public && job.salary_min && (
          <p className="text-sm font-semibold text-primary mb-3">
            {formatSalary(job.salary_min, job.salary_max)}
          </p>
        )}

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {truncateText(job.description, 150)}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatRelativeTime(new Date(job.created_at))}</span>
          <div className="flex items-center gap-2">
            <Link to={`/jobs/${job.id}`}>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Vezi detalii →
              </Button>
            </Link>
            <Button size="sm" className="bg-gradient-primary" disabled={applying} onClick={handleApplyClick}>
              {applying ? <Skeleton className="w-3 h-3 mr-2" /> : <FileText className="w-3 h-3 mr-2" />}
              {applying ? 'Se trimite...' : 'Aplică'}
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog
        open={guestOpen}
        onOpenChange={(open) => {
          setGuestOpen(open);
          if (!open) {
            setGuestName('');
            setGuestEmail('');
            setGuestCover('');
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
              <Label>CV (PDF)</Label>
              <Input type="file" accept="application/pdf" onChange={(e) => setGuestCv(e.target.files?.[0] || null)} required />
            </div>
            <div className="space-y-2">
              <Label>Scrisoare (opțional)</Label>
              <Textarea rows={3} value={guestCover} onChange={(e) => setGuestCover(e.target.value)} />
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-3 bg-muted/40">
              <Checkbox
                id={`guest-terms-${job.id}`}
                checked={guestAcceptTerms}
                onCheckedChange={(checked) => setGuestAcceptTerms(Boolean(checked))}
                required
                className="mt-1"
              />
              <div className="text-sm text-foreground/90">
                <label htmlFor={`guest-terms-${job.id}`} className="font-medium cursor-pointer">
                  Sunt de acord cu{' '}
                  <Link to="/termeni" className="text-primary hover:underline">Termenii și Condițiile</Link>
                  {' '}și{' '}
                  <Link to="/confidentialitate" className="text-primary hover:underline">Politica de Confidențialitate</Link>.
                </label>
                <p className="text-xs text-muted-foreground mt-1">Necesar pentru trimiterea aplicării ca invitat.</p>
              </div>
            </div>
            <Button type="submit" className="bg-gradient-primary" disabled={guestSubmitting}>
              {guestSubmitting ? <Skeleton className="w-3 h-3 mr-2" /> : null}
              {guestSubmitting ? 'Se trimite...' : 'Trimite ca invitat'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default JobCard;
