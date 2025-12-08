import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Briefcase, Loader2, AlertCircle, Pause, Play, Trash, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployerJobs } from '@/hooks/useEmployerJobs';
import { useEmployerApplications } from '@/hooks/useEmployerApplications';
import { useGuestApplications } from '@/hooks/useGuestApplications';
import { formatDate } from '@/lib/helpers';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { jobs, isLoading: jobsLoading, error: jobsError } = useEmployerJobs(user?.id);
  const { applications, isLoading: appsLoading, error: appsError } = useEmployerApplications(user?.id);
  const { guestApplications, isLoading: guestLoading, error: guestError } = useGuestApplications(user?.id);
  const [cvPreview, setCvPreview] = useState<string | null>(null);
  const [cvPath, setCvPath] = useState<{ path: string; bucket: 'cvs' | 'guest-cvs' } | null>(null);
  const [cvLoading, setCvLoading] = useState(false);

  const normalizePath = (path: string) => {
    let cleaned = path.trim();
    if (cleaned.startsWith('http')) return cleaned;

    // If path contains /object/public/<bucket>/ or /object/sign/<bucket>/, strip the prefix
    const publicPrefix = cleaned.match(/object\/(?:public|sign)\/(cvs|guest-cvs)\/(.*)$/);
    if (publicPrefix && publicPrefix[2]) {
      cleaned = publicPrefix[2];
    }

    cleaned = cleaned.replace(/^\/+/, '');
    cleaned = cleaned.replace(/\/+/g, '/');
    if (cleaned.startsWith('cvs/')) cleaned = cleaned.slice(4);
    if (cleaned.startsWith('guest-cvs/')) cleaned = cleaned.slice('guest-cvs/'.length);
    return cleaned;
  };

  const resolveBucketAndPath = (
    rawPath: string,
    fallbackBucket: 'cvs' | 'guest-cvs'
  ): { bucket: 'cvs' | 'guest-cvs'; path: string } => {
    let bucket: 'cvs' | 'guest-cvs' = fallbackBucket;
    let path = normalizePath(rawPath);

    const matchHttp = rawPath.match(/storage\/v1\/object\/(?:public|sign)\/(cvs|guest-cvs)\/([^?]+)/);
    if (matchHttp && matchHttp[1] && matchHttp[2]) {
      bucket = matchHttp[1] as 'cvs' | 'guest-cvs';
      path = matchHttp[2];
    }

    const matchPrefix = rawPath.match(/^(cvs|guest-cvs)\/(.+)$/);
    if (matchPrefix && matchPrefix[1] && matchPrefix[2]) {
      bucket = matchPrefix[1] as 'cvs' | 'guest-cvs';
      path = matchPrefix[2];
    }

    return { bucket, path };
  };

  const openCv = async (path: string, bucket: 'cvs' | 'guest-cvs') => {
    setCvLoading(true);
    // Keep these outside try/catch so we can re-use in error handling
    const rawPath = path;
    const { bucket: bucketToUse, path: cleanPath } = resolveBucketAndPath(path, bucket);

    try {

      // If raw URL points to a different project, just open it as-is
      if (rawPath.startsWith('http') && SUPABASE_URL && !rawPath.includes(SUPABASE_URL)) {
        setCvPreview(rawPath);
        setCvPath({ path: rawPath, bucket });
        return;
      }

      // If cv_url is already a signed URL for this project, re-sign it ourselves using the object path
      if (rawPath.startsWith(SUPABASE_URL) && rawPath.includes('/storage/v1/object/sign/')) {
        const match = rawPath.match(/object\/sign\/(cvs|guest-cvs)\/(.*?)(\?|$)/);
        if (match && match[2]) {
          const extractedBucket = match[1] as 'cvs' | 'guest-cvs';
          const objectPath = match[2];
          const { data: resigned, error: reErr } = await supabase.storage.from(extractedBucket).createSignedUrl(objectPath, 300);
          if (reErr) throw reErr;
          if (resigned?.signedUrl) {
            setCvPreview(resigned.signedUrl);
            setCvPath({ path: resigned.signedUrl, bucket: extractedBucket });
            return;
          }
        }
      }

      if (cleanPath.startsWith('http')) {
        setCvPreview(cleanPath);
        setCvPath({ path: cleanPath, bucket: bucketToUse });
        return;
      }

      if (!cleanPath) {
        throw new Error('CV-ul nu are o cale validă. Încarcă-l din nou din profil.');
      }

      // Try signed URL first
      const { data: signed, error: signErr } = await supabase.storage.from(bucketToUse).createSignedUrl(cleanPath, 300);
      if (signed?.signedUrl) {
        setCvPreview(signed.signedUrl);
        setCvPath({ path: signed.signedUrl, bucket: bucketToUse });
        return;
      }

      // If bucket not found or signing failed, try public URL fallback
      const { data: pub } = supabase.storage.from(bucketToUse).getPublicUrl(cleanPath);
      if (pub?.publicUrl) {
        setCvPreview(pub.publicUrl);
        setCvPath({ path: pub.publicUrl, bucket: bucketToUse });
        return;
      }

      // Fallback to direct download if signing/public failed
      const { data, error } = await supabase.storage.from(bucketToUse).download(cleanPath);
      if (error) throw signErr || error;
      const url = URL.createObjectURL(data);
      setCvPreview(url);
      setCvPath({ path: url, bucket: bucketToUse });
    } catch (err: any) {
      const msg = typeof err?.message === 'string' ? err.message : '';
      const isBucket = msg.toLowerCase().includes('bucket not found');
      if (isBucket && path.startsWith('http')) {
        // last resort: open raw URL if provided
        setCvPreview(path);
        setCvPath({ path, bucket: bucketToUse });
        return;
      }

      toast({
        variant: 'destructive',
        title: 'Eroare CV',
        description: isBucket ? 'CV-ul pare încărcat pe un alt proiect sau bucket-ul lipsește. Reîncarcă CV-ul din profil.' : (msg || 'Nu am putut deschide CV-ul.'),
      });
    } finally {
      setCvLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (cvPath?.path) URL.revokeObjectURL(cvPath.path);
    };
  }, [cvPath]);

  const updateStatus = async (jobId: string, newStatus: 'active' | 'paused' | 'closed') => {
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', jobId)
      .eq('employer_id', user!.id);
    if (error) throw error;
  };

  const deleteJob = async (jobId: string) => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)
      .eq('employer_id', user!.id);
    if (error) throw error;
  };

  const handleAction = async (jobId: string, action: 'pause' | 'activate' | 'close' | 'delete') => {
    try {
      if (action === 'pause') await updateStatus(jobId, 'paused');
      if (action === 'activate') await updateStatus(jobId, 'active');
      if (action === 'close') await updateStatus(jobId, 'closed');
      if (action === 'delete') await deleteJob(jobId);
      toast({ title: 'Actualizat', description: 'Schimbarea a fost aplicată.' });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs', user?.id] });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Eroare', description: err.message || 'Nu am putut aplica acțiunea.' });
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground">Panou angajator</p>
            <h1 className="font-heading text-3xl font-bold">Joburile tale</h1>
            <p className="text-muted-foreground">Adaugă, vezi și gestionează anunțurile publicate.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild size="lg">
              <Link to="/dashboard/employer/companies">
                <Briefcase className="w-4 h-4 mr-2" /> Companiile mele
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-gradient-primary hover:shadow-button">
              <Link to="/dashboard/employer/post-job">
                <Plus className="w-4 h-4 mr-2" /> Postează job
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Anunțuri active
              </CardTitle>
              {jobsLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              {jobsError && (
                <p className="text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {jobsError.message}
                </p>
              )}

              {!jobsLoading && !jobsError && jobs.length === 0 && (
                <p className="text-muted-foreground">Nu ai încă joburi publicate.</p>
              )}

              {jobs.map(job => (
                <div key={job.id} className="border rounded-lg p-3 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company_name} • {job.location}</p>
                    <p className="text-xs text-muted-foreground">Status: {job.status}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end min-w-[220px]">
                    <span className="text-xs text-muted-foreground w-full text-right">{formatDate(job.created_at)}</span>
                    {job.status !== 'paused' && (
                      <Button size="sm" variant="outline" onClick={() => handleAction(job.id, 'pause')}>
                        <Pause className="w-4 h-4 mr-1" /> Pauză
                      </Button>
                    )}
                    {job.status !== 'active' && (
                      <Button size="sm" variant="outline" onClick={() => handleAction(job.id, 'activate')}>
                        <Play className="w-4 h-4 mr-1" /> Activează
                      </Button>
                    )}
                    {job.status !== 'closed' && (
                      <Button size="sm" variant="outline" onClick={() => handleAction(job.id, 'close')}>
                        <FileText className="w-4 h-4 mr-1" /> Închide
                      </Button>
                    )}
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/dashboard/employer/jobs/${job.id}/edit`}>Editează</Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleAction(job.id, 'delete')}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Aplicări primite
              </CardTitle>
              {(appsLoading || guestLoading) && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              {appsError && (
                <p className="text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {appsError.message}
                </p>
              )}
              {guestError && (
                <p className="text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {guestError.message}
                </p>
              )}

              {!appsLoading && !guestLoading && !appsError && !guestError && applications.length + guestApplications.length === 0 && (
                <p className="text-muted-foreground">Nu ai încă aplicări.</p>
              )}

              {applications.map(app => (
                <div key={app.id} className="border rounded-lg p-3 space-y-1">
                  <p className="font-medium">{app.jobs?.title || 'Job'}</p>
                  <p className="text-xs text-muted-foreground">Status aplicație: {app.status}</p>
                  <div className="flex gap-2 items-center text-xs text-muted-foreground">
                    <span>CV:</span>
                    <Button size="sm" variant="outline" disabled={cvLoading} onClick={() => openCv(app.cv_url, 'cvs')}>
                      <Eye className="w-4 h-4 mr-1" /> Vezi CV
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(app.created_at)}</p>
                </div>
              ))}

              {guestApplications.map(app => (
                <div key={app.id} className="border rounded-lg p-3 space-y-1 bg-muted/40">
                  <p className="font-medium">{app.jobs?.title || 'Job'} (guest)</p>
                  <p className="text-xs text-muted-foreground">{app.name} • {app.email}</p>
                  <div className="flex gap-2 items-center text-xs text-muted-foreground">
                    <span>CV:</span>
                    <Button size="sm" variant="outline" disabled={cvLoading} onClick={() => openCv(app.cv_url, 'guest-cvs')}>
                      <Eye className="w-4 h-4 mr-1" /> Vezi CV
                    </Button>
                  </div>
                  {app.cover_letter && (
                    <p className="text-xs text-muted-foreground whitespace-pre-line">Scrisoare: {app.cover_letter}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatDate(app.created_at)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <Dialog open={Boolean(cvPreview)} onOpenChange={(open) => {
          if (!open) {
            if (cvPath?.path && cvPath.path.startsWith('blob:')) URL.revokeObjectURL(cvPath.path);
            setCvPreview(null);
            setCvPath(null);
          }
        }}>
          <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Previzualizare CV (doar vizualizare)</DialogTitle>
              <DialogDescription>Link temporar, doar angajatorul acestui job poate vedea.</DialogDescription>
            </DialogHeader>
            {cvPreview ? (
              <div className="flex-1 overflow-hidden flex items-center justify-center bg-muted/30 rounded-lg">
                <iframe src={cvPreview} title="CV" className="w-full h-full" />
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default EmployerDashboard;
