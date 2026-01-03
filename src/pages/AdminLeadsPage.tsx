import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/helpers";

const AdminLeadsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.email !== "duku@constantinmedia.ro") {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const { data: leads, isLoading } = useQuery({
    queryKey: ["ai-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_leads")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && user.email === "duku@constantinmedia.ro",
  });

  if (loading || (user?.email !== "duku@constantinmedia.ro")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Lead-uri Agenți AI</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nume</TableHead>
                    <TableHead>Companie</TableHead>
                    <TableHead>Email / Telefon</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Mesaj</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads?.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(lead.created_at)}</TableCell>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.company || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{lead.email}</span>
                          <span className="text-xs text-muted-foreground">{lead.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.agent || "General"}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={lead.message}>
                        {lead.message}
                      </TableCell>
                      <TableCell>
                        <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {leads?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nu există lead-uri momentan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AdminLeadsPage;
