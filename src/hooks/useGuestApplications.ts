import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type GuestApplication = Database['public']['Tables']['guest_applications']['Row'] & {
  jobs: {
    id: string;
    title: string;
    company_name: string;
    employer_id: string;
  } | null;
};

export const useGuestApplications = (employerId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['guest-applications', employerId],
    enabled: Boolean(employerId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_applications')
        .select('*, jobs!inner(id,title,company_name,employer_id)')
        .eq('jobs.employer_id', employerId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as GuestApplication[];
    },
    staleTime: 5 * 60 * 1000,
  });

  return { guestApplications: data || [], isLoading, error: error as Error | null };
};
