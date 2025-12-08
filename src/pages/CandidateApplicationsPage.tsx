import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

const CandidateApplicationsPage = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidate-applications', user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, jobs!inner(id,title,company_name,location,status)')
        .eq('candidate_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Aplicările mele</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            {error && (
              <p className="text-destructive flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error.message}</p>
            )}
            {!isLoading && !error && data?.length === 0 && (
              <p className="text-muted-foreground">Nu ai aplicat încă.</p>
            )}
            {data?.map((app: any) => (
              <div key={app.id} className="border rounded-lg p-3 space-y-1">
                <Link to={`/jobs/${app.jobs.id}`} className="font-medium hover:underline">{app.jobs.title}</Link>
                <p className="text-xs text-muted-foreground">{app.jobs.company_name} • {app.jobs.location}</p>
                <div className="flex gap-2 items-center text-xs text-muted-foreground">
                  <Badge variant="secondary">Status aplicație: {app.status}</Badge>
                  <Badge variant="outline">Job: {app.jobs.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Trimis la: {new Date(app.created_at).toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CandidateApplicationsPage;
