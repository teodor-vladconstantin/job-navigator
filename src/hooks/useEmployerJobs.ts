import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Job = Database['public']['Tables']['jobs']['Row'];

interface UseEmployerJobsResult {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
}

export const useEmployerJobs = (employerId?: string): UseEmployerJobsResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['employer-jobs', employerId],
    enabled: Boolean(employerId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    jobs: data || [],
    isLoading,
    error: error as Error | null,
  };
};
