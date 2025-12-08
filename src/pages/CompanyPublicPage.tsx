import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { JOB_TYPE_LABELS, SENIORITY_LABELS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/helpers';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CompanyPublicPage = () => {
  const { id } = useParams<{ id: string }>();

  const companyQuery = useQuery({
    queryKey: ['company-public', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase.from('companies').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const jobsQuery = useQuery({
    queryKey: ['company-jobs-public', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 space-y-6">
        <Button variant="ghost" asChild>
          <Link to={-1 as any}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Înapoi
          </Link>
        </Button>

        {companyQuery.error && (
          <div className="flex items-center gap-2 text-destructive"><AlertCircle className="w-4 h-4" />{companyQuery.error.message}</div>
        )}

        {companyQuery.data && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {companyQuery.data.logo_url ? (
                  <img src={companyQuery.data.logo_url} alt={companyQuery.data.name} className="w-12 h-12 rounded border object-contain" />
                ) : null}
                <span>{companyQuery.data.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {companyQuery.data.website && (
                <a href={companyQuery.data.website} target="_blank" rel="noreferrer" className="text-primary underline text-sm">
                  {companyQuery.data.website}
                </a>
              )}
              {companyQuery.data.description && (
                <p className="text-muted-foreground whitespace-pre-line">{companyQuery.data.description}</p>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Joburi active</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobsQuery.data && jobsQuery.data.length === 0 && (
              <p className="text-muted-foreground text-sm">Nu există joburi active.</p>
            )}
            {jobsQuery.data?.map(job => (
              <div key={job.id} className="border rounded-lg p-3 space-y-1">
                <Link to={`/jobs/${job.id}`} className="font-medium hover:underline">{job.title}</Link>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{job.location}</Badge>
                  <Badge variant="secondary">{JOB_TYPE_LABELS[job.job_type]}</Badge>
                  <Badge variant="secondary">{SENIORITY_LABELS[job.seniority]}</Badge>
                  <Badge variant="secondary">{formatRelativeTime(job.created_at)}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CompanyPublicPage;
