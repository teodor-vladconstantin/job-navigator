import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, Loader2, AlertCircle, ExternalLink, MapPin } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/helpers';

type Application = Database['public']['Tables']['applications']['Row'] & {
  jobs: {
    id: string;
    title: string;
    company_name: string;
    location: string;
    status: string | null;
  } | null;
};

const CandidateDashboard = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidate-dashboard', user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, jobs:jobs(id,title,company_name,location,status)')
        .eq('candidate_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Application[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (data || []).forEach(app => {
      const key = app.status || 'necunoscut';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [data]);

  const latestApplications = (data || []).slice(0, 5);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground">Panou candidat</p>
            <h1 className="font-heading text-3xl font-bold">Aplicările tale</h1>
            <p className="text-muted-foreground">Urmărește rapid aplicările trimise. Joburile salvate au fost eliminate.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/dashboard/candidate/applications">
              <ExternalLink className="w-4 h-4 mr-2" /> Vezi toate aplicările
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1 border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Statistici aplicări
              </CardTitle>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {error && (
                <p className="text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {error.message}
                </p>
              )}

              {!isLoading && !error && (data || []).length === 0 && (
                <p className="text-muted-foreground">Nu ai încă aplicări. Încearcă să aplici la joburile din listă.</p>
              )}

              {(data || []).length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total aplicări</span>
                    <span className="font-semibold">{data?.length ?? 0}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                        <span className="capitalize text-muted-foreground">{status}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ultimele aplicări</CardTitle>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {error && (
                <p className="text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {error.message}
                </p>
              )}

              {!isLoading && !error && latestApplications.length === 0 && (
                <p className="text-muted-foreground">Nu ai aplicări recente.</p>
              )}

              {latestApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="space-y-1">
                      {app.jobs?.id ? (
                        <Link to={`/jobs/${app.jobs.id}`} className="font-medium hover:underline">
                          {app.jobs.title}
                        </Link>
                      ) : (
                        <p className="font-medium">{app.jobs?.title || 'Job indisponibil'}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{app.jobs?.company_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <Badge variant="secondary">Status aplicație: {app.status}</Badge>
                        {app.jobs?.status && <Badge variant="outline">Job: {app.jobs.status}</Badge>}
                        {app.jobs?.location && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.jobs.location}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right min-w-[120px]">
                      {formatDate(app.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default CandidateDashboard;
