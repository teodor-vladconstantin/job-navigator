import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['applications']['Row'];

type ApplicationWithJob = Application & {
  jobs: {
    id: string;
    title: string;
    company_name: string;
    employer_id: string;
    company_id: string | null;
  } | null;
};

interface UseEmployerApplicationsResult {
  applications: ApplicationWithJob[];
  isLoading: boolean;
  error: Error | null;
}

export const useEmployerApplications = (employerId?: string): UseEmployerApplicationsResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['employer-applications', employerId],
    enabled: Boolean(employerId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, jobs!inner(id,title,company_name,company_id,employer_id)')
        .eq('jobs.employer_id', employerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as ApplicationWithJob[]) || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    applications: data || [],
    isLoading,
    error: error as Error | null,
  };
};
